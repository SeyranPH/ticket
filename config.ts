const dotenv = require('dotenv');
dotenv.config();

export const dbConfig = {
  type!: "postgres",
  host!: process.env.POSTGRES_HOST,
  port!: Number(process.env.POSTGRES_PORT),
  username!: process.env.POSTGRES_USER,
  password!: process.env.POSTGRES_PASSWORD,
  database!: process.env.POSTGRES_DB,
  synchronize!: true,
  autoLoadEntities: true,
};

export const config = {
  port: process.env.SERVER_PORT,
}
