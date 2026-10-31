import {
  GENERAL_ADMISSION_URGENT_BELOW,
  SEATS_PER_SIDE,
  SERVICE_FEE,
  TICKET_EVENT,
  ZONES,
} from './ticket-content';
import type {
  PurchasedTicket,
  Seat,
  SeatRow,
  TicketSession,
  TicketZone,
  ZoneAvailability,
  ZoneId,
} from '../types/ticket.types';

/** `450.000₫` */
export function formatVnd(value: number): string {
  return `${Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}₫`;
}

/** Small deterministic generator so the mock seat map is stable per input. */
function createRng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

/** Indexes of sold seats among `total`, leaving `left` seats free. */
export function soldIndexes(
  seed: number,
  left: number,
  total: number,
): ReadonlySet<number> {
  const random = createRng(seed);
  const order = Array.from({ length: total }, (_, index) => index);

  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [order[index], order[swap]] = [order[swap], order[index]];
  }

  return new Set(order.slice(0, Math.max(0, total - left)));
}

export function zoneIndex(zoneId: ZoneId): number {
  return ZONES.findIndex(zone => zone.id === zoneId);
}

export function findZone(zoneId: ZoneId): TicketZone {
  return ZONES[Math.max(0, zoneIndex(zoneId))];
}

export function zoneRemaining(session: TicketSession, zoneId: ZoneId): number {
  return session.remaining[Math.max(0, zoneIndex(zoneId))];
}

/** Lowest price among the zones that still have tickets. */
export function priceFrom(session: TicketSession): number {
  const open = ZONES.filter((_, index) => session.remaining[index] > 0);
  return Math.min(...open.map(zone => zone.price));
}

export function buildZoneAvailability(
  session: TicketSession,
  selectedZone: ZoneId,
): readonly ZoneAvailability[] {
  return ZONES.map((zone, index) => {
    const remaining = session.remaining[index];
    const soldOut = remaining === 0;
    const urgent = !soldOut && remaining <= GENERAL_ADMISSION_URGENT_BELOW;

    return {
      zone,
      remaining,
      soldOut,
      selected: zone.id === selectedZone,
      urgent,
      stateLabel: soldOut
        ? 'HẾT VÉ'
        : zone.generalAdmission && !urgent
        ? 'TỰ DO'
        : `CÒN ${remaining}`,
    };
  });
}

export function buildSeatRows(
  sessionIndex: number,
  session: TicketSession,
  zone: TicketZone,
  selectedSeats: readonly string[],
): readonly SeatRow[] {
  if (!zone.rows) {
    return [];
  }

  const perRow = SEATS_PER_SIDE * 2;
  const sold = soldIndexes(
    zoneIndex(zone.id) * 31 + sessionIndex * 7 + 3,
    zoneRemaining(session, zone.id),
    zone.rows.length * perRow,
  );

  return zone.rows.map((label, rowIndex) => {
    const seat = (offset: number): Seat => {
      const id = `${label}${offset + 1}`;
      return {
        id,
        number: offset + 1,
        state: selectedSeats.includes(id)
          ? 'selected'
          : sold.has(rowIndex * perRow + offset)
          ? 'sold'
          : 'free',
      };
    };

    return {
      label,
      left: Array.from({ length: SEATS_PER_SIDE }, (_, k) => seat(k)),
      right: Array.from({ length: SEATS_PER_SIDE }, (_, k) =>
        seat(k + SEATS_PER_SIDE),
      ),
    };
  });
}

/** Seat ids ordered by row letter, then number. */
export function sortSeats(seats: readonly string[]): readonly string[] {
  return [...seats].sort((a, b) =>
    a[0] === b[0] ? Number(a.slice(1)) - Number(b.slice(1)) : a < b ? -1 : 1,
  );
}

export function computePricing(zone: TicketZone, quantity: number) {
  const subtotal = zone.price * quantity;
  const fee = SERVICE_FEE * quantity;
  return { subtotal, fee, total: subtotal + fee };
}

export function buildTicketCode(session: TicketSession, seed: number): string {
  return `${TICKET_EVENT.code}-${session.date.replace('/', '')}-${String(
    seed,
  ).padStart(4, '0')}`;
}

export function buildPurchasedTicket(
  session: TicketSession,
  zone: TicketZone,
  seats: readonly string[],
  quantity: number,
  seed: number,
): PurchasedTicket {
  return {
    date: session.date,
    kind: session.kind,
    startTime: session.startTime,
    openTime: session.openTime,
    zoneName: zone.name,
    seats: zone.generalAdmission
      ? Array.from({ length: quantity }, (_, index) => `Vé ${index + 1}`)
      : sortSeats(seats),
    count: quantity,
    seed,
    code: buildTicketCode(session, seed),
  };
}

/** 21×21 QR-like grid (row-major); `true` cells are dark. */
export function qrCells(seed: number): readonly boolean[] {
  const size = 21;
  const random = createRng(seed);
  const finders: readonly (readonly [number, number])[] = [
    [0, 0],
    [14, 0],
    [0, 14],
  ];

  const finder = (x: number, y: number): boolean | null => {
    for (const [ox, oy] of finders) {
      const a = x - ox;
      const b = y - oy;
      if (a >= 0 && a < 7 && b >= 0 && b < 7) {
        return (
          a === 0 ||
          a === 6 ||
          b === 0 ||
          b === 6 ||
          (a >= 2 && a <= 4 && b >= 2 && b <= 4)
        );
      }
    }
    return null;
  };

  const cells: boolean[] = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const inFinder = finder(x, y);
      const separator =
        (x === 7 && y < 8) ||
        (y === 7 && x < 8) ||
        (x === 13 && y < 8) ||
        (y === 7 && x > 12) ||
        (y === 13 && x < 8) ||
        (x === 7 && y > 12);
      cells.push(
        inFinder !== null ? inFinder : separator ? false : random() > 0.5,
      );
    }
  }
  return cells;
}

/** A session is flagged when its VIP stand is nearly sold out. */
export const SESSION_URGENT_BELOW = 4;
