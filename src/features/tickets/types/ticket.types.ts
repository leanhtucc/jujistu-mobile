export type ZoneId = 'vip' | 'a' | 'b' | 'c';

export interface TicketZone {
  readonly id: ZoneId;
  readonly name: string;
  readonly price: number;
  /** Row letters of a numbered stand; absent for general admission. */
  readonly rows?: readonly string[];
  readonly generalAdmission: boolean;
  readonly note: string;
}

export interface TicketSession {
  /** `dd/MM` */
  readonly date: string;
  readonly label: string;
  readonly kind: string;
  readonly kindShort: string;
  readonly startTime: string;
  readonly openTime: string;
  /** Tickets left per zone, in the order `vip`, `a`, `b`, `c`. */
  readonly remaining: readonly [number, number, number, number];
}

export interface TicketEvent {
  readonly name: string;
  readonly venue: string;
  readonly venueShort: string;
  readonly gate: string;
  readonly code: string;
  readonly sessions: readonly TicketSession[];
}

export type PaymentMethod = 'Ví MoMo' | 'VNPay QR' | 'Thẻ ATM';

export interface PurchasedTicket {
  readonly date: string;
  readonly kind: string;
  readonly startTime: string;
  readonly openTime: string;
  readonly zoneName: string;
  /** Seat ids such as `A3`, or `Vé 1` for general admission. */
  readonly seats: readonly string[];
  readonly count: number;
  readonly seed: number;
  readonly code: string;
}

export type SeatState = 'free' | 'sold' | 'selected';

export interface Seat {
  readonly id: string;
  readonly number: number;
  readonly state: SeatState;
}

export interface SeatRow {
  readonly label: string;
  readonly left: readonly Seat[];
  readonly right: readonly Seat[];
}

export interface ZoneAvailability {
  readonly zone: TicketZone;
  readonly remaining: number;
  readonly soldOut: boolean;
  readonly selected: boolean;
  /** `CÒN 3`, `TỰ DO` or `HẾT VÉ`. */
  readonly stateLabel: string;
  readonly urgent: boolean;
}
