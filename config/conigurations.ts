import * as Joi from 'joi';

export const configsSchema = Joi.object({
  // NODE
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision', 'staging')
    .default('development'),

  // API
  API_PORT: Joi.number().port().default(3000),
  API_HOST: Joi.string().required(),

  // DB
  // POSTGRES
  DB_PORT: Joi.number().port().default(5432),
  DB_HOST: Joi.string().hostname().default('localhost'),
  DB_NAME: Joi.string(),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string(),

  // MONGODB
  MONGODB_URL: Joi.string().required(),
  MONGODB_NAME: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string(),
  JWT_EXPIRATION: Joi.string(),

  // UPLOAd
  UPLOAD_DIR: Joi.string(),
});

export interface IConfigVars {
  NODE_ENV: string;
  API_PORT: number;
  API_HOST: string;
  DB_PORT: number;
  DB_HOST: string;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
}
