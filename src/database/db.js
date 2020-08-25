import { Client } from 'pg';
import databaseConfig from '../config/database';

const client = new Client({
  user: databaseConfig.username,
  host: databaseConfig.host,
  database: databaseConfig.database,
  password: databaseConfig.password,
  port: 5432,
});

client.connect();

export default client;
