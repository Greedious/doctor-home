import { Order } from '../data/order.schema';

export function filterOrder(orders: Order[]) {
  const ordersResponse = [];
  orders.map((order) => {
    ordersResponse.push(order);
  });

  return ordersResponse;
}
