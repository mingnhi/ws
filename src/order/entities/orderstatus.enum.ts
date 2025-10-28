import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Trạng thái đơn hàng',
});
