import { useEffect, useState } from 'react';
import type { Chat, Label } from '../provider/types';
import { formatPhone } from '../lib/format';
import { Avatar } from './Avatar';
import { chatTitle } from './ChatList';
import { Icon } from './Icon';

interface Props {
  chat: Chat;
  labels: Label[];
  me: string;
  onClose: () => void;
  onSave: (fields: Record<string, unknown>) => Promise<void>;
  onLabels: () => void;
}

/** Contact / lead details saved on the chat itself in UAZAPI (lead_* fields). */
export function LeadPanel({ chat, labels, me, onClose, onSave, onLabels }: Props) {
  const l = chat.lead;
  const [form, setForm] = useState({
    lead_name: l.name,
    lead_fullName: l.fullName,
    lead_email: l.email,
    lead_personalid: l.personalId,
    lead_status: l.status,
    lead_notes: l.notes,
    lead_tags: l.tags.join(', '),
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setForm({
      lead_name: l.name,
      lead_fullName: l.fullName,
      lead_email: l.email,
      lead_personalid: l.personalId,
      lead_status: l.status,
      lead_notes: l.notes,
      lead_tags: l.tags.join(', '),
    });
    setMsg('');
  }, [chat.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save() {
    setBusy(true);
    setMsg('');
    try {
      await onSave({
        ...form,
        lead_tags: form.lead_tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setMsg('Atualizado');
    } catch (e) {
      setMsg((e as Error).message || 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  const chatLabels = labels.filter((x) => chat.labels.includes(x.id));

  return (
    <aside className="lead">
      <header className="lead-head blur">
        <button className="ib grey" aria-label="Fechar" onClick={onClose}>
          <Icon name="close" />
        </button>
        <span>Dados do contato</span>
      </header>
      <div className="lead-body">
        <div className="lead-id">
          <Avatar src={chat.image} group={chat.isGroup} size={120} />
          <strong>{chatTitle(chat)}</strong>
          {!chat.isGroup && <span>{formatPhone(chat.phone)}</span>}
        </div>

        <div className="lead-card">
          <div className="lead-row">
            <span>Atendimento está </span>
            <b className={l.ticketOpen ? 'red' : 'blue'}>{l.ticketOpen ? 'aberto' : 'fechado'}</b>
          </div>
          <div className="lead-row">
            <span>Contato atribuído à</span>
            <b>{l.assignedTo ? (l.assignedTo === me ? 'mim' : l.assignedTo) : 'Ninguém'}</b>
          </div>
          {l.botPausedUntil > Date.now() && (
            <div className="lead-row">
              <span>Robô pausado até</span>
              <b>{new Date(l.botPausedUntil).toLocaleString('pt-BR')}</b>
            </div>
          )}
        </div>

        <div className="lead-card">
          <div className="lead-label-head">
            <span>Etiquetas</span>
            <button className="link" onClick={onLabels}>
              <Icon name="label" size={16} /> Etiquetar
            </button>
          </div>
          <div className="chips">
            {chatLabels.length === 0 && <span className="muted small">Sem etiquetas</span>}
            {chatLabels.map((x) => (
              <span key={x.id} className="chip" style={{ background: x.color + '33', color: '#111b21' }}>
                <i style={{ background: x.color }} />
                {x.name}
              </span>
            ))}
          </div>
        </div>

        <div className="lead-card form">
          <label>
            Nome
            <input value={form.lead_name} onChange={set('lead_name')} />
          </label>
          <label>
            Nome completo
            <input value={form.lead_fullName} onChange={set('lead_fullName')} />
          </label>
          <label>
            E-mail
            <input type="email" value={form.lead_email} onChange={set('lead_email')} />
          </label>
          <label>
            CPF
            <input value={form.lead_personalid} onChange={set('lead_personalid')} />
          </label>
          <label>
            Status
            <input value={form.lead_status} onChange={set('lead_status')} />
          </label>
          <label>
            Tags
            <input
              placeholder="assinante, testando, quente, frio, como preferir"
              value={form.lead_tags}
              onChange={set('lead_tags')}
            />
          </label>
          <label>
            Notas
            <textarea rows={4} value={form.lead_notes} onChange={set('lead_notes')} />
          </label>
          <div className="lead-save">
            {msg && <span className="muted small">{msg}</span>}
            <button className="btn-primary" onClick={save} disabled={busy}>
              {busy ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
