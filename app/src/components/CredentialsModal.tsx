import { useState } from 'react';
import type { Connection } from '../provider/types';
import { Uazapi, normalizeUrl } from '../provider/uazapi';
import { Icon } from './Icon';

interface Props {
  connections: Connection[];
  activeId: string;
  canClose: boolean;
  onClose: () => void;
  onSave: (c: Connection) => void;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

/** "Minhas credenciais": server URL + instance token, like the original popup. */
export function CredentialsModal({ connections, activeId, canClose, onClose, onSave, onSelect, onRemove }: Props) {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    setError('');
    const u = normalizeUrl(url);
    if (!u || !token.trim()) {
      setError('Preencha a URL do servidor e o token da instância.');
      return;
    }
    setBusy(true);
    try {
      const st = await new Uazapi({ url: u, token }).status();
      const id = `${u}|${token.trim()}`;
      onSave({
        id,
        provider: 'uazapi',
        name: st.name || st.instanceName || u.replace(/^https?:\/\//, ''),
        url: u,
        token: token.trim(),
      });
      setUrl('');
      setToken('');
    } catch (e) {
      setError((e as Error).message || 'Não foi possível conectar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="greyout" onClick={canClose ? onClose : undefined} />
      <div className="cred" role="dialog" aria-modal="true" aria-labelledby="cred-title">
        <div className="cred-head">
          <h4 id="cred-title">Minhas credenciais</h4>
          {canClose && (
            <button className="cred-x" onClick={onClose} aria-label="Fechar">
              <Icon name="close" size={20} />
            </button>
          )}
        </div>
        {connections.length > 0 && (
          <div className="cred-list">
            {connections.map((c) => (
              <div key={c.id} className={'cred-item' + (c.id === activeId ? ' on' : '')}>
                <button className="cred-pick" onClick={() => onSelect(c.id)}>
                  <strong>{c.name}</strong>
                  <span>{c.url.replace(/^https?:\/\//, '')}</span>
                </button>
                <button className="cred-del" onClick={() => onRemove(c.id)} aria-label={`Excluir credencial ${c.name}`}>
                  <Icon name="trash" size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
        <form
          className="cred-body"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <div className="cred-field">
            <label htmlFor="cred-url">
              <strong>URL do Servidor</strong>
            </label>
            <input
              id="cred-url"
              placeholder="URL"
              value={url}
              autoComplete="off"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="cred-field">
            <label htmlFor="cred-token">
              <strong>Instance token</strong>
            </label>
            <input
              id="cred-token"
              placeholder="INSTANCIA"
              value={token}
              autoComplete="off"
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          {error && <div className="cred-error">{error}</div>}
          <button type="submit" hidden />
        </form>
        <div className="cred-foot">
          <button className="cred-save" onClick={save} disabled={busy}>
            {busy ? 'Conectando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </>
  );
}
