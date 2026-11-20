import { useEffect, useRef, useState } from 'react';
import type { Message, QuickReply } from '../provider/types';
import { VoiceRecorder } from '../lib/audio';
import { duration } from '../lib/format';
import { Icon } from './Icon';

interface Props {
  disabled?: string;
  replyTo: Message | null;
  quickReplies: QuickReply[];
  onCancelReply: () => void;
  onSendText: (text: string) => Promise<void>;
  onSendFile: (file: File, caption: string) => Promise<void>;
  onSendVoice: (dataUrl: string, seconds: number) => Promise<void>;
  onTyping: (state: 'composing' | 'recording') => void;
}

const MAX_BYTES = 16 * 1024 * 1024;

export function Composer(p: Props) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const [qrIndex, setQrIndex] = useState(0);
  const rec = useRef<VoiceRecorder | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const lastTyping = useRef(0);

  const qrQuery = text.startsWith('/') && !text.includes('\n') ? text.slice(1).toLowerCase() : null;
  const qrMatches =
    qrQuery === null
      ? []
      : p.quickReplies.filter(
          (q) => q.shortCut.toLowerCase().includes(qrQuery) || q.text.toLowerCase().includes(qrQuery),
        ).slice(0, 8);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setElapsed(Math.round((Date.now() - (rec.current?.startedAt || Date.now())) / 1000)), 500);
    return () => clearInterval(t);
  }, [recording]);

  useEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, [text]);

  useEffect(() => {
    if (p.replyTo) area.current?.focus();
  }, [p.replyTo]);

  async function send() {
    setError('');
    try {
      if (file) {
        const f = file;
        const cap = text.trim();
        setFile(null);
        setText('');
        await p.onSendFile(f, cap);
        return;
      }
      const t = text.trim();
      if (!t) return;
      setText('');
      await p.onSendText(t);
    } catch (e) {
      setError((e as Error).message || 'Não foi possível enviar.');
    }
  }

  async function toggleRecord() {
    setError('');
    if (!recording) {
      try {
        rec.current = new VoiceRecorder();
        await rec.current.start();
        setElapsed(0);
        setRecording(true);
        p.onTyping('recording');
      } catch {
        setError('Permita o uso do microfone para gravar áudio.');
      }
      return;
    }
    setRecording(false);
    try {
      const { dataUrl, seconds } = await rec.current!.stop();
      await p.onSendVoice(dataUrl, seconds);
    } catch (e) {
      setError((e as Error).message || 'Não foi possível enviar o áudio.');
    }
  }

  if (p.disabled) return <div className="composer-off">{p.disabled}</div>;

  return (
    <div className="composer-wrap">
      {qrMatches.length > 0 && (
        <div className="qr-pop" role="listbox" aria-label="Respostas Rápidas">
          {qrMatches.map((q, i) => (
            <button
              key={q.id || i}
              className={i === qrIndex ? 'on' : ''}
              onMouseEnter={() => setQrIndex(i)}
              onClick={() => {
                setText(q.text);
                area.current?.focus();
              }}
            >
              <strong>/{q.shortCut}</strong>
              <span>{q.text}</span>
            </button>
          ))}
        </div>
      )}
      {p.replyTo && (
        <div className="reply-bar">
          <div>
            <span>Respondendo {p.replyTo.fromMe ? 'você' : p.replyTo.senderName || 'contato'}</span>
            <p>{p.replyTo.text || p.replyTo.fileName || 'Mídia'}</p>
          </div>
          <button className="ib grey" aria-label="Cancelar resposta" onClick={p.onCancelReply}>
            <Icon name="close" size={20} />
          </button>
        </div>
      )}
      {file && (
        <div className="file-bar">
          <Icon name={file.type.startsWith('image/') ? 'camera' : file.type.startsWith('video/') ? 'video' : 'doc'} size={22} />
          <span>{file.name}</span>
          <button className="ib grey" aria-label="Remover arquivo" onClick={() => setFile(null)}>
            <Icon name="close" size={20} />
          </button>
        </div>
      )}
      {error && <div className="composer-err">{error}</div>}
      <div className="composer">
        {recording ? (
          <>
            <button
              className="ib grey"
              aria-label="Cancelar gravação"
              onClick={() => {
                rec.current?.cancel();
                setRecording(false);
              }}
            >
              <Icon name="trash" />
            </button>
            <div className="rec-live">
              <span className="rec-dot" /> Gravando... {duration(elapsed) || '0:00'}
            </div>
          </>
        ) : (
          <>
            <button className="ib grey" aria-label="Anexar arquivo" title="Documento ou Mídia" onClick={() => fileInput.current?.click()}>
              <Icon name="attach" />
            </button>
            <input
              ref={fileInput}
              type="file"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (!f) return;
                if (f.size > MAX_BYTES) {
                  setError('Arquivo maior que 16 MB.');
                  return;
                }
                setFile(f);
              }}
            />
            <textarea
              ref={area}
              rows={1}
              placeholder={file ? 'Legenda (opcional)' : 'Mensagem'}
              title="Digite / para usar uma resposta rápida"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setQrIndex(0);
                if (Date.now() - lastTyping.current > 4000) {
                  lastTyping.current = Date.now();
                  p.onTyping('composing');
                }
              }}
              onKeyDown={(e) => {
                if (qrMatches.length) {
                  if (e.key === 'ArrowDown') return e.preventDefault(), setQrIndex((i) => (i + 1) % qrMatches.length);
                  if (e.key === 'ArrowUp')
                    return e.preventDefault(), setQrIndex((i) => (i - 1 + qrMatches.length) % qrMatches.length);
                  if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    setText(qrMatches[qrIndex]?.text || text);
                    return;
                  }
                }
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
          </>
        )}
        {text.trim() || file ? (
          <button className="ib send" aria-label="Enviar" onClick={send}>
            <Icon name="send" />
          </button>
        ) : (
          <button className={'ib ' + (recording ? 'send' : 'grey')} aria-label={recording ? 'Enviar áudio' : 'Gravar áudio'} onClick={toggleRecord}>
            <Icon name={recording ? 'send' : 'mic'} />
          </button>
        )}
      </div>
    </div>
  );
}
