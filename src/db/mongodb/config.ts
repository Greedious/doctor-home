import * as dotenv from 'dotenv';
dotenv.config();

export const mongoDbConfig = {
  url: process.env.MONGODB_URL,
  name: process.env.MONGODB_NAME,
};
