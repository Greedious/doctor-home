import { HttpException, HttpStatus } from '@nestjs/common';
import mongoose, { Document } from 'mongoose';
import { Error } from 'package/utils/Error/error';

export abstract class BaseMongoRepository<V, T extends Document> {
  constructor(private readonly entityModel: mongoose.Model<T>) {}

  async create({
    doc,
    options,
    needResult = false,
  }: {
    doc: V;
    options?: mongoose.SaveOptions;
    needResult?: boolean;
  }): Promise<mongoose.Require_id<T>['_id']> {
    const result = await new this.entityModel(doc).save(options);
    return result;
  }

  async countDocuments({
    filter,
    options,
  }: {
    filter?: mongoose.FilterQuery<T>;
    options?: mongoose.QueryOptions<T>;
  }) {
    return await this.entityModel.countDocuments(filter, options);
  }

  async aggregate({
    pipeline,
    options,
  }: {
    pipeline?: mongoose.PipelineStage[];
    options?: mongoose.AggregateOptions;
  }) {
    return await this.entityModel.aggregate(pipeline, options);
  }

  async find({
    filter,
    projection,
    options,
  }: {
    filter?: mongoose.FilterQuery<T>;
    projection?: mongoose.ProjectionType<T>;
    options?: mongoose.QueryOptions<T>;
  }) {
    return await this.entityModel.find(filter, projection, {
      ...options,
      lean: true,
    });
  }

  async findOne({
    filter,
    projection,
    options,
    error,
    throwError = true,
  }: {
    filter?: mongoose.FilterQuery<T>;
    projection?: mongoose.ProjectionType<T>;
    options?: mongoose.QueryOptions<T>;
    error?: Error;
    throwError?: boolean;
  }) {
    const result = await this.entityModel.findOne(filter, projection, {
      ...options,
      lean: true,
    });
    if (!result && throwError && error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async findById({
    _id,
    projection,
    options,
    error,
  }: {
    _id: string | mongoose.Types.ObjectId;
    projection?: mongoose.ProjectionType<T>;
    options?: mongoose.QueryOptions<T>;
    error: Error;
  }) {
    const result = await this.entityModel.findById(_id, projection, {
      ...options,
      lean: true,
    });

    if (!result) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async findOneAndUpdate({
    filter,
    update,
    options,
    error,
    throwError = true,
  }: {
    filter?: mongoose.FilterQuery<T>;
    update?: mongoose.UpdateQuery<T>;
    options?: mongoose.QueryOptions<T>;
    error: Error;
    throwError?: boolean;
  }) {
    const result = await this.entityModel.findOneAndUpdate(
      filter,
      update,
      options,
    );
    if (!result && throwError) {
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async findOneAndDelete({
    filter,
    options,
    error,
    throwError = true,
  }: {
    filter?: mongoose.FilterQuery<T>;
    options?: mongoose.QueryOptions<T>;
    error: Error;
    throwError?: boolean;
  }) {
    const result = await this.entityModel.findOneAndDelete(filter, options);
    if (!result && throwError) {
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async findByIdAndUpdate({
    _id,
    update,
    options,
    error,
  }: {
    _id: string | mongoose.Types.ObjectId;
    update?: mongoose.UpdateQuery<T>;
    options?: mongoose.QueryOptions<T>;
    error: Error;
  }) {
    const result = await this.entityModel.findByIdAndUpdate(
      _id,
      update,
      options,
    );
    if (!result) {
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async findByIdAndDelete({
    _id,
    options,
    error,
  }: {
    _id: mongoose.Types.ObjectId;
    error: Error;
    options?: mongoose.QueryOptions<T>;
  }) {
    const result = await this.entityModel.findByIdAndDelete(_id, options);
    if (!result) {
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async updateMany({
    filter,
    update,
    options,
    error,
    throwError = true,
  }: {
    filter?: mongoose.FilterQuery<T>;
    update?: mongoose.UpdateWithAggregationPipeline | mongoose.UpdateQuery<T>;
    options?: mongoose.QueryOptions<T>;
    error: Error;
    throwError?: boolean;
  }) {
    const result = await this.entityModel.updateMany(filter, update, options);
    if (!result.modifiedCount && throwError) {
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async updateOne({
    filter,
    update,
    options,
    error,
    throwError = true,
  }: {
    filter?: mongoose.FilterQuery<T>;
    update?: mongoose.UpdateWithAggregationPipeline | mongoose.UpdateQuery<T>;
    options?: mongoose.QueryOptions<T>;
    error: Error;
    throwError?: boolean;
  }) {
    const result = await this.entityModel.updateOne(filter, update, options);
    if (!result.modifiedCount && throwError) {
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }
    return;
  }

  async insertMany({
    docs,
    options,
  }: {
    docs: V[];
    options?: mongoose.InsertManyOptions & {
      lean: true;
    };
  }) {
    return await this.entityModel.insertMany(docs, options);
  }

  async distinct({
    field,
    filter,
  }: {
    field: string;
    filter?: mongoose.FilterQuery<T>;
  }) {
    return await this.entityModel.distinct(field, filter);
  }

  async deleteMany({
    filter,
    options,
    error,
    throwError = true,
  }: {
    filter?: mongoose.FilterQuery<T>;
    options?: mongoose.QueryOptions<T>;
    error: Error;
    throwError?: boolean;
  }) {
    const result = await this.entityModel.deleteMany(filter, options);
    if (!result.deletedCount && throwError) {
      throw new HttpException({ error }, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async getSequenceId({
    options,
    tableHaveSequenceId,
    needUpdate = false,
    updateFunction = () => {},
  }: {
    options?: mongoose.QueryOptions<T>;
    tableHaveSequenceId: true;
    needUpdate?: boolean;
    updateFunction?: Function;
  }) {
    const projection = 'sequenceId';
    let sequenceId = 1;
    let lastItem: any = await this.entityModel.find({}, projection, {
      ...options,
      sort: { createdAt: -1 },
      limit: 1,
    });
    if (needUpdate && lastItem.length) {
      lastItem[0].sequenceId = updateFunction(lastItem[0].sequenceId);
    }

    if (lastItem.length !== 0) sequenceId = +lastItem[0].sequenceId + 1;
    return sequenceId;
  }

  async findAndCount({
    filter,
    projection,
    options,
    total = false,
  }: {
    filter?: mongoose.FilterQuery<T>;
    projection?: mongoose.ProjectionType<T>;
    options?: mongoose.QueryOptions<T>;
    total?: boolean;
  }) {
    const queries = [];

    queries.push(
      this.entityModel.find(filter, projection, {
        ...options,
        lean: true,
      }),
    );
    if (total) {
      queries.push(this.entityModel.countDocuments({ filter }));
    }
    const [items, totalRecords = undefined] = await Promise.all(queries);
    return {
      totalRecords,
      items,
    };
  }
}
