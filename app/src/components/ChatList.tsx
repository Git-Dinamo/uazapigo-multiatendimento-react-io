import { useEffect, useRef, useState } from 'react';
import type { Chat, ChatFilter, Label } from '../provider/types';
import { listStamp, formatPhone } from '../lib/format';
import { Avatar } from './Avatar';
import { Icon } from './Icon';
import { Menu, type MenuItem } from './Menu';

export const FILTERS: { id: ChatFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'unread', label: 'Não lidas' },
  { id: 'mine', label: 'Atribuídas à mim' },
  { id: 'open', label: 'Em aberto' },
  { id: 'groups', label: 'Grupos' },
  { id: 'archived', label: 'Arquivadas' },
  { id: 'blocked', label: 'Bloqueados' },
];

interface Props {
  chats: Chat[];
  labels: Label[];
  filter: ChatFilter;
  search: string;
  loading: boolean;
  hasMore: boolean;
  error: string;
  activeId: string;
  me: string;
  connected: boolean;
  onFilter: (f: ChatFilter) => void;
  onSearch: (q: string) => void;
  onRefresh: () => void;
  onMore: () => void;
  onOpen: (c: Chat) => void;
  onNew: () => void;
  menu: MenuItem[];
}

export function chatTitle(c: Chat) {
  return c.name || (c.phone ? formatPhone(c.phone) : '') || '(Sem nome)';
}

function preview(c: Chat) {
  if (c.presence === 'composing') return <span className="typing">Digitando...</span>;
  if (c.presence === 'recording') return <span className="typing">Gravando...</span>;
  const t = c.lastType.toLowerCase();
  let icon = '';
  let text = c.lastText;
  if (t.includes('image')) (icon = 'camera'), (text = text || 'Foto');
  else if (t.includes('video')) (icon = 'video'), (text = text || 'Vídeo');
  else if (t.includes('audio') || t.includes('ptt')) (icon = 'mic'), (text = text || 'Áudio');
  else if (t.includes('document')) (icon = 'doc'), (text = text || 'Documento');
  else if (t.includes('sticker')) text = text || 'Figurinha';
  else if (t.includes('location')) (icon = 'place'), (text = text || 'Localização');
  return (
    <>
      {icon && <Icon name={icon} size={16} className="pv-ico" />}
      {text}
    </>
  );
}

export function ChatList(p: Props) {
  const [searching, setSearching] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [q, setQ] = useState(p.search);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const labelById = new Map(p.labels.map((l) => [l.id, l]));

  useEffect(() => {
    if (searching) searchRef.current?.focus();
  }, [searching]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== p.search) p.onSearch(q);
    }, 400);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const title = FILTERS.find((f) => f.id === p.filter)?.label || 'Todos';

  return (
    <aside className="side">
      <div
        className="side-list"
        ref={listRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (p.hasMore && !p.loading && el.scrollTop + el.clientHeight > el.scrollHeight - 200) p.onMore();
        }}
      >
        <div className="side-spacer" style={{ height: searching ? 112 : 60 }} />
        {p.error && <div className="list-note err">{p.error}</div>}
        {!p.error && !p.loading && p.connected && p.chats.length === 0 && (
          <div className="list-note">{p.search ? 'Nenhuma conversa encontrada.' : 'Nenhuma conversa aqui.'}</div>
        )}
        {p.chats.map((c) => (
          <button
            key={c.id}
            className={'chat-item' + (c.id === p.activeId ? ' on' : '')}
            onClick={() => p.onOpen(c)}
          >
            <Avatar src={c.image} group={c.isGroup} />
            <span className="ci-main">
              <span className="ci-top">
                <span className="ci-name">{chatTitle(c)}</span>
                {c.labels.length > 0 && (
                  <span className="ci-labels">
                    {c.labels.slice(0, 4).map((id) => {
                      const l = labelById.get(id);
                      return l ? (
                        <span key={id} title={l.name} style={{ color: l.color }}>
                          <Icon name="label" size={16} />
                        </span>
                      ) : null;
                    })}
                  </span>
                )}
              </span>
              <span className="ci-last">{preview(c)}</span>
              {(c.lead.assignedTo || c.lead.ticketOpen) && (
                <span className="ci-tags">
                  {c.lead.ticketOpen && <span className="tag open">aberto</span>}
                  {c.lead.assignedTo && (
                    <span className={'tag who' + (c.lead.assignedTo === p.me ? ' me' : '')}>
                      {c.lead.assignedTo === p.me ? 'comigo' : c.lead.assignedTo}
                    </span>
                  )}
                </span>
              )}
            </span>
            <span className="ci-side">
              <span className={'ci-time' + (c.unread ? ' new' : '')}>{listStamp(c.lastAt)}</span>
              {c.unread > 0 && <span className="ci-badge">{c.unread > 99 ? '99+' : c.unread}</span>}
              <span className="ci-flags">
                {c.mutedUntil > Date.now() && <Icon name="mute" size={16} />}
                {c.pinned && <Icon name="pin" size={16} />}
              </span>
            </span>
          </button>
        ))}
        {p.loading && <div className="list-note">Carregando…</div>}
        <div style={{ height: 90 }} />
      </div>

      <header className="side-head blur">
        <div className="sh-row">
          <span className="sh-title">{title}</span>
          <div className="sh-icons">
            <button className="ib green" aria-label="Atualizar" title="Atualizar" onClick={p.onRefresh}>
              <Icon name="refresh" />
            </button>
            <div className="rel">
              <button
                className={'ib green' + (p.filter !== 'all' ? ' active' : '')}
                aria-label="Filtrar"
                title="Filtrar"
                onClick={() => setFilterOpen((v) => !v)}
              >
                <Icon name="filter" />
              </button>
              {filterOpen && (
                <Menu
                  onClose={() => setFilterOpen(false)}
                  items={FILTERS.map((f) => ({
                    label: f.label,
                    checked: f.id === p.filter,
                    onClick: () => p.onFilter(f.id),
                  }))}
                />
              )}
            </div>
            <button
              className="ib green"
              aria-label="Pesquisar"
              title="Pesquisar"
              onClick={() => {
                if (searching && q) {
                  setQ('');
                  p.onSearch('');
                }
                setSearching((v) => !v);
              }}
            >
              <Icon name={searching ? 'close' : 'search'} />
            </button>
            <div className="rel">
              <button className="ib grey" aria-label="Mais opções" title="Mais opções" onClick={() => setMoreOpen((v) => !v)}>
                <Icon name="more" />
              </button>
              {moreOpen && <Menu onClose={() => setMoreOpen(false)} items={p.menu} />}
            </div>
          </div>
        </div>
        {searching && (
          <div className="sh-search">
            <Icon name="search" size={18} />
            <input
              ref={searchRef}
              placeholder="Pesquisar telefone ou nome"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && p.onSearch(q)}
            />
          </div>
        )}
      </header>

      <button className="fab" aria-label="Nova conversa" title="Nova conversa" onClick={p.onNew}>
        <Icon name="newchat" size={30} />
      </button>
    </aside>
  );
}
