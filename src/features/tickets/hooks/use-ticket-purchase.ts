import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useTransientMessage } from '@jujistu/shared/hooks/use-transient-message';

import {
  MAX_GENERAL_TICKETS,
  MAX_SEATED_TICKETS,
  MOCK_PAYMENT_MS,
  PAYMENT_METHODS,
  TICKET_EVENT,
} from '../data/ticket-content';
import {
  buildPurchasedTicket,
  buildSeatRows,
  buildZoneAvailability,
  computePricing,
  findZone,
  formatVnd,
  priceFrom,
  sortSeats,
  zoneRemaining,
} from '../data/ticket-selectors';
import { nextTicketSeed, savePurchasedTicket } from '../data/ticket-store';
import type {
  PaymentMethod,
  SeatRow,
  TicketEvent,
  TicketSession,
  TicketZone,
  ZoneAvailability,
  ZoneId,
} from '../types/ticket.types';

export type PurchaseStage = 'pick' | 'done';

export interface SummaryRow {
  readonly label: string;
  readonly value: string;
}

export interface UseTicketPurchaseOptions {
  /** Stand preselected when the flow opens, e.g. from a shop ticket product. */
  readonly initialZone?: ZoneId;
}

export interface UseTicketPurchaseResult {
  readonly event: TicketEvent;
  readonly stage: PurchaseStage;
  readonly sessions: readonly TicketSession[];
  readonly sessionIndex: number;
  readonly selectSession: (index: number) => void;
  readonly priceFromLabel: string;
  readonly zones: readonly ZoneAvailability[];
  readonly zone: TicketZone;
  readonly selectZone: (zoneId: ZoneId) => void;
  readonly seatRows: readonly SeatRow[];
  readonly toggleSeat: (seatId: string) => void;
  readonly quantity: number;
  readonly changeGeneralQuantity: (delta: number) => void;
  readonly summaryLeft: string;
  readonly summaryRight: string;
  readonly canContinue: boolean;
  readonly continueLabel: string;
  readonly confirmOpen: boolean;
  readonly openConfirm: () => void;
  readonly closeConfirm: () => void;
  readonly summaryRows: readonly SummaryRow[];
  readonly totalLabel: string;
  readonly paymentMethods: readonly PaymentMethod[];
  readonly paymentMethod: PaymentMethod;
  readonly selectPaymentMethod: (method: PaymentMethod) => void;
  readonly paying: boolean;
  readonly payLabel: string;
  readonly pay: () => void;
  readonly notice: string | null;
}

