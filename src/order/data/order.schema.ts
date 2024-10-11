import { OrderStatus } from 'package/utils/enums';
import { language } from 'package/utils/language/language';
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from 'src/account/user/data/user.schema';
import { Address } from 'src/address/data/address.schema';
import { DeliveryArea } from 'src/delivery-area/data/delivery-area.schema';
import { Sku } from 'src/sku/data/sku.schema';

export enum deliverOption {
  free = 'Free',
  paid = 'Paid',
}
@Table({
  tableName: 'orders',
  modelName: 'Order',
  timestamps: true,
  paranoid: true,
})
export class Order extends Model<Order> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  totalPrice: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  discount: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  totalQuantity: number;

  @Column({ type: DataType.STRING, defaultValue: OrderStatus.PLACED })
  status: OrderStatus;

  @Column({ type: DataType.STRING })
  deliverOption: deliverOption;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  reviewPopup: boolean;

  // Associations:
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Address)
  @Column({ type: DataType.INTEGER, allowNull: true })
  addressId: number;

  @BelongsTo(() => Address, {
    foreignKey: 'addressId',
    as: 'address',
  })
  address: Address;

  @ForeignKey(() => DeliveryArea)
  @Column({ type: DataType.INTEGER, allowNull: true })
  freeDeliverAreaId: number;

  @BelongsTo(() => DeliveryArea, {
    foreignKey: 'freeDeliverAreaId',
    as: 'freeDeliverArea',
  })
  freeDeliverArea: DeliveryArea;

  @HasMany(() => OrderedProduct)
  orderedProducts: OrderedProduct[];
}

@Table({
  tableName: 'ordered_products',
  modelName: 'OrderedProduct',
  timestamps: true,
  paranoid: true,
})
export class OrderedProduct extends Model<OrderedProduct> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: { ar: '', en: '' },
  })
  name: language;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: false })
  orderId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  price: number;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
  image: string;

  @BelongsTo(() => Sku)
  sku: Sku;

  @ForeignKey(() => Sku)
  @Column({ type: DataType.INTEGER, allowNull: false })
  skuId: number;

  @BelongsTo(() => Order)
  order: Order;
}
