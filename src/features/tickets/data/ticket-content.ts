import type {
  PaymentMethod,
  TicketEvent,
  TicketZone,
  ZoneId,
} from '../types/ticket.types';

/**
 * Static content for the v4 prototype (Phase 1). Replaced by feature hooks and
 * services when the ticketing API is available.
 */

export const TICKET_EVENT: TicketEvent = {
  name: 'Giải vô địch Jujitsu Quốc gia 2026',
  venue: 'Cung thể thao Tiên Sơn · Đà Nẵng',
  venueShort: 'TIÊN SƠN · ĐÀ NẴNG',
  gate: 'Cổng 3',
  code: 'NAT',
  sessions: [
    {
      date: '28/09',
      label: 'TỐI NAY',
      kind: 'Chung kết Newaza NoGi',
      kindShort: 'Chung kết NoGi',
      startTime: '19:30',
      openTime: '18:45',
      remaining: [3, 14, 0, 46],
    },
    {
      date: '29/09',
      label: 'THỨ BA',
      kind: 'Contact · vòng loại đến chung kết',
      kindShort: 'Contact',
      startTime: '08:00',
      openTime: '07:30',
      remaining: [11, 26, 120, 138],
    },
    {
      date: '30/09',
      label: 'THỨ TƯ',
      kind: 'Duo Classic · Lễ bế mạc',
      kindShort: 'Duo · Bế mạc',
      startTime: '18:30',
      openTime: '17:45',
      remaining: [6, 19, 64, 0],
    },
  ],
};

/** Order matches `TicketSession.remaining`. */
export const ZONES: readonly TicketZone[] = [
  {
    id: 'vip',
    name: 'VIP sát thảm',
    price: 450_000,
    rows: ['A', 'B'],
    generalAdmission: false,
    note: 'Hai hàng ghế sát khu thi đấu · kèm rashguard giải',
  },
  {
    id: 'a',
    name: 'Khán đài A',
    price: 250_000,
    rows: ['A', 'B', 'C', 'D'],
    generalAdmission: false,
    note: 'Chính diện thảm 1, cùng hướng camera phát sóng',
  },
  {
    id: 'b',
    name: 'Khán đài B',
    price: 150_000,
    generalAdmission: true,
    note: 'Ghế tự do · vào cửa theo thứ tự',
  },
  {
    id: 'c',
    name: 'Khán đài C',
    price: 150_000,
    generalAdmission: true,
    note: 'Ghế tự do · vào cửa theo thứ tự',
  },
];

export const ZONE_IDS: readonly ZoneId[] = ZONES.map(zone => zone.id);

export const SEATS_PER_SIDE = 4;
export const SERVICE_FEE = 5000;
export const MAX_SEATED_TICKETS = 4;
export const MAX_GENERAL_TICKETS = 6;

/** A general-admission zone with more than this left shows `TỰ DO`. */
export const GENERAL_ADMISSION_URGENT_BELOW = 4;

export const PAYMENT_METHODS: readonly PaymentMethod[] = [
  'Ví MoMo',
  'VNPay QR',
  'Thẻ ATM',
];

export const MOCK_PAYMENT_MS = 1300;
export const MOCK_CONTACT_EMAIL = 'minh.nguyen@gmail.com';
