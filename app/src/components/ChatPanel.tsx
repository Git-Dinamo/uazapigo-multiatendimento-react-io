import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Chat, Message, QuickReply } from '../provider/types';
import { dayLabel, formatPhone } from '../lib/format';
import { Avatar } from './Avatar';
import { chatTitle } from './ChatList';
import { Composer } from './Composer';
import { Icon } from './Icon';
import { Menu } from './Menu';
import { MessageBubble } from './MessageBubble';

interface Props {
  chat: Chat;
  me: string;
  messages: Message[];
  loading: boolean;
  hasMore: boolean;
  error: string;
  quickReplies: QuickReply[];
  onBack: () => void;
  onLoadOlder: () => void;
  onSendText: (text: string, replyTo: Message | null) => Promise<void>;
  onSendFile: (file: File, caption: string, replyTo: Message | null) => Promise<void>;
  onSendVoice: (dataUrl: string, seconds: number) => Promise<void>;
  onReact: (m: Message, emoji: string) => void;
  onDelete: (m: Message) => void;
  onDownload: (m: Message) => Promise<string>;
  onTyping: (s: 'composing' | 'recording') => void;
  onAssign: () => void;
  onTicket: () => void;
  onBot: () => void;
  onInfo: () => void;
  onLabels: () => void;
  onArchive: () => void;
  onPin: () => void;
  onBlock: () => void;
  onDeleteChat: () => void;
}

