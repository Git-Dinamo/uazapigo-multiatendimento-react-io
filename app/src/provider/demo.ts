// Demo server: answers the same calls UAZAPI does, from memory, so the screens
// can be tried without a real instance. Only used when the address has ?demo.
import type { LiveEvent } from './types';
import { Uazapi } from './uazapi';

type Raw = Record<string, any>;
const OWNER = '5511900000000';
const now = Date.now();
const min = 60_000;

const chats: Raw[] = [
  {
    id: 'r1', wa_fastid: `${OWNER}:5511911111111`, wa_chatid: '5511911111111@s.whatsapp.net', owner: OWNER,
    wa_contactName: 'Ana Souza', wa_unreadCount: 2, wa_lastMsgTimestamp: now - 3 * min,
    wa_lastMessageTextVote: 'Consegue me mandar o orçamento hoje?', wa_lastMessageType: 'Conversation',
    wa_label: ['1'], lead_isTicketOpen: true, lead_name: 'Ana', lead_tags: ['quente'],
  },
  {
    id: 'r2', wa_fastid: `${OWNER}:5521922222222`, wa_chatid: '5521922222222@s.whatsapp.net', owner: OWNER,
    wa_name: 'Bruno Lima', wa_unreadCount: 0, wa_lastMsgTimestamp: now - 50 * min,
    wa_lastMessageTextVote: '', wa_lastMessageType: 'AudioMessage', wa_isPinned: true,
    lead_assignedAttendant_id: 'Marina', lead_disableChatBotUntil: Math.floor((now + 5 * 3600_000) / 1000),
  },
  {
    id: 'r3', wa_fastid: `${OWNER}:120363000000000000`, wa_chatid: '120363000000000000@g.us', owner: OWNER,
    wa_name: 'Equipe Comercial', wa_isGroup: true, wa_unreadCount: 5, wa_lastMsgTimestamp: now - 26 * 3600_000,
    wa_lastMessageTextVote: 'Reunião às 15h', wa_lastMessageType: 'ExtendedTextMessage', wa_label: ['2'],
  },
  {
    id: 'r4', wa_fastid: `${OWNER}:5531933333333`, wa_chatid: '5531933333333@s.whatsapp.net', owner: OWNER,
    wa_contactName: '', wa_name: '', wa_unreadCount: 0, wa_lastMsgTimestamp: now - 4 * 86400_000,
    wa_lastMessageTextVote: 'nota-fiscal.pdf', wa_lastMessageType: 'DocumentMessage',
  },
];

const messages: Raw[] = [
  { messageid: 'm1', chatid: chats[0].wa_chatid, fromMe: false, messageTimestamp: now - 30 * min, messageType: 'Conversation', text: 'Oi! Vi o anúncio de vocês 😊', senderName: 'Ana Souza' },
  { messageid: 'm2', chatid: chats[0].wa_chatid, fromMe: true, messageTimestamp: now - 28 * min, messageType: 'ExtendedTextMessage', text: 'Olá, Ana! Tudo bem? Em que posso ajudar?', status: 'Read' },
  { messageid: 'm3', chatid: chats[0].wa_chatid, fromMe: false, messageTimestamp: now - 25 * min, messageType: 'ImageMessage', text: 'Esse modelo aqui', content: {} },
  { messageid: 'm4', chatid: chats[0].wa_chatid, fromMe: true, messageTimestamp: now - 20 * min, messageType: 'Conversation', text: '*Temos sim!* Vou separar as opções.', status: 'Delivered', quoted: 'm3' },
  { messageid: 'm5', chatid: chats[0].wa_chatid, fromMe: false, messageTimestamp: now - 3 * min, messageType: 'Conversation', text: 'Consegue me mandar o orçamento hoje?' },
  { messageid: 'm6', chatid: chats[0].wa_chatid, fromMe: true, messageTimestamp: now - 2 * min, messageType: 'ReactionMessage', text: '👍', reaction: 'm5' },
  { messageid: 'b1', chatid: chats[1].wa_chatid, fromMe: false, messageTimestamp: now - 50 * min, messageType: 'AudioMessage', content: { seconds: 14 } },
  { messageid: 'd1', chatid: chats[3].wa_chatid, fromMe: true, messageTimestamp: now - 4 * 86400_000, messageType: 'DocumentMessage', content: { fileName: 'nota-fiscal.pdf' }, status: 'Read' },
];

