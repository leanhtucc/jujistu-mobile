import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  MyTicketsScreen,
  TicketPurchaseScreen,
} from '@jujistu/features/tickets';

import {
  TICKET_EVENT,
  ZONES,
} from '../src/features/tickets/data/ticket-content';
import {
  buildSeatRows,
  buildZoneAvailability,
  computePricing,
  formatVnd,
  qrCells,
  sortSeats,
} from '../src/features/tickets/data/ticket-selectors';
import {
  getPurchasedTicket,
  resetTicketStore,
} from '../src/features/tickets/data/ticket-store';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const mounted: ReactTestRenderer.ReactTestRenderer[] = [];

function render(element: React.ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>{element}</SafeAreaProvider>,
    );
  });
  mounted.push(tree);
  return tree;
}

function has(tree: ReactTestRenderer.ReactTestRenderer, testID: string) {
  return tree.root.findAllByProps({ testID }).length > 0;
}

function press(tree: ReactTestRenderer.ReactTestRenderer, testID: string) {
  act(() => {
    tree.root.findAllByProps({ testID })[0].props.onPress();
  });
}

function pressableByText(
  tree: ReactTestRenderer.ReactTestRenderer,
  prefix: string,
  predicate: (node: ReactTestRenderer.ReactTestInstance) => boolean,
) {
  const text = tree.root.findAll(
    node =>
      typeof node.props.children === 'string' &&
      node.props.children.startsWith(prefix),
  )[0];
  let node: ReactTestRenderer.ReactTestInstance | null = text ?? null;
  while (node && !predicate(node)) {
    node = node.parent;
  }
  return node;
}

function pressText(tree: ReactTestRenderer.ReactTestRenderer, prefix: string) {
  const node = pressableByText(
    tree,
    prefix,
    candidate => typeof candidate.props.onPress === 'function',
  );
  expect(node).not.toBeNull();
  act(() => {
    node?.props.onPress();
  });
}

const FIRST_SESSION = TICKET_EVENT.sessions[0];

function freeSeats(zoneIndex: number, count: number): string[] {
  return buildSeatRows(0, FIRST_SESSION, ZONES[zoneIndex], [])
    .flatMap(row => [...row.left, ...row.right])
    .filter(seat => seat.state === 'free')
    .slice(0, count)
    .map(seat => seat.id);
}

beforeEach(() => {
  jest.useFakeTimers();
  resetTicketStore();
});

afterEach(() => {
  act(() => {
    mounted.splice(0).forEach(tree => tree.unmount());
  });
  jest.useRealTimers();
});

describe('ticket selectors', () => {
  it('leaves exactly the remaining number of seats free', () => {
    const vipFree = buildSeatRows(0, FIRST_SESSION, ZONES[0], [])
      .flatMap(row => [...row.left, ...row.right])
      .filter(seat => seat.state === 'free');
    expect(vipFree).toHaveLength(FIRST_SESSION.remaining[0]);

    const aFree = freeSeats(1, 100);
    expect(aFree).toHaveLength(FIRST_SESSION.remaining[1]);
  });

  it('is deterministic and marks selected seats', () => {
    const [seat] = freeSeats(0, 1);
    const a = buildSeatRows(0, FIRST_SESSION, ZONES[0], [seat]);
    const b = buildSeatRows(0, FIRST_SESSION, ZONES[0], [seat]);
    expect(a).toEqual(b);
    const picked = a
      .flatMap(row => [...row.left, ...row.right])
      .find(item => item.id === seat);
    expect(picked?.state).toBe('selected');
  });

  it('labels zone availability', () => {
    const zones = buildZoneAvailability(FIRST_SESSION, 'vip');
    const byId = Object.fromEntries(zones.map(item => [item.zone.id, item]));
    expect(byId.vip.stateLabel).toBe('CÒN 3');
    expect(byId.vip.selected).toBe(true);
    expect(byId.b.soldOut).toBe(true);
    expect(byId.b.stateLabel).toBe('HẾT VÉ');
    expect(byId.c.stateLabel).toBe('TỰ DO');
  });

  it('prices tickets with the per-ticket service fee', () => {
    expect(computePricing(ZONES[1], 2)).toEqual({
      subtotal: 500000,
      fee: 10000,
      total: 510000,
    });
    expect(formatVnd(510000)).toBe('510.000₫');
  });

  it('sorts seats by row then number', () => {
    expect(sortSeats(['B2', 'A10', 'A2', 'A1'])).toEqual([
      'A1',
      'A2',
      'A10',
      'B2',
    ]);
  });

  it('builds a 21x21 QR grid with finder patterns', () => {
    const cells = qrCells(4217);
    expect(cells).toHaveLength(441);
    // Top-left finder corner and centre are dark, its inner ring is light.
    expect(cells[0]).toBe(true);
    expect(cells[3 * 21 + 3]).toBe(true);
    expect(cells[1 * 21 + 1]).toBe(false);
    expect(qrCells(4217)).toEqual(cells);
    expect(qrCells(4318)).not.toEqual(cells);
  });
});

