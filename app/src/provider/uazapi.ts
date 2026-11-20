// UAZAPI (uazapiGO v2) talked to straight from the browser, the same way the
// Bubble app does it: every call sends the instance token in a `token` header,
// chats and messages come from the server's own store (/chat/find,
// /message/find) and live updates arrive on one Server-Sent Events stream.
import type {
  Chat,
  ChatFilter,
  Connection,
  Label,
  Lead,
  LiveEvent,
  Message,
  MessageKind,
  QuickReply,
} from './types';

type Raw = Record<string, any>;

const str = (v: unknown) => (v === null || v === undefined ? '' : String(v));
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const ms = (v: unknown) => {
  const n = num(v);
  if (!n) return 0;
  return n < 1e12 ? n * 1000 : n;
};
const bool = (v: unknown) => v === true || v === 'true' || v === 1;

export function normalizeUrl(url: string) {
  let u = url.trim().replace(/\/+$/, '');
  if (u && !/^https?:\/\//i.test(u)) u = 'https://' + u;
  return u;
}

export function stripJid(id: string) {
  return id.replace(/@(s\.whatsapp\.net|g\.us|c\.us|lid)$/, '');
}

export class UazapiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class Uazapi {
  readonly base: string;
  readonly token: string;

  constructor(conn: Pick<Connection, 'url' | 'token'>) {
    this.base = normalizeUrl(conn.url);
    this.token = conn.token.trim();
  }

  async call<T = any>(path: string, method: 'GET' | 'POST' | 'DELETE' = 'POST', body?: unknown): Promise<T> {
    let res: Response;
    try {
      res = await fetch(this.base + path, {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: this.token,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new UazapiError('Não foi possível falar com o servidor. Confira a URL.', 0);
    }
    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      const msg =
        (data && (data.error || data.message)) ||
        (res.status === 401 ? 'Token inválido.' : `Erro ${res.status}`);
      throw new UazapiError(Array.isArray(msg) ? msg.join('\n') : String(msg), res.status);
    }
    return data as T;
  }

  // ---- instance ---------------------------------------------------------
  async status() {
    const d = await this.call<Raw>('/instance/status', 'GET');
    const inst = d?.instance || {};
    const st = d?.status || {};
    return {
      name: str(inst.profileName || inst.name),
      instanceName: str(inst.name),
      picture: str(inst.profilePicUrl),
      connected: bool(st.connected) || inst.status === 'connected',
      state: str(inst.status || (st.connected ? 'connected' : 'disconnected')),
      owner: str(inst.owner || stripJid(str(st.jid))),
    };
  }

  // ---- chats ------------------------------------------------------------
  async findChats(opts: {
    filter: ChatFilter;
    me: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ chats: Chat[]; hasMore: boolean }> {
    const limit = opts.limit ?? 50;
    const body: Raw = {
      operator: 'AND',
      sort: '-wa_lastMsgTimestamp',
      limit,
      offset: opts.offset ?? 0,
    };
    const q = (opts.search || '').trim();
    if (q) {
      body.operator = 'OR';
      body.wa_name = '~' + q;
      body.wa_contactName = '~' + q;
      body.lead_name = '~' + q;
      body.wa_chatid = '~' + q.replace(/\D/g, '') || q;
    } else {
      switch (opts.filter) {
        case 'unread':
          body.wa_unreadCount = '>0';
          break;
        case 'groups':
          body.wa_isGroup = 'true';
          break;
        case 'mine':
          body.lead_assignedAttendant_id = opts.me || '__ninguem__';
          break;
        case 'open':
          body.lead_isTicketOpen = 'true';
          break;
        case 'archived':
          body.wa_archived = 'true';
          break;
        case 'blocked':
          body.wa_isBlocked = 'true';
          break;
      }
    }
    const d = await this.call<Raw>('/chat/find', 'POST', body);
    const list: Raw[] = Array.isArray(d?.chats) ? d.chats : Array.isArray(d) ? d : [];
    const chats = list.map(mapChat).filter((c) => c.id);
    chats.sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.lastAt - a.lastAt);
    const hasMore =
      d?.pagination?.hasNextPage ?? d?.pagination?.hasMore ?? list.length >= limit;
    return { chats, hasMore: Boolean(hasMore) };
  }

  async findChat(chatId: string): Promise<Chat | null> {
    const d = await this.call<Raw>('/chat/find', 'POST', { wa_chatid: chatId, limit: 1 });
    const list: Raw[] = Array.isArray(d?.chats) ? d.chats : [];
    return list.length ? mapChat(list[0]) : null;
  }

  markRead(chat: Chat) {
    return this.call('/chat/read', 'POST', { number: chat.number, read: true });
  }

  editLead(chat: Chat, fields: Raw) {
    return this.call('/chat/editLead', 'POST', { id: chat.rowId || chat.chatId, ...fields });
  }

  archive(chat: Chat, archive: boolean) {
    return this.call('/chat/archive', 'POST', { number: chat.number, archive });
  }

  pin(chat: Chat, pin: boolean) {
    return this.call('/chat/pin', 'POST', { number: chat.number, pin });
  }

  block(chat: Chat, block: boolean) {
    return this.call('/chat/block', 'POST', { number: chat.number, block });
  }

  deleteChat(chat: Chat) {
    return this.call('/chat/delete', 'POST', {
      number: chat.number,
      deleteChatDB: true,
      deleteMessagesDB: true,
      deleteChatWhatsApp: false,
    });
  }

  async checkNumber(number: string): Promise<{ ok: boolean; jid: string; name: string }> {
    const d = await this.call<any>('/chat/check', 'POST', { numbers: [number] });
    const row = Array.isArray(d) ? d[0] : d?.[0] || d;
    return {
      ok: bool(row?.isInWhatsapp ?? row?.exists),
      jid: str(row?.jid),
      name: str(row?.verifiedName),
    };
  }

  // ---- labels / quick replies ---------------------------------------
  async labels(): Promise<Label[]> {
    const d = await this.call<any>('/labels', 'GET');
    const list: Raw[] = Array.isArray(d) ? d : Array.isArray(d?.labels) ? d.labels : [];
    return list.map((l) => ({
      id: str(l.labelid || l.id),
      name: str(l.name),
      color: str(l.colorHex) || LABEL_COLORS[num(l.color) % LABEL_COLORS.length],
    }));
  }

  setLabels(chat: Chat, labelIds: string[]) {
    return this.call('/chat/labels', 'POST', { number: chat.number, labelids: labelIds });
  }

  async quickReplies(): Promise<QuickReply[]> {
    const d = await this.call<any>('/quickreply/showall', 'GET');
    const list: Raw[] = Array.isArray(d) ? d : Array.isArray(d?.quickReplies) ? d.quickReplies : [];
    return list
      .map((q) => ({ id: str(q.id), shortCut: str(q.shortCut), text: str(q.text) }))
      .filter((q) => q.shortCut || q.text);
  }

  // ---- messages -------------------------------------------------------
  async findMessages(chatId: string, limit = 60, offset = 0) {
    const d = await this.call<Raw>('/message/find', 'POST', { chatid: chatId, limit, offset });
    const list: Raw[] = Array.isArray(d?.messages) ? d.messages : Array.isArray(d) ? d : [];
    const messages = list.map(mapMessage).filter((m) => m.id);
    const hasMore = d?.hasMore ?? list.length >= limit;
    return { messages, hasMore: Boolean(hasMore) };
  }

  async sendText(chat: Chat, text: string, replyId?: string): Promise<Message | null> {
    const d = await this.call<Raw>('/send/text', 'POST', {
      number: chat.number,
      text,
      replyid: replyId || undefined,
      readchat: true,
    });
    return asMessage(d);
  }

  async sendMedia(
    chat: Chat,
    p: { type: string; file: string; caption?: string; docName?: string; replyId?: string },
  ): Promise<Message | null> {
    const d = await this.call<Raw>('/send/media', 'POST', {
      number: chat.number,
      type: p.type,
      file: p.file,
      text: p.caption || undefined,
      docName: p.docName || undefined,
      replyid: p.replyId || undefined,
      readchat: true,
    });
    return asMessage(d);
  }

  async download(messageId: string): Promise<{ url: string; mime: string; transcription: string }> {
    const d = await this.call<Raw>('/message/download', 'POST', { id: messageId, return_link: true });
    return { url: str(d?.fileURL || d?.fileUrl || d?.url), mime: str(d?.mimetype), transcription: str(d?.transcription) };
  }

  react(chat: Chat, messageId: string, emoji: string) {
    return this.call('/message/react', 'POST', { number: chat.number, id: messageId, text: emoji });
  }

  deleteMessage(messageId: string) {
    return this.call('/message/delete', 'POST', { id: messageId });
  }

  presence(chat: Chat, presence: 'composing' | 'recording' | 'paused') {
    return this.call('/message/presence', 'POST', { number: chat.number, presence, delay: 3000 }).catch(() => {});
  }

  // ---- live updates -------------------------------------------------
  live(onEvent: (e: LiveEvent) => void): () => void {
    let source: EventSource | null = null;
    let stopped = false;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let wait = 2000;

    const open = () => {
      if (stopped) return;
      onEvent({ kind: 'connection', state: 'connecting' });
      const events = ['chats', 'messages', 'messages_update', 'presence', 'chat_labels', 'leads'];
      const url =
        `${this.base}/sse?token=${encodeURIComponent(this.token)}` +
        events.map((e) => `&events=${e}`).join('');
      try {
        source = new EventSource(url);
      } catch {
        onEvent({ kind: 'connection', state: 'down' });
        return;
      }
      source.onopen = () => {
        wait = 2000;
        onEvent({ kind: 'connection', state: 'live' });
      };
      source.onmessage = (ev) => {
        let data: Raw;
        try {
          data = JSON.parse(ev.data);
        } catch {
          return;
        }
        if (data.type === 'connection') {
          onEvent({ kind: 'connection', state: 'live' });
          return;
        }
        const type = str(data.EventType);
        if (type === 'messages' && data.message) {
          const m = mapMessage(data.message);
          if (m.id) onEvent({ kind: 'message', message: m });
        } else if (type === 'messages_update') {
          const ids: string[] = data.event?.MessageIDs || [];
          const status = str(data.state || data.event?.Type || data.type);
          if (ids.length && status) onEvent({ kind: 'status', ids, status });
        } else if (type === 'presence' && data.event) {
          const e = data.event;
          if (e.IsGroup || e.IsFromMe) return;
          const number = stripJid(str(e.Chat));
          let state = str(e.State);
          if (e.Media === 'audio' && state === 'composing') state = 'recording';
          onEvent({
            kind: 'presence',
            chatKey: `${str(data.owner)}:${number}`,
            number,
            state: state === 'paused' ? '' : state,
          });
        } else if (data.chat && (data.chat.wa_fastid || data.chat.wa_chatid)) {
          onEvent({ kind: 'chat', chat: mapChat(data.chat) });
        }
      };
      source.onerror = () => {
        onEvent({ kind: 'connection', state: 'down' });
        source?.close();
        source = null;
        if (!stopped) {
          retry = setTimeout(open, wait);
          wait = Math.min(wait * 2, 30000);
        }
      };
    };

    open();
    return () => {
      stopped = true;
      if (retry) clearTimeout(retry);
      source?.close();
    };
  }
}

const LABEL_COLORS = [
  '#ff9485', '#64c4ff', '#ffd429', '#dfaef0', '#99b6c1', '#55ccb3', '#ff9dff', '#d3a91d',
  '#6d7cce', '#d7e752', '#00d0e2', '#ffc5c7', '#93ceac', '#f74848', '#00a0f2', '#83e422',
  '#ffaf04', '#b5ebff', '#9ba6ff', '#9368cf',
];

export function mapChat(c: Raw): Chat {
  const chatId = str(c.wa_chatid || c.chatid);
  const owner = str(c.owner);
  const number = stripJid(chatId);
  const id = str(c.wa_fastid) || (owner ? `${owner}:${number}` : number);
  const lead: Lead = {
    name: str(c.lead_name),
    fullName: str(c.lead_fullName),
    email: str(c.lead_email),
    personalId: str(c.lead_personalid),
    status: str(c.lead_status),
    notes: str(c.lead_notes),
    tags: Array.isArray(c.lead_tags) ? c.lead_tags.map(str).filter(Boolean) : [],
    ticketOpen: bool(c.lead_isTicketOpen),
    assignedTo: str(c.lead_assignedAttendant_id),
    botPausedUntil: ms(c.lead_disableChatBotUntil),
  };
  const isGroup = bool(c.wa_isGroup) || chatId.endsWith('@g.us');
  return {
    id,
    rowId: str(c.id),
    chatId,
    number: chatId || number,
    name: str(c.wa_contactName || c.wa_name || c.name || c.lead_name),
    phone: isGroup ? '' : str(c.phone) || number,
    image: str(c.imagePreview || c.image),
    isGroup,
    unread: num(c.wa_unreadCount),
    lastAt: ms(c.wa_lastMsgTimestamp),
    lastText: str(c.wa_lastMessageTextVote),
    lastType: str(c.wa_lastMessageType),
    lastFromMe: str(c.wa_lastMessageSender) !== '' && str(c.wa_lastMessageSender) === owner,
    archived: bool(c.wa_archived),
    pinned: bool(c.wa_isPinned),
    blocked: bool(c.wa_isBlocked),
    mutedUntil: ms(c.wa_muteEndTime),
    labels: Array.isArray(c.wa_label) ? c.wa_label.map((l: unknown) => str(l).split(':').pop() || '') : [],
    lead,
    raw: c,
  };
}

function kindOf(type: string, m: Raw): MessageKind {
  const t = type.toLowerCase();
  if (m.isDeleted || t.includes('revoke') || t.includes('protocol')) return 'deleted';
  if (t.includes('reaction')) return 'reaction';
  if (t.includes('image')) return 'image';
  if (t.includes('sticker')) return 'sticker';
  if (t.includes('video')) return 'video';
  if (t.includes('audio') || t.includes('ptt')) return 'audio';
  if (t.includes('document')) return 'document';
  if (t.includes('location')) return 'location';
  if (t.includes('contact')) return 'contact';
  if (t.includes('poll')) return 'poll';
  if (!t || t.includes('conversation') || t.includes('text')) return 'text';
  return 'other';
}

export function mapMessage(m: Raw): Message {
  const type = str(m.messageType);
  const content: Raw = m.content && typeof m.content === 'object' ? m.content : {};
  const thumbB64 = str(content.JPEGThumbnail);
  return {
    id: str(m.messageid || m.id),
    chatId: str(m.chatid),
    fromMe: bool(m.fromMe),
    at: ms(m.messageTimestamp) || Date.now(),
    kind: kindOf(type, m),
    type,
    text: str(m.text || (typeof m.content === 'string' ? m.content : '') || content.text || content.caption),
    caption: str(content.caption),
    senderName: str(m.senderName),
    status: str(m.status),
    quotedId: str(m.quoted),
    reaction: str(m.reaction),
    edited: str(m.edited),
    fileUrl: str(m.fileURL || m.fileurl),
    thumb: thumbB64 ? (thumbB64.startsWith('data:') ? thumbB64 : `data:image/jpeg;base64,${thumbB64}`) : '',
    fileName: str(content.fileName || content.title),
    mime: str(content.mimetype),
    seconds: num(content.seconds),
    lat: content.degreesLatitude !== undefined ? num(content.degreesLatitude) : undefined,
    lng: content.degreesLongitude !== undefined ? num(content.degreesLongitude) : undefined,
    raw: m,
  };
}

function asMessage(d: Raw | null): Message | null {
  if (!d || typeof d !== 'object') return null;
  const m = d.message && typeof d.message === 'object' ? d.message : d;
  if (!m.messageid && !m.id) return null;
  return mapMessage(m);
}
