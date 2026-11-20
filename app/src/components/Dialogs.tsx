import { useState, type ReactNode } from 'react';
import type { Label } from '../provider/types';
import type { Settings } from '../lib/storage';
import { Icon } from './Icon';

function Dialog({ title, onClose, children, foot }: { title: string; onClose: () => void; children: ReactNode; foot?: ReactNode }) {
  return (
    <>
      <div className="greyout light" onClick={onClose} />
      <div className="dialog" role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <h4>{title}</h4>
          <button className="ib grey" aria-label="Fechar" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>
        <div className="dialog-body">{children}</div>
        {foot && <footer>{foot}</footer>}
      </div>
    </>
  );
}

export function LabelsDialog({
  labels,
  selected,
  onClose,
  onSave,
}: {
  labels: Label[];
  selected: string[];
  onClose: () => void;
  onSave: (ids: string[]) => Promise<void>;
}) {
  const [sel, setSel] = useState<string[]>(selected);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  return (
    <Dialog
      title="Etiquetas"
      onClose={onClose}
      foot={
        <button
          className="btn-primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setErr('');
            try {
              await onSave(sel);
              onClose();
            } catch (e) {
              setErr((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? 'Salvando…' : 'Salvar'}
        </button>
      }
    >
      {labels.length === 0 && (
        <p className="muted">Nenhuma etiqueta neste número. Etiquetas são do WhatsApp Business: crie-as no celular.</p>
      )}
      {labels.map((l) => (
        <label key={l.id} className="check-row">
          <input
            type="checkbox"
            checked={sel.includes(l.id)}
            onChange={(e) => setSel((s) => (e.target.checked ? [...s, l.id] : s.filter((x) => x !== l.id)))}
          />
          <span className="label-ico" style={{ color: l.color }}>
            <Icon name="label" size={20} />
          </span>
          {l.name}
        </label>
      ))}
      {err && <p className="err-text">{err}</p>}
    </Dialog>
  );
}

export function NewChatDialog({ onClose, onStart }: { onClose: () => void; onStart: (number: string) => Promise<void> }) {
  const [num, setNum] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const go = async () => {
    const n = num.replace(/\D/g, '');
    if (n.length < 10) {
      setErr('Digite o número com DDI e DDD, ex.: 5511999999999');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      await onStart(n);
      onClose();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      title="Nova conversa"
      onClose={onClose}
      foot={
        <button className="btn-primary" onClick={go} disabled={busy}>
          {busy ? 'Verificando…' : 'Iniciar conversa'}
        </button>
      }
    >
      <label className="field">
        Telefone
        <input
          autoFocus
          inputMode="tel"
          placeholder="5511999999999"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
        />
      </label>
      {err && <p className="err-text">{err}</p>}
    </Dialog>
  );
}

export function SettingsDialog({
  settings,
  onClose,
  onSave,
}: {
  settings: Settings;
  onClose: () => void;
  onSave: (s: Settings) => void;
}) {
  const [s, setS] = useState(settings);
  return (
    <Dialog
      title="Configurações"
      onClose={onClose}
      foot={
        <button
          className="btn-primary"
          onClick={() => {
            const name = s.attendantName.trim();
            onSave({ ...s, attendantName: name, attendantId: s.attendantId.trim() || name });
            onClose();
          }}
        >
          Salvar
        </button>
      }
    >
      <label className="field">
        Seu nome de atendente
        <input
          placeholder="Ex.: Ana"
          value={s.attendantName}
          onChange={(e) => setS({ ...s, attendantName: e.target.value })}
        />
      </label>
      <label className="field">
        Identificador do atendente (opcional)
        <input
          placeholder="Igual ao nome se ficar vazio"
          value={s.attendantId}
          onChange={(e) => setS({ ...s, attendantId: e.target.value })}
        />
        <small className="muted">É o que fica gravado na conversa ao clicar em “Atribuir à mim”.</small>
      </label>
      <label className="check-row">
        <input type="checkbox" checked={s.signMessages} onChange={(e) => setS({ ...s, signMessages: e.target.checked })} />
        Assinar mensagens com meu nome
      </label>
      <label className="check-row">
        <input type="checkbox" checked={s.sound} onChange={(e) => setS({ ...s, sound: e.target.checked })} />
        Som ao chegar mensagem nova
      </label>
      <label className="field">
        Ao pausar o robô, pausar por (horas)
        <input
          type="number"
          min={1}
          max={720}
          value={s.botPauseHours}
          onChange={(e) => setS({ ...s, botPauseHours: Math.max(1, Number(e.target.value) || 24) })}
        />
      </label>
    </Dialog>
  );
}

export function ConfirmDialog({
  title,
  text,
  action,
  onClose,
  onConfirm,
}: {
  title: string;
  text: string;
  action: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      title={title}
      onClose={onClose}
      foot={
        <>
          <button className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {action}
          </button>
        </>
      }
    >
      <p>{text}</p>
    </Dialog>
  );
}
