import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Chat, ChatFilter, Connection, Label, LiveEvent, Message, QuickReply } from './provider/types';
import { Uazapi, stripJid } from './provider/uazapi';
import { DemoUazapi } from './provider/demo';
import {
  loadActiveId,
  loadConnections,
  loadSettings,
  saveActiveId,
  saveConnections,
  saveSettings,
  type Settings,
} from './lib/storage';
import { fileToDataUrl, mediaTypeFor } from './lib/format';
import { CredentialsModal } from './components/CredentialsModal';
import { ChatList, chatTitle } from './components/ChatList';
import { ChatPanel } from './components/ChatPanel';
import { EmptyState } from './components/EmptyState';
import { LeadPanel } from './components/LeadPanel';
import { ConfirmDialog, LabelsDialog, NewChatDialog, SettingsDialog } from './components/Dialogs';

const PAGE = 50;
const MSG_PAGE = 60;

type Live = 'off' | 'connecting' | 'live' | 'down';

function beep() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.3);
    setTimeout(() => ctx.close(), 500);
  } catch {
    /* sound is optional */
  }
}

function passes(c: Chat, f: ChatFilter, me: string) {
  switch (f) {
    case 'unread':
      return c.unread > 0;
    case 'groups':
      return c.isGroup;
    case 'mine':
      return !!me && c.lead.assignedTo === me;
    case 'open':
      return c.lead.ticketOpen;
    case 'archived':
      return c.archived;
    case 'blocked':
      return c.blocked;
    default:
      return true;
  }
}

const sortChats = (list: Chat[]) =>
  [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.lastAt - a.lastAt);

const DEMO = new URLSearchParams(window.location.search).has('demo');
const DEMO_CONN: Connection = { id: 'demo', provider: 'uazapi', name: 'Loja Demo', url: 'https://demo.local', token: 'demo' };

