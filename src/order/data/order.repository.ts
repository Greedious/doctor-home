import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { Order, OrderedProduct } from './order.schema';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import sequelize from 'sequelize';
import { ProductService } from 'src/product/service/product.service';
import { Product } from 'src/product/data/product.schema';
import { language } from 'package/utils/language/language';
import { ImageService } from 'src/image/service/image.service';
import { Image } from 'src/image/data/image.schema';

@Injectable()
export class OrderRepository extends SequelizeRepository<Order> {
  constructor(
    @InjectModel(Order)
    orderRepository: typeof Order,
    private readonly productService: ProductService,
    private readonly imageService: ImageService,
  ) {
    super(orderRepository);
  }

  async findMostOrderedProduct() {
    const query = `
      SELECT sk."productId" as p_id, SUM(op."quantity") as quantity, sk."imageId" as img_id
      FROM ordered_products op
      INNER JOIN skus sk on (sk."id" = op."skuId")
      GROUP BY sk."productId"
      ORDER BY SUM(op."quantity")
      LIMIT 1  
    `;

    const products = (await OrderedProduct.sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    })) as any;

    let product: null | Product = null;
    let image: null | Image = null;

    if (products.length) {
      product = await this.productService.findOne(products[0].p_id);
      image = await this.imageService.findOneById(products[0].img_id);
    }

    const result: {
      totalOrderedQuantity: number;
      name: language;
      image: string | null;
    } = {
      totalOrderedQuantity: +products?.[0]?.quantity || 0,
      name: product?.name || { en: '', ar: '' },
      image: image ? image.title : null,
    };
    return result;
  }
}

@Injectable()
export class OrderedProductRepository extends SequelizeRepository<OrderedProduct> {
  constructor(
    @InjectModel(OrderedProduct)
    orderedProductRepository: typeof OrderedProduct,
  ) {
    super(orderedProductRepository);
  }
}
