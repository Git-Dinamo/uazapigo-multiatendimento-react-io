// Shapes the screens work with. Every provider (UAZAPI today, others later)
// turns its own data into these, so the screens never depend on one provider.

export interface Connection {
  id: string;
  provider: 'uazapi';
  name: string;
  url: string; // server base URL, no trailing slash
  token: string; // instance token
}

export interface Chat {
  id: string; // stable key (wa_fastid / owner:number)
  rowId: string; // provider row id used by editLead
  chatId: string; // full chat id, e.g. 5511...@s.whatsapp.net
  number: string; // what /send/* expects
  name: string;
  phone: string;
  image: string;
  isGroup: boolean;
  unread: number;
  lastAt: number; // ms
  lastText: string;
  lastType: string;
  lastFromMe: boolean;
  archived: boolean;
  pinned: boolean;
  blocked: boolean;
  mutedUntil: number;
  labels: string[];
  lead: Lead;
  presence?: string;
  raw: Record<string, unknown>;
}

export interface Lead {
  name: string;
  fullName: string;
  email: string;
  personalId: string;
  status: string;
  notes: string;
  tags: string[];
  ticketOpen: boolean;
  assignedTo: string;
  botPausedUntil: number; // ms; 0 = robot free to answer
}

export type MessageKind =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'sticker'
  | 'location'
  | 'contact'
  | 'reaction'
  | 'poll'
  | 'deleted'
  | 'other';

export interface Message {
  id: string;
  chatId: string;
  fromMe: boolean;
  at: number;
  kind: MessageKind;
  type: string;
  text: string;
  caption: string;
  senderName: string;
  status: string;
  quotedId: string;
  reaction: string;
  edited: string;
  fileUrl: string;
  thumb: string; // data: url
  fileName: string;
  mime: string;
  seconds: number;
  lat?: number;
  lng?: number;
  pending?: boolean;
  failed?: boolean;
  raw: Record<string, unknown>;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface QuickReply {
  id: string;
  shortCut: string;
  text: string;
}

export type ChatFilter =
  | 'all'
  | 'unread'
  | 'groups'
  | 'mine'
  | 'open'
  | 'archived'
  | 'blocked';

export type LiveEvent =
  | { kind: 'chat'; chat: Chat }
  | { kind: 'message'; message: Message }
  | { kind: 'status'; ids: string[]; status: string }
  | { kind: 'presence'; chatKey: string; number: string; state: string }
  | { kind: 'connection'; state: 'connecting' | 'live' | 'down' };
