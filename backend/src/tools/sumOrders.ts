// backend/src/tools/sumOrders.ts

export function sumOrders(customerId: number) {
  const orders = [
    { id: 1, total: 49.99 },
    { id: 2, total: 149.91 }
  ];
  // Accumulate the total values
  const totalSum = orders.reduce((acc, cur) => acc + cur.total, 0);
  return { customerId, totalSum, count: orders.length };
}