describe('TicketPurchaseScreen', () => {
  it('disables continue until a seat is chosen', () => {
    const tree = render(<TicketPurchaseScreen onBack={jest.fn()} />);
    const cta = pressableByText(
      tree,
      'Chọn ít nhất 1 ghế',
      node => node.props.accessibilityState !== undefined,
    );
    expect(cta?.props.accessibilityState.disabled).toBe(true);
  });

  it('rejects sold-out zones and sold seats with a notice', () => {
    const tree = render(<TicketPurchaseScreen onBack={jest.fn()} />);
    press(tree, 'ticket-zone-b');
    expect(has(tree, 'ticket-notice')).toBe(true);
    expect(
      tree.root.findAllByProps({
        message: 'Khán đài B đã hết vé buổi này',
      }).length,
    ).toBeGreaterThan(0);
  });

  it('limits a booking to four seated tickets', () => {
    const tree = render(
      <TicketPurchaseScreen initialZone="a" onBack={jest.fn()} />,
    );
    freeSeats(1, 5).forEach(id => press(tree, `ticket-seat-${id}`));
    expect(
      tree.root.findAllByProps({ message: 'Mỗi lần mua tối đa 4 vé' }).length,
    ).toBeGreaterThan(0);
    expect(
      tree.root.findAllByProps({ children: '4 vé' }).length,
    ).toBeGreaterThan(0);
  });

  it('buys seats, pays and shows the ticket', () => {
    const onGoHome = jest.fn();
    const tree = render(
      <TicketPurchaseScreen onBack={jest.fn()} onGoHome={onGoHome} />,
    );
    const seats = freeSeats(0, 2);
    seats.forEach(id => press(tree, `ticket-seat-${id}`));

    // 2 × 450.000 = 900.000 before the 10.000 fee.
    pressText(tree, 'Tiếp tục · 900.000₫');
    expect(has(tree, 'ticket-confirm-sheet')).toBe(true);
    expect(
      tree.root.findByProps({ testID: 'ticket-total' }).props.children,
    ).toBe('910.000₫');

    press(tree, 'ticket-pay-VNPay QR');
    pressText(tree, 'Thanh toán · 910.000₫');
    act(() => {
      jest.advanceTimersByTime(1400);
    });

    expect(has(tree, 'ticket-pass')).toBe(true);
    const saved = getPurchasedTicket();
    expect(saved?.count).toBe(2);
    expect(saved?.zoneName).toBe('VIP sát thảm');
    expect(saved?.seats).toEqual(sortSeats(seats));
    expect(saved?.code).toMatch(/^NAT-2809-\d{4}$/);

    pressText(tree, 'Về trang chủ');
    expect(onGoHome).toHaveBeenCalledTimes(1);
  });

  it('buys general admission tickets by quantity', () => {
    const tree = render(<TicketPurchaseScreen onBack={jest.fn()} />);
    press(tree, 'ticket-zone-c');
    expect(has(tree, 'ticket-general-quantity')).toBe(true);

    pressText(tree, 'Tiếp tục · 300.000₫');
    pressText(tree, 'Thanh toán');
    act(() => {
      jest.advanceTimersByTime(1400);
    });
    expect(getPurchasedTicket()?.seats).toEqual(['Vé 1', 'Vé 2']);
  });

  it('changes session and keeps a zone that is still on sale', () => {
    const tree = render(<TicketPurchaseScreen onBack={jest.fn()} />);
    press(tree, 'ticket-session-2');
    // Zone C is sold out on 30/09, VIP stays selectable.
    press(tree, 'ticket-zone-c');
    expect(
      tree.root.findAllByProps({ message: 'Khán đài C đã hết vé buổi này' })
        .length,
    ).toBeGreaterThan(0);
  });
});

describe('MyTicketsScreen', () => {
  it('shows an empty state with a buy action', () => {
    const onBuyTicket = jest.fn();
    const tree = render(
      <MyTicketsScreen onBack={jest.fn()} onBuyTicket={onBuyTicket} />,
    );
    expect(has(tree, 'my-tickets-empty')).toBe(true);
    pressText(tree, 'Mua vé');
    expect(onBuyTicket).toHaveBeenCalledTimes(1);
  });

  it('shows the purchased ticket and switches between its QR codes', () => {
    const purchase = render(
      <TicketPurchaseScreen initialZone="a" onBack={jest.fn()} />,
    );
    freeSeats(1, 2).forEach(id => press(purchase, `ticket-seat-${id}`));
    pressText(purchase, 'Tiếp tục');
    pressText(purchase, 'Thanh toán');
    act(() => {
      jest.advanceTimersByTime(1400);
    });

    const tree = render(<MyTicketsScreen onBack={jest.fn()} />);
    expect(has(tree, 'ticket-pass')).toBe(true);
    expect(
      tree.root.findAllByProps({ children: 'VÉ 01 / 02' }).length,
    ).toBeGreaterThan(0);

    press(tree, 'ticket-pass-seat-1');
    expect(
      tree.root.findAllByProps({ children: 'VÉ 02 / 02' }).length,
    ).toBeGreaterThan(0);
    expect(tree.root.findAllByProps({ children: 'VÉ 01 / 02' })).toHaveLength(
      0,
    );
  });
});