export function ChatPanel(p: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [menu, setMenu] = useState(false);
  const stick = useRef(true);
  const prevHeight = useRef(0);
  const prevFirst = useRef('');

  const { visible, reactions, byId } = useMemo(() => {
    const byId = new Map<string, Message>();
    const reactions = new Map<string, string[]>();
    const visible: Message[] = [];
    const sorted = [...p.messages].sort((a, b) => a.at - b.at);
    for (const m of sorted) {
      byId.set(m.id, m);
      if (m.kind === 'reaction') {
        if (m.reaction && m.text) reactions.set(m.reaction, [...(reactions.get(m.reaction) || []), m.text]);
        continue;
      }
      visible.push(m);
    }
    return { visible, reactions, byId };
  }, [p.messages]);

  useEffect(() => {
    setReplyTo(null);
    stick.current = true;
  }, [p.chat.id]);

  // Keep the view at the bottom for new messages, and in place when older ones load above.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const first = visible[0]?.id || '';
    if (prevFirst.current && first !== prevFirst.current && !stick.current) {
      el.scrollTop += el.scrollHeight - prevHeight.current;
    } else if (stick.current) {
      el.scrollTop = el.scrollHeight;
    }
    prevFirst.current = first;
    prevHeight.current = el.scrollHeight;
  }, [visible]);

  const c = p.chat;
  const lead = c.lead;
  const mine = lead.assignedTo && lead.assignedTo === p.me;
  const botPaused = lead.botPausedUntil > Date.now();
  const sub =
    c.presence === 'composing'
      ? 'Digitando...'
      : c.presence === 'recording'
        ? 'Gravando...'
        : c.isGroup
          ? 'Grupo'
          : formatPhone(c.phone);

  let lastDay = '';

  return (
    <section className="chat">
      <header className="chat-head blur">
        <button className="ib grey back" aria-label="Voltar" onClick={p.onBack}>
          <Icon name="back" />
        </button>
        <button className="ch-who" onClick={p.onInfo}>
          <Avatar src={c.image} group={c.isGroup} size={40} />
          <span>
            <strong>{chatTitle(c)}</strong>
            <small className={c.presence ? 'typing' : ''}>{sub}</small>
          </span>
        </button>
        <div className="ch-actions">
          <button
            className={'pill' + (mine ? ' on' : lead.assignedTo ? ' other' : '')}
            onClick={p.onAssign}
            title={mine ? 'Remover atribuição' : 'Atribuir à mim'}
          >
            <Icon name="person" size={18} />
            <span>{mine ? 'Comigo' : lead.assignedTo ? lead.assignedTo : 'Atribuir à mim'}</span>
          </button>
          <button
            className={'pill' + (lead.ticketOpen ? ' warn' : '')}
            onClick={p.onTicket}
            title={lead.ticketOpen ? 'Marcar como concluído' : 'Abrir atendimento'}
          >
            <Icon name={lead.ticketOpen ? 'unlock' : 'lock'} size={18} />
            <span>{lead.ticketOpen ? 'Em aberto' : 'Fechado'}</span>
          </button>
          <button
            className={'pill' + (botPaused ? ' off' : ' bot')}
            onClick={p.onBot}
            title={botPaused ? 'Reativar o robô' : 'Pausar o robô nesta conversa'}
          >
            <Icon name="robot" size={18} />
            <span>{botPaused ? 'Robô pausado' : 'Robô ativo'}</span>
          </button>
          <button className="ib grey" aria-label="Etiquetar" title="Etiquetas" onClick={p.onLabels}>
            <Icon name="label" />
          </button>
          <button className="ib grey" aria-label="Dados do contato" title="Dados do contato" onClick={p.onInfo}>
            <Icon name="info" />
          </button>
          <div className="rel">
            <button className="ib grey" aria-label="Mais opções" onClick={() => setMenu((v) => !v)}>
              <Icon name="more" />
            </button>
            {menu && (
              <Menu
                onClose={() => setMenu(false)}
                items={[
                  { label: mine ? 'Remover atribuição' : 'Atribuir à mim', icon: 'person', onClick: p.onAssign },
                  { label: lead.ticketOpen ? 'Marcar como concluído' : 'Abrir atendimento', icon: 'ok', onClick: p.onTicket },
                  { label: botPaused ? 'Reativar robô' : 'Pausar robô', icon: 'robot', onClick: p.onBot },
                  { label: 'Etiquetar', icon: 'label', onClick: p.onLabels },
                  { label: c.pinned ? 'Desafixar Chat' : 'Fixar Chat', icon: 'pin', onClick: p.onPin },
                  { label: c.archived ? 'Desarquivar conversa' : 'Arquivar conversa', icon: 'archive', onClick: p.onArchive },
                  ...(c.isGroup
                    ? []
                    : [{ label: c.blocked ? 'Desbloquear contato' : 'Bloquear contato', icon: 'block', onClick: p.onBlock }]),
                  { label: 'Apagar chat', icon: 'trash', danger: true, onClick: p.onDeleteChat },
                ]}
              />
            )}
          </div>
        </div>
      </header>

      <div
        className="msgs"
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget;
          stick.current = el.scrollTop + el.clientHeight > el.scrollHeight - 80;
          if (el.scrollTop < 120 && p.hasMore && !p.loading) {
            prevHeight.current = el.scrollHeight;
            p.onLoadOlder();
          }
        }}
      >
        <div className="msgs-inner">
          {p.hasMore && (
            <button className="older" onClick={p.onLoadOlder} disabled={p.loading}>
              {p.loading ? 'Carregando…' : 'Carregar mensagens anteriores'}
            </button>
          )}
          {p.error && <div className="sys err">{p.error}</div>}
          {!p.loading && !p.error && visible.length === 0 && <div className="sys">Nenhuma mensagem ainda.</div>}
          {visible.map((m) => {
            const d = dayLabel(m.at);
            const sep = d !== lastDay;
            lastDay = d;
            return (
              <div key={m.id}>
                {sep && <div className="day">{d}</div>}
                <MessageBubble
                  m={m}
                  quoted={m.quotedId ? byId.get(m.quotedId) : undefined}
                  reactions={reactions.get(m.id) || []}
                  showSender={c.isGroup}
                  contactName={c.isGroup ? '' : chatTitle(c)}
                  onReply={setReplyTo}
                  onReact={p.onReact}
                  onDelete={p.onDelete}
                  onDownload={p.onDownload}
                />
              </div>
            );
          })}
        </div>
      </div>

      <Composer
        disabled={c.blocked ? 'Contato bloqueado. Desbloqueie para enviar mensagens.' : undefined}
        replyTo={replyTo}
        quickReplies={p.quickReplies}
        onCancelReply={() => setReplyTo(null)}
        onSendText={async (t) => {
          const r = replyTo;
          setReplyTo(null);
          stick.current = true;
          await p.onSendText(t, r);
        }}
        onSendFile={async (f, cap) => {
          const r = replyTo;
          setReplyTo(null);
          stick.current = true;
          await p.onSendFile(f, cap, r);
        }}
        onSendVoice={async (u, s) => {
          stick.current = true;
          await p.onSendVoice(u, s);
        }}
        onTyping={p.onTyping}
      />
    </section>
  );
}