export function useTicketPurchase({
  initialZone = 'vip',
}: UseTicketPurchaseOptions = {}): UseTicketPurchaseResult {
  const [sessionIndex, setSessionIndex] = useState(0);
  const [zoneId, setZoneId] = useState<ZoneId>(initialZone);
  const [seats, setSeats] = useState<readonly string[]>([]);
  const [generalQuantity, setGeneralQuantity] = useState(2);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PAYMENT_METHODS[0],
  );
  const [paying, setPaying] = useState(false);
  const [stage, setStage] = useState<PurchaseStage>('pick');
  const notice = useTransientMessage();
  const payTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (payTimer.current) {
        clearTimeout(payTimer.current);
      }
    },
    [],
  );

  const session = TICKET_EVENT.sessions[sessionIndex];
  const zone = findZone(zoneId);
  const quantity = zone.generalAdmission ? generalQuantity : seats.length;
  const sortedSeats = useMemo(() => sortSeats(seats), [seats]);

  const zones = useMemo(
    () => buildZoneAvailability(session, zoneId),
    [session, zoneId],
  );
  const seatRows = useMemo(
    () => buildSeatRows(sessionIndex, session, zone, seats),
    [sessionIndex, session, zone, seats],
  );
  const pricing = computePricing(zone, quantity);

  const selectSession = useCallback((index: number) => {
    setSessionIndex(index);
    setSeats([]);
    setZoneId(current =>
      zoneRemaining(TICKET_EVENT.sessions[index], current) > 0
        ? current
        : 'vip',
    );
  }, []);

  const selectZone = useCallback(
    (nextZone: ZoneId) => {
      const target = findZone(nextZone);
      if (zoneRemaining(session, nextZone) === 0) {
        notice.show(`${target.name} đã hết vé buổi này`);
        return;
      }
      setZoneId(nextZone);
      setSeats([]);
    },
    [notice, session],
  );

  const toggleSeat = useCallback(
    (seatId: string) => {
      const row = seatRows.find(item => seatId.startsWith(item.label));
      const seat = [...(row?.left ?? []), ...(row?.right ?? [])].find(
        item => item.id === seatId,
      );
      if (!seat) {
        return;
      }
      if (seat.state === 'sold') {
        notice.show(`Ghế ${seatId} đã có người mua`);
        return;
      }
      if (seat.state === 'free' && seats.length >= MAX_SEATED_TICKETS) {
        notice.show(`Mỗi lần mua tối đa ${MAX_SEATED_TICKETS} vé`);
        return;
      }
      setSeats(current =>
        current.includes(seatId)
          ? current.filter(item => item !== seatId)
          : [...current, seatId],
      );
    },
    [notice, seatRows, seats.length],
  );

  const changeGeneralQuantity = useCallback(
    (delta: number) => {
      if (delta > 0 && generalQuantity >= MAX_GENERAL_TICKETS) {
        notice.show(`Mỗi lần mua tối đa ${MAX_GENERAL_TICKETS} vé tự do`);
        return;
      }
      setGeneralQuantity(value =>
        Math.min(MAX_GENERAL_TICKETS, Math.max(1, value + delta)),
      );
    },
    [generalQuantity, notice],
  );

  const pay = useCallback(() => {
    if (paying) {
      return;
    }
    setPaying(true);
    payTimer.current = setTimeout(() => {
      savePurchasedTicket(
        buildPurchasedTicket(session, zone, seats, quantity, nextTicketSeed()),
      );
      setPaying(false);
      setConfirmOpen(false);
      setSeats([]);
      setStage('done');
      notice.show('Đã lưu vé vào ứng dụng');
    }, MOCK_PAYMENT_MS);
  }, [notice, paying, quantity, seats, session, zone]);

  const summaryRows: readonly SummaryRow[] = [
    {
      label: 'Buổi',
      value: `${session.date} · ${session.kindShort} · ${session.startTime}`,
    },
    { label: 'Khu', value: zone.name },
    {
      label: 'Ghế',
      value: zone.generalAdmission
        ? `${quantity} ghế tự do`
        : sortedSeats.join(', '),
    },
    { label: 'Giá vé', value: `${quantity} × ${formatVnd(zone.price)}` },
    { label: 'Phí dịch vụ', value: formatVnd(pricing.fee) },
  ];

  return {
    event: TICKET_EVENT,
    stage,
    sessions: TICKET_EVENT.sessions,
    sessionIndex,
    selectSession,
    priceFromLabel: formatVnd(priceFrom(session)),
    zones,
    zone,
    selectZone,
    seatRows,
    toggleSeat,
    quantity,
    changeGeneralQuantity,
    summaryLeft: zone.generalAdmission
      ? `${session.date} · ${zone.name} · ghế tự do`
      : quantity > 0
      ? `${session.date} · ${zone.name} · ${sortedSeats.join(', ')}`
      : `${session.date} · Chạm vào ghế trống để chọn`,
    summaryRight: quantity > 0 ? `${quantity} vé` : '',
    canContinue: quantity > 0,
    continueLabel:
      quantity > 0
        ? `Tiếp tục · ${formatVnd(pricing.subtotal)}`
        : 'Chọn ít nhất 1 ghế',
    confirmOpen,
    openConfirm: () => setConfirmOpen(true),
    closeConfirm: () => setConfirmOpen(false),
    summaryRows,
    totalLabel: formatVnd(pricing.total),
    paymentMethods: PAYMENT_METHODS,
    paymentMethod,
    selectPaymentMethod: setPaymentMethod,
    paying,
    payLabel: paying
      ? 'Đang xử lý…'
      : `Thanh toán · ${formatVnd(pricing.total)}`,
    pay,
    notice: notice.message,
  };
}
