import { useState } from 'react';
import type { Message } from '../provider/types';
import { duration, richText, timeOf } from '../lib/format';
import { Icon } from './Icon';

interface Props {
  m: Message;
  quoted?: Message;
  reactions: string[];
  showSender: boolean;
  contactName?: string;
  onReply: (m: Message) => void;
  onReact: (m: Message, emoji: string) => void;
  onDelete: (m: Message) => void;
  onDownload: (m: Message) => Promise<string>;
}

const QUICK = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

function Ticks({ m }: { m: Message }) {
  if (m.failed) return <span className="tick fail" title="Não enviada">!</span>;
  if (m.pending) return <Icon name="clock" size={14} className="tick" />;
  const s = m.status.toLowerCase();
  if (s.includes('read') || s.includes('play')) return <Icon name="checks" size={16} className="tick read" />;
  if (s.includes('deliver')) return <Icon name="checks" size={16} className="tick" />;
  return <Icon name="check" size={16} className="tick" />;
}

function quotedText(q?: Message) {
  if (!q) return 'Mensagem';
  if (q.text) return q.text;
  return { image: 'Foto', video: 'Vídeo', audio: 'Áudio', document: q.fileName || 'Documento', sticker: 'Figurinha' }[
    q.kind as string
  ] || 'Mensagem';
}

export function MessageBubble({ m, quoted, reactions, showSender, contactName, onReply, onReact, onDelete, onDownload }: Props) {
  const [url, setUrl] = useState(m.fileUrl);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [tools, setTools] = useState(false);

  async function fetchFile() {
    if (url || loading) return url;
    setLoading(true);
    setErr('');
    try {
      const u = await onDownload(m);
      setUrl(u);
      return u;
    } catch (e) {
      setErr('Não foi possível baixar.');
      return '';
    } finally {
      setLoading(false);
    }
  }

  const caption = m.kind === 'text' ? '' : m.text || m.caption;
  let body: JSX.Element | null = null;

  switch (m.kind) {
    case 'image':
    case 'sticker':
      body = url ? (
        <a href={url} target="_blank" rel="noreferrer">
          <img className={m.kind === 'sticker' ? 'sticker' : 'media-img'} src={url} alt={caption || 'Imagem'} />
        </a>
      ) : (
        <button className="media-load" onClick={fetchFile}>
          {m.thumb ? <img src={m.thumb} alt="" className="media-img blurred" /> : <span className="media-ph" />}
          <span className="media-btn">
            <Icon name="download" size={20} /> {loading ? 'Baixando…' : 'Ver imagem'}
          </span>
        </button>
      );
      break;
    case 'video':
      body = url ? (
        <video className="media-img" src={url} controls preload="metadata" />
      ) : (
        <button className="media-load" onClick={fetchFile}>
          {m.thumb ? <img src={m.thumb} alt="" className="media-img blurred" /> : <span className="media-ph" />}
          <span className="media-btn">
            <Icon name="play" size={20} /> {loading ? 'Baixando…' : 'Ver vídeo'}
          </span>
        </button>
      );
      break;
    case 'audio':
      body = url ? (
        <audio className="audio" src={url} controls preload="metadata" />
      ) : (
        <button className="audio-load" onClick={fetchFile}>
          <Icon name="play" size={22} />
          <span className="audio-bar" />
          <span className="audio-len">{loading ? '…' : duration(m.seconds) || 'Áudio'}</span>
        </button>
      );
      break;
    case 'document':
      body = (
        <button
          className="doc"
          onClick={async () => {
            const u = await fetchFile();
            if (u) window.open(u, '_blank', 'noopener');
          }}
        >
          <Icon name="doc" size={28} />
          <span className="doc-name">{m.fileName || 'Documento'}</span>
          <Icon name="download" size={20} />
        </button>
      );
      break;
    case 'location':
      body = (
        <a
          className="doc"
          target="_blank"
          rel="noreferrer"
          href={m.lat !== undefined ? `https://maps.google.com/?q=${m.lat},${m.lng}` : '#'}
        >
          <Icon name="place" size={28} />
          <span className="doc-name">Localização</span>
        </a>
      );
      break;
    case 'deleted':
      body = <em className="muted">Mensagem apagada</em>;
      break;
    case 'contact':
      body = (
        <div className="doc">
          <Icon name="person" size={28} />
          <span className="doc-name">{m.fileName || m.text || 'Contato'}</span>
        </div>
      );
      break;
    case 'poll':
      body = <div className="poll">📊 {m.text || 'Enquete'}</div>;
      break;
    default:
      body = null;
  }

  const text = m.kind === 'text' || m.kind === 'other' ? m.edited || m.text : caption;

  return (
    <div className={'msg-row ' + (m.fromMe ? 'out' : 'in')}>
      <div className={'bubble' + (m.kind === 'sticker' ? ' bare' : '')} onMouseLeave={() => setTools(false)}>
        {showSender && !m.fromMe && m.senderName && <div className="sender">{m.senderName}</div>}
        {m.quotedId && (
          <div className="quoted">
            <span>{quoted ? (quoted.fromMe ? 'Você' : quoted.senderName || contactName || 'Contato') : 'Resposta'}</span>
            <p>{quotedText(quoted)}</p>
          </div>
        )}
        {body}
        {err && <div className="muted small">{err}</div>}
        {text && <div className="text">{richText(text)}</div>}
        <div className="meta">
          {m.edited && <span>Editada</span>}
          <span>{timeOf(m.at)}</span>
          {m.fromMe && <Ticks m={m} />}
        </div>
        {reactions.length > 0 && <div className="reacts">{reactions.join('')}</div>}
        {!m.pending && m.kind !== 'deleted' && (
          <button className="msg-tools-btn" aria-label="Opções da mensagem" onClick={() => setTools((v) => !v)}>
            ▾
          </button>
        )}
        {tools && (
          <div className="msg-tools">
            <div className="emoji-row">
              {QUICK.map((e) => (
                <button key={e} onClick={() => (setTools(false), onReact(m, e))}>
                  {e}
                </button>
              ))}
            </div>
            <button onClick={() => (setTools(false), onReply(m))}>
              <Icon name="reply" size={18} /> Responder
            </button>
            {m.fromMe && (
              <button className="danger" onClick={() => (setTools(false), onDelete(m))}>
                <Icon name="trash" size={18} /> Apagar mensagem
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