const labels = [
  { labelid: '1', name: 'Novo cliente', colorHex: '#64c4ff' },
  { labelid: '2', name: 'Pedido', colorHex: '#ffd429' },
  { labelid: '3', name: 'Pago', colorHex: '#55ccb3' },
];

const quick = [
  { id: 'q1', shortCut: 'ola', text: 'Olá! Obrigado pelo contato. Como posso ajudar?' },
  { id: 'q2', shortCut: 'pix', text: 'Nossa chave PIX é o CNPJ da empresa.' },
];

let seq = 100;

export class DemoUazapi extends Uazapi {
  constructor() {
    super({ url: 'https://demo.local', token: 'demo' });
  }

  async call<T = any>(path: string, _method: string = 'POST', body?: any): Promise<T> {
    await new Promise((r) => setTimeout(r, 120));
    const b = body || {};
    const chatOf = (n: string) => chats.find((c) => c.wa_chatid === n || c.wa_chatid.startsWith(n));
    switch (path) {
      case '/instance/status':
        return { instance: { name: 'demo', profileName: 'Loja Demo', status: 'connected', owner: OWNER }, status: { connected: true } } as T;
      case '/labels':
        return labels as T;
      case '/quickreply/showall':
        return quick as T;
      case '/chat/find': {
        let list = [...chats];
        if (b.wa_chatid && !String(b.wa_chatid).startsWith('~')) list = list.filter((c) => c.wa_chatid === b.wa_chatid);
        if (b.wa_unreadCount) list = list.filter((c) => c.wa_unreadCount > 0);
        if (b.wa_isGroup) list = list.filter((c) => c.wa_isGroup);
        if (b.lead_isTicketOpen) list = list.filter((c) => c.lead_isTicketOpen);
        if (b.lead_assignedAttendant_id) list = list.filter((c) => c.lead_assignedAttendant_id === b.lead_assignedAttendant_id);
        if (b.wa_archived) list = list.filter((c) => c.wa_archived);
        if (b.wa_isBlocked) list = list.filter((c) => c.wa_isBlocked);
        if (b.operator === 'OR' && b.wa_name) {
          const q = String(b.wa_name).slice(1).toLowerCase();
          list = list.filter((c) => `${c.wa_name} ${c.wa_contactName} ${c.wa_chatid}`.toLowerCase().includes(q));
        }
        return { chats: list.slice(b.offset || 0, (b.offset || 0) + (b.limit || 50)), pagination: { hasNextPage: false } } as T;
      }
      case '/message/find': {
        const list = messages.filter((m) => m.chatid === b.chatid).sort((a, c) => c.messageTimestamp - a.messageTimestamp);
        return { messages: list.slice(b.offset || 0, (b.offset || 0) + (b.limit || 60)), hasMore: false } as T;
      }
      case '/send/text':
      case '/send/media': {
        const m = {
          messageid: 'n' + seq++,
          chatid: chatOf(b.number)?.wa_chatid || b.number,
          fromMe: true,
          messageTimestamp: Date.now(),
          messageType: path === '/send/text' ? 'Conversation' : b.type === 'ptt' ? 'AudioMessage' : `${b.type}Message`,
          text: b.text || '',
          status: 'Sent',
          quoted: b.replyid || '',
          fileURL: path === '/send/media' ? b.file : '',
          content: { fileName: b.docName || '' },
        };
        messages.push(m);
        const c = chatOf(b.number);
        if (c) Object.assign(c, { wa_lastMsgTimestamp: m.messageTimestamp, wa_lastMessageTextVote: m.text });
        return m as T;
      }
      case '/chat/editLead': {
        const c = chats.find((x) => x.id === b.id || x.wa_chatid === b.id);
        if (c) Object.assign(c, b, { id: c.id });
        return { ok: true } as T;
      }
      case '/chat/read': {
        const c = chatOf(b.number);
        if (c) c.wa_unreadCount = 0;
        return { ok: true } as T;
      }
      case '/chat/labels': {
        const c = chatOf(b.number);
        if (c) c.wa_label = b.labelids;
        return { ok: true } as T;
      }
      case '/chat/check':
        return [{ query: b.numbers?.[0], isInWhatsapp: true, jid: `${b.numbers?.[0]}@s.whatsapp.net` }] as T;
      case '/message/download':
        throw new Error('Arquivo de demonstração indisponível');
      default:
        return { ok: true } as T;
    }
  }

  live(onEvent: (e: LiveEvent) => void): () => void {
    onEvent({ kind: 'connection', state: 'live' });
    return () => {};
  }
}
