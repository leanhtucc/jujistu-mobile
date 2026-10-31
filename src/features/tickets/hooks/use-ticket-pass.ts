import { useCallback, useMemo, useState } from 'react';

import { useTransientMessage } from '@jujistu/shared/hooks/use-transient-message';

import { TICKET_EVENT } from '../data/ticket-content';
import { qrCells } from '../data/ticket-selectors';
import { usePurchasedTicket } from '../data/ticket-store';
import type { PurchasedTicket } from '../types/ticket.types';

export interface TicketInfoRow {
  readonly label: string;
  readonly value: string;
}

export interface UseTicketPassResult {
  readonly ticket: PurchasedTicket | null;
  readonly eventCaps: string;
  readonly venue: string;
  readonly infoRows: readonly TicketInfoRow[];
  readonly seatIndex: number;
  readonly selectSeat: (index: number) => void;
  /** `VÉ 01 / 02` */
  readonly counterLabel: string;
  readonly code: string;
  readonly cells: readonly boolean[];
  readonly note: string;
  readonly save: () => void;
  readonly openMap: () => void;
  readonly notice: string | null;
}

export function useTicketPass(): UseTicketPassResult {
  const ticket = usePurchasedTicket();
  const [seatIndex, setSeatIndex] = useState(0);
  const notice = useTransientMessage();

  const index = ticket ? Math.min(seatIndex, ticket.seats.length - 1) : 0;
  const cells = useMemo(
    () => (ticket ? qrCells(ticket.seed + index * 101) : []),
    [ticket, index],
  );

  const save = useCallback(
    () => notice.show('Đã lưu ảnh vé vào thư viện'),
    [notice],
  );
  const openMap = useCallback(
    () => notice.show(`Mở bản đồ · ${TICKET_EVENT.venue.split(' · ')[0]}`),
    [notice],
  );

  return {
    ticket,
    eventCaps: TICKET_EVENT.name.toUpperCase(),
    venue: TICKET_EVENT.venue,
    infoRows: ticket
      ? [
          { label: 'NGÀY', value: `${ticket.date}/2026` },
          {
            label: 'MỞ CỬA',
            value: `${ticket.openTime} · bắt đầu ${ticket.startTime}`,
          },
          { label: 'CỔNG', value: TICKET_EVENT.gate },
          { label: 'KHU', value: ticket.zoneName },
        ]
      : [],
    seatIndex: index,
    selectSeat: setSeatIndex,
    counterLabel: ticket
      ? `VÉ ${String(index + 1).padStart(2, '0')} / ${String(
          ticket.count,
        ).padStart(2, '0')}`
      : '',
    code: ticket ? `${ticket.code}-${index + 1}` : '',
    cells,
    note: ticket
      ? `Xuất trình mã QR tại ${TICKET_EVENT.gate} · mở cửa ${ticket.openTime}. Mỗi mã dùng cho một người vào cửa.`
      : '',
    save,
    openMap,
    notice: notice.message,
  };
}