export default function App() {
  const [connections, setConnections] = useState<Connection[]>(() => (DEMO ? [DEMO_CONN] : loadConnections()));
  const [activeId, setActiveId] = useState(() => {
    if (DEMO) return 'demo';
    const list = loadConnections();
    const id = loadActiveId();
    return list.some((c) => c.id === id) ? id : list[0]?.id || '';
  });
  const [settings, setSettings] = useState<Settings>(() =>
    DEMO ? { ...loadSettings(), attendantName: loadSettings().attendantName || 'Marina', attendantId: loadSettings().attendantId || 'Marina' } : loadSettings(),
  );
  const conn = connections.find((c) => c.id === activeId) || null;
  const api = useMemo(() => (conn ? (DEMO ? new DemoUazapi() : new Uazapi(conn)) : null), [conn?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const me = settings.attendantId || settings.attendantName;

  const [showCreds, setShowCreds] = useState(false);
  const [instName, setInstName] = useState('');
  const [instState, setInstState] = useState('');
  const [live, setLive] = useState<Live>('off');

  const [chats, setChats] = useState<Chat[]>([]);
  const [filter, setFilter] = useState<ChatFilter>('all');
  const [search, setSearch] = useState('');
  const [listLoading, setListLoading] = useState(false);
  const [listMore, setListMore] = useState(false);
  const [listError, setListError] = useState('');
  const listOffset = useRef(0);
  const listReq = useRef(0);

  const [labels, setLabels] = useState<Label[]>([]);
  const [quick, setQuick] = useState<QuickReply[]>([]);

  const [openId, setOpenId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgMore, setMsgMore] = useState(false);
  const [msgError, setMsgError] = useState('');
  const msgOffset = useRef(0);
  const msgReq = useRef(0);

  const [leadOpen, setLeadOpen] = useState(false);
  const [labelsOpen, setLabelsOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirm, setConfirm] = useState<null | { title: string; text: string; action: string; run: () => void }>(null);
  const [toast, setToast] = useState('');

  const openChat = chats.find((c) => c.id === openId) || null;
  const openRef = useRef<Chat | null>(null);
  openRef.current = openChat;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const filterRef = useRef({ filter, search, me });
  filterRef.current = { filter, search, me };

  const notify = useCallback((t: string) => {
    setToast(t);
    window.clearTimeout((notify as any)._t);
    (notify as any)._t = window.setTimeout(() => setToast(''), 3500);
  }, []);

  // ---- connections ------------------------------------------------------
  function persistConnections(list: Connection[], active: string) {
    setConnections(list);
    saveConnections(list);
    setActiveId(active);
    saveActiveId(active);
  }

  useEffect(() => {
    if (!conn) setShowCreds(true);
  }, [conn]);

  // ---- instance + reference data -------------------------------------------
  useEffect(() => {
    setChats([]);
    setOpenId('');
    setMessages([]);
    setLabels([]);
    setQuick([]);
    setInstName('');
    setInstState('');
    if (!api) return;
    api
      .status()
      .then((s) => {
        setInstName(s.name || s.instanceName);
        setInstState(s.connected ? 'connected' : s.state || 'disconnected');
      })
      .catch((e) => setInstState('erro: ' + e.message));
    api.labels().then(setLabels).catch(() => {});
    api.quickReplies().then(setQuick).catch(() => {});
  }, [api]);

  useEffect(() => {
    document.title = 'Multi - ' + (instName || '');
  }, [instName]);

  // ---- chat list -----------------------------------------------------------
  const loadChats = useCallback(
    async (reset: boolean) => {
      if (!api) return;
      const req = ++listReq.current;
      if (reset) listOffset.current = 0;
      setListLoading(true);
      setListError('');
      try {
        const { chats: page, hasMore } = await api.findChats({
          filter,
          me,
          search,
          limit: PAGE,
          offset: listOffset.current,
        });
        if (req !== listReq.current) return;
        listOffset.current += PAGE;
        setListMore(hasMore && page.length > 0);
        setChats((prev) => {
          const keep = new Map<string, Chat>();
          if (!reset) prev.forEach((c) => keep.set(c.id, c));
          // keep the open chat even if it falls outside the filter
          const open = openRef.current;
          if (reset && open) keep.set(open.id, open);
          page.forEach((c) => keep.set(c.id, { ...c, presence: keep.get(c.id)?.presence }));
          return sortChats([...keep.values()]);
        });
      } catch (e) {
        if (req === listReq.current) setListError((e as Error).message);
      } finally {
        if (req === listReq.current) setListLoading(false);
      }
    },
    [api, filter, search, me],
  );

  useEffect(() => {
    loadChats(true);
  }, [loadChats]);

  // Deep link: ?c=<number or chat id> opens that conversation once it is loaded.
  const deepLink = useRef(new URLSearchParams(window.location.search).get('c') || '');
  useEffect(() => {
    const want = deepLink.current;
    if (!want || !chats.length) return;
    const hit = chats.find((c) => c.chatId === want || stripJid(c.chatId) === want.replace(/\D/g, ''));
    deepLink.current = '';
    if (hit) selectChat(hit);
  }, [chats]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- messages ------------------------------------------------------------
  const loadMessages = useCallback(
    async (chat: Chat, reset: boolean) => {
      if (!api) return;
      const req = ++msgReq.current;
      if (reset) {
        msgOffset.current = 0;
        setMessages([]);
      }
      setMsgLoading(true);
      setMsgError('');
      try {
        const { messages: page, hasMore } = await api.findMessages(chat.chatId, MSG_PAGE, msgOffset.current);
        if (req !== msgReq.current) return;
        msgOffset.current += MSG_PAGE;
        setMsgMore(hasMore && page.length > 0);
        setMessages((prev) => {
          const map = new Map<string, Message>();
          (reset ? [] : prev).forEach((m) => map.set(m.id, m));
          page.forEach((m) => map.set(m.id, m));
          return [...map.values()];
        });
      } catch (e) {
        if (req === msgReq.current) setMsgError((e as Error).message);
      } finally {
        if (req === msgReq.current) setMsgLoading(false);
      }
    },
    [api],
  );

  function selectChat(c: Chat) {
    setOpenId(c.id);
    loadMessages(c, true);
    if (c.unread > 0 && api) {
      setChats((list) => list.map((x) => (x.id === c.id ? { ...x, unread: 0 } : x)));
      api.markRead(c).catch(() => {});
    }
  }

  // ---- live updates (SSE), with polling as a fallback -------------------
  const onLive = useCallback(
    (e: LiveEvent) => {
      if (e.kind === 'connection') {
        setLive(e.state);
        return;
      }
      if (e.kind === 'chat') {
        const incoming = e.chat;
        setChats((list) => {
          const i = list.findIndex((c) => c.id === incoming.id || (c.chatId && c.chatId === incoming.chatId));
          const { filter: f, search: q, me: who } = filterRef.current;
          if (i >= 0) {
            const prev = list[i];
            const merged: Chat = {
              ...prev,
              ...incoming,
              name: incoming.name || prev.name,
              image: incoming.image || prev.image,
              presence: prev.presence,
            };
            if (openRef.current?.id === prev.id && document.hasFocus()) merged.unread = 0;
            const next = [...list];
            next[i] = merged;
            return sortChats(next);
          }
          if (q || !passes(incoming, f, who)) return list;
          return sortChats([incoming, ...list]);
        });
        return;
      }
      if (e.kind === 'message') {
        const m = e.message;
        const open = openRef.current;
        if (open && (m.chatId === open.chatId || stripJid(m.chatId) === stripJid(open.chatId))) {
          setMessages((list) => {
            const rest = list.filter(
              (x) => x.id !== m.id && !(x.pending && m.fromMe && (x.text === m.text || x.kind === m.kind)),
            );
            return [...rest, m];
          });
          if (!m.fromMe && document.hasFocus() && api) api.markRead(open).catch(() => {});
        }
        if (!m.fromMe && m.kind !== 'reaction') {
          if (settingsRef.current.sound) beep();
        }
        // keep the list preview fresh even when no chat event follows
        setChats((list) => {
          const i = list.findIndex((c) => c.chatId === m.chatId);
          if (i < 0) return list;
          const c = list[i];
          const next = [...list];
          next[i] = {
            ...c,
            lastAt: Math.max(c.lastAt, m.at),
            lastText: m.text || c.lastText,
            lastType: m.type || c.lastType,
            presence: m.fromMe ? c.presence : '',
          };
          return sortChats(next);
        });
        return;
      }
      if (e.kind === 'status') {
        const ids = new Set(e.ids);
        setMessages((list) => list.map((m) => (ids.has(m.id) ? { ...m, status: e.status } : m)));
        return;
      }
      if (e.kind === 'presence') {
        setChats((list) =>
          list.map((c) =>
            c.id === e.chatKey || stripJid(c.chatId) === e.number ? { ...c, presence: e.state } : c,
          ),
        );
        if (e.state) {
          setTimeout(() => {
            setChats((list) =>
              list.map((c) => (stripJid(c.chatId) === e.number && c.presence === e.state ? { ...c, presence: '' } : c)),
            );
          }, 8000);
        }
      }
    },
    [api],
  );

  useEffect(() => {
    if (!api) {
      setLive('off');
      return;
    }
    return api.live(onLive);
  }, [api, onLive]);

  useEffect(() => {
    if (!api || live === 'live') return;
    const t = setInterval(() => {
      loadChats(true);
      const open = openRef.current;
      if (open) {
        api
          .findMessages(open.chatId, 30, 0)
          .then(({ messages: page }) =>
            setMessages((prev) => {
              const map = new Map(prev.map((m) => [m.id, m]));
              page.forEach((m) => map.set(m.id, m));
              return [...map.values()];
            }),
          )
          .catch(() => {});
      }
    }, 15000);
    return () => clearInterval(t);
  }, [api, live, loadChats]);

  useEffect(() => {
    const total = chats.reduce((n, c) => n + (c.unread > 0 ? 1 : 0), 0);
    document.title = (total ? `(${total}) ` : '') + 'Multi - ' + (instName || '');
  }, [chats, instName]);

  // ---- actions -----------------------------------------------------------
  function patchChat(id: string, patch: (c: Chat) => Chat) {
    setChats((list) => list.map((c) => (c.id === id ? patch(c) : c)));
  }

  async function editLead(c: Chat, fields: Record<string, unknown>, local: (c: Chat) => Chat) {
    if (!api) return;
    const before = c;
    patchChat(c.id, local);
    try {
      await api.editLead(c, fields);
    } catch (e) {
      patchChat(c.id, () => before);
      notify('Não foi possível salvar: ' + (e as Error).message);
      throw e;
    }
  }

  function requireMe(): boolean {
    if (me) return true;
    notify('Informe seu nome de atendente em Configurações.');
    setSettingsOpen(true);
    return false;
  }

  function toggleAssign(c: Chat) {
    if (!requireMe()) return;
    const mine = c.lead.assignedTo === me;
    if (mine) {
      editLead(c, { lead_assignedAttendant_id: '' }, (x) => ({ ...x, lead: { ...x.lead, assignedTo: '' } })).catch(() => {});
      return;
    }
    // Taking over a conversation also opens the ticket and pauses the robot,
    // so the automatic replies stop while a person is answering.
    const until = Date.now() + settings.botPauseHours * 3600_000;
    editLead(
      c,
      {
        lead_assignedAttendant_id: me,
        lead_isTicketOpen: true,
        lead_disableChatBotUntil: Math.floor(until / 1000),
      },
      (x) => ({ ...x, lead: { ...x.lead, assignedTo: me, ticketOpen: true, botPausedUntil: until } }),
    )
      .then(() => notify('Conversa atribuída a você. Robô pausado.'))
      .catch(() => {});
  }

  function toggleTicket(c: Chat) {
    const open = !c.lead.ticketOpen;
    editLead(c, { lead_isTicketOpen: open }, (x) => ({ ...x, lead: { ...x.lead, ticketOpen: open } }))
      .then(() => notify(open ? 'Atendimento aberto' : 'Atendimento concluído'))
      .catch(() => {});
  }

  function toggleBot(c: Chat) {
    const paused = c.lead.botPausedUntil > Date.now();
    const until = paused ? 0 : Date.now() + settings.botPauseHours * 3600_000;
    editLead(c, { lead_disableChatBotUntil: Math.floor(until / 1000) }, (x) => ({
      ...x,
      lead: { ...x.lead, botPausedUntil: until },
    }))
      .then(() => notify(paused ? 'Robô reativado nesta conversa' : `Robô pausado por ${settings.botPauseHours} h`))
      .catch(() => {});
  }

  function sign(text: string) {
    const name = settings.attendantName.trim();
    return settings.signMessages && name ? `*${name}:*\n${text}` : text;
  }

  function addPending(c: Chat, m: Partial<Message>): string {
    const id = 'tmp-' + Math.random().toString(36).slice(2);
    const msg: Message = {
      id,
      chatId: c.chatId,
      fromMe: true,
      at: Date.now(),
      kind: 'text',
      type: '',
      text: '',
      caption: '',
      senderName: '',
      status: '',
      quotedId: '',
      reaction: '',
      edited: '',
      fileUrl: '',
      thumb: '',
      fileName: '',
      mime: '',
      seconds: 0,
      pending: true,
      raw: {},
      ...m,
    };
    setMessages((list) => [...list, msg]);
    patchChat(c.id, (x) => ({ ...x, lastAt: msg.at, lastText: msg.text || x.lastText }));
    return id;
  }

  function settle(tempId: string, real: Message | null, failed = false) {
    setMessages((list) => {
      if (failed) return list.map((m) => (m.id === tempId ? { ...m, pending: false, failed: true } : m));
      if (!real) return list.map((m) => (m.id === tempId ? { ...m, pending: false, status: 'sent' } : m));
      const withoutTemp = list.filter((m) => m.id !== tempId && m.id !== real.id);
      return [...withoutTemp, { ...real, fromMe: true }];
    });
  }

  async function sendText(text: string, replyTo: Message | null) {
    const c = openRef.current;
    if (!c || !api) return;
    const body = sign(text);
    const tmp = addPending(c, { text: body, quotedId: replyTo?.id || '' });
    try {
      settle(tmp, await api.sendText(c, body, replyTo?.id));
    } catch (e) {
      settle(tmp, null, true);
      throw e;
    }
  }

  async function sendFile(file: File, caption: string, replyTo: Message | null) {
    const c = openRef.current;
    if (!c || !api) return;
    const type = mediaTypeFor(file.type || '');
    const dataUrl = await fileToDataUrl(file);
    const tmp = addPending(c, {
      kind: type === 'sticker' ? 'sticker' : (type as Message['kind']),
      text: caption,
      fileName: file.name,
      fileUrl: type === 'image' || type === 'video' || type === 'audio' ? URL.createObjectURL(file) : '',
      quotedId: replyTo?.id || '',
    });
    try {
      const real = await api.sendMedia(c, {
        type,
        file: dataUrl,
        caption: caption ? sign(caption) : undefined,
        docName: type === 'document' ? file.name : undefined,
        replyId: replyTo?.id,
      });
      settle(tmp, real);
    } catch (e) {
      settle(tmp, null, true);
      throw e;
    }
  }

  async function sendVoice(dataUrl: string, seconds: number) {
    const c = openRef.current;
    if (!c || !api) return;
    const tmp = addPending(c, { kind: 'audio', fileUrl: dataUrl, seconds });
    try {
      settle(tmp, await api.sendMedia(c, { type: 'ptt', file: dataUrl }));
    } catch (e) {
      settle(tmp, null, true);
      throw e;
    }
  }

  async function startChat(number: string) {
    if (!api) return;
    const check = await api.checkNumber(number);
    if (!check.ok) throw new Error('Esse número não está no WhatsApp.');
    const jid = check.jid || `${number}@s.whatsapp.net`;
    const existing = chats.find((c) => c.chatId === jid || stripJid(c.chatId) === number);
    if (existing) return selectChat(existing);
    const found = await api.findChat(jid).catch(() => null);
    const chat: Chat = found || {
      id: jid,
      rowId: '',
      chatId: jid,
      number: jid,
      name: check.name,
      phone: number,
      image: '',
      isGroup: false,
      unread: 0,
      lastAt: Date.now(),
      lastText: '',
      lastType: '',
      lastFromMe: false,
      archived: false,
      pinned: false,
      blocked: false,
      mutedUntil: 0,
      labels: [],
      lead: {
        name: '',
        fullName: '',
        email: '',
        personalId: '',
        status: '',
        notes: '',
        tags: [],
        ticketOpen: false,
        assignedTo: '',
        botPausedUntil: 0,
      },
      raw: {},
    };
    setChats((list) => sortChats([chat, ...list.filter((c) => c.id !== chat.id)]));
    selectChat(chat);
  }

  async function chatAction(c: Chat, run: () => Promise<unknown>, local: (c: Chat) => Chat, ok: string) {
    const before = c;
    patchChat(c.id, local);
    try {
      await run();
      notify(ok);
    } catch (e) {
      patchChat(c.id, () => before);
      notify('Erro: ' + (e as Error).message);
    }
  }

  // ---- render --------------------------------------------------------------
  const statusText = !conn
    ? 'conecte sua instância para começar'
    : instState === 'connected'
      ? `conectado${instName ? ' como ' + instName : ''}${live === 'live' ? ' · tempo real ativo' : live === 'down' ? ' · atualizando a cada 15 s' : ''}`
      : instState
        ? `instância ${instState}`
        : 'conectando…';

  const moreMenu = [
    { label: 'Minhas credenciais', icon: 'key', onClick: () => setShowCreds(true) },
    { label: 'Configurações', icon: 'settings', onClick: () => setSettingsOpen(true) },
    ...connections
      .filter((c) => c.id !== activeId)
      .map((c) => ({ label: 'Trocar para ' + c.name, icon: 'refresh', onClick: () => persistConnections(connections, c.id) })),
    ...(conn
      ? [
          {
            label: 'Sair',
            icon: 'logout',
            danger: true,
            onClick: () =>
              setConfirm({
                title: 'Sair',
                text: `Remover a credencial “${conn.name}” deste navegador?`,
                action: 'Sair',
                run: () => {
                  const rest = connections.filter((x) => x.id !== conn.id);
                  persistConnections(rest, rest[0]?.id || '');
                },
              }),
          },
        ]
      : []),
  ];

  return (
    <div className={'app' + (openChat ? ' has-chat' : '') + (leadOpen && openChat ? ' has-lead' : '')}>
      <ChatList
        chats={chats}
        labels={labels}
        filter={filter}
        search={search}
        loading={listLoading}
        hasMore={listMore}
        error={listError}
        activeId={openId}
        me={me}
        connected={!!conn}
        onFilter={setFilter}
        onSearch={setSearch}
        onRefresh={() => {
          loadChats(true);
          api?.labels().then(setLabels).catch(() => {});
          api?.quickReplies().then(setQuick).catch(() => {});
          if (openChat) loadMessages(openChat, true);
        }}
        onMore={() => loadChats(false)}
        onOpen={selectChat}
        onNew={() => (conn ? setNewOpen(true) : setShowCreds(true))}
        menu={moreMenu}
      />

      {openChat ? (
        <ChatPanel
          chat={openChat}
          me={me}
          messages={messages}
          loading={msgLoading}
          hasMore={msgMore}
          error={msgError}
          quickReplies={quick}
          onBack={() => {
            setOpenId('');
            setLeadOpen(false);
          }}
          onLoadOlder={() => loadMessages(openChat, false)}
          onSendText={sendText}
          onSendFile={sendFile}
          onSendVoice={sendVoice}
          onReact={(m, emoji) =>
            api
              ?.react(openChat, m.id, emoji)
              .then(() =>
                setMessages((list) => [
                  ...list,
                  { ...m, id: 'r-' + m.id + emoji, kind: 'reaction', reaction: m.id, text: emoji, fromMe: true, at: Date.now() },
                ]),
              )
              .catch((e) => notify('Erro: ' + e.message))
          }
          onDelete={(m) =>
            setConfirm({
              title: 'Apagar mensagem',
              text: 'Apagar esta mensagem para todos?',
              action: 'Apagar',
              run: () =>
                api
                  ?.deleteMessage(m.id)
                  .then(() => setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, kind: 'deleted' } : x))))
                  .catch((e) => notify('Erro: ' + e.message)),
            })
          }
          onDownload={async (m) => {
            const r = await api!.download(m.id);
            if (!r.url) throw new Error('sem arquivo');
            setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, fileUrl: r.url } : x)));
            return r.url;
          }}
          onTyping={(s) => api?.presence(openChat, s)}
          onAssign={() => toggleAssign(openChat)}
          onTicket={() => toggleTicket(openChat)}
          onBot={() => toggleBot(openChat)}
          onInfo={() => setLeadOpen((v) => !v)}
          onLabels={() => setLabelsOpen(true)}
          onArchive={() =>
            chatAction(
              openChat,
              () => api!.archive(openChat, !openChat.archived),
              (x) => ({ ...x, archived: !x.archived }),
              openChat.archived ? 'Conversa desarquivada' : 'Conversa arquivada',
            )
          }
          onPin={() =>
            chatAction(
              openChat,
              () => api!.pin(openChat, !openChat.pinned),
              (x) => ({ ...x, pinned: !x.pinned }),
              openChat.pinned ? 'Chat desafixado' : 'Chat fixado',
            )
          }
          onBlock={() =>
            setConfirm({
              title: openChat.blocked ? 'Desbloquear contato' : 'Bloquear contato',
              text: `${openChat.blocked ? 'Desbloquear' : 'Bloquear'} ${chatTitle(openChat)}?`,
              action: openChat.blocked ? 'Desbloquear' : 'Bloquear',
              run: () =>
                chatAction(
                  openChat,
                  () => api!.block(openChat, !openChat.blocked),
                  (x) => ({ ...x, blocked: !x.blocked }),
                  openChat.blocked ? 'Contato desbloqueado' : 'Contato bloqueado',
                ),
            })
          }
          onDeleteChat={() =>
            setConfirm({
              title: 'Apagar chat',
              text: `Apagar a conversa com ${chatTitle(openChat)} do servidor? O histórico no celular não é apagado.`,
              action: 'Apagar',
              run: () =>
                api!
                  .deleteChat(openChat)
                  .then(() => {
                    setChats((l) => l.filter((x) => x.id !== openChat.id));
                    setOpenId('');
                    notify('Chat apagado');
                  })
                  .catch((e) => notify('Erro: ' + e.message)),
            })
          }
        />
      ) : (
        <EmptyState status={statusText} />
      )}

      {leadOpen && openChat && (
        <LeadPanel
          chat={openChat}
          labels={labels}
          me={me}
          onClose={() => setLeadOpen(false)}
          onLabels={() => setLabelsOpen(true)}
          onSave={(fields) =>
            editLead(openChat, fields, (x) => ({
              ...x,
              lead: {
                ...x.lead,
                name: String(fields.lead_name ?? x.lead.name),
                fullName: String(fields.lead_fullName ?? x.lead.fullName),
                email: String(fields.lead_email ?? x.lead.email),
                personalId: String(fields.lead_personalid ?? x.lead.personalId),
                status: String(fields.lead_status ?? x.lead.status),
                notes: String(fields.lead_notes ?? x.lead.notes),
                tags: (fields.lead_tags as string[]) ?? x.lead.tags,
              },
            }))
          }
        />
      )}

      {labelsOpen && openChat && (
        <LabelsDialog
          labels={labels}
          selected={openChat.labels}
          onClose={() => setLabelsOpen(false)}
          onSave={async (ids) => {
            await api!.setLabels(openChat, ids);
            patchChat(openChat.id, (x) => ({ ...x, labels: ids }));
            notify('Etiquetas atualizadas');
          }}
        />
      )}

      {newOpen && <NewChatDialog onClose={() => setNewOpen(false)} onStart={startChat} />}

      {settingsOpen && (
        <SettingsDialog
          settings={settings}
          onClose={() => setSettingsOpen(false)}
          onSave={(s) => {
            setSettings(s);
            saveSettings(s);
          }}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          text={confirm.text}
          action={confirm.action}
          onClose={() => setConfirm(null)}
          onConfirm={confirm.run}
        />
      )}

      {(showCreds || !conn) && (
        <CredentialsModal
          connections={connections}
          activeId={activeId}
          canClose={!!conn}
          onClose={() => setShowCreds(false)}
          onSave={(c) => {
            const rest = connections.filter((x) => x.id !== c.id);
            persistConnections([...rest, c], c.id);
            setShowCreds(false);
            notify('Credencial salva');
          }}
          onSelect={(id) => {
            persistConnections(connections, id);
            setShowCreds(false);
          }}
          onRemove={(id) => {
            const rest = connections.filter((x) => x.id !== id);
            persistConnections(rest, id === activeId ? rest[0]?.id || '' : activeId);
          }}
        />
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
