export const dbConnection = {
  type: process.env.DB_TYPE ?? 'postgres',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: process.env.DB_PORT ?? 5432,
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'weareone',
  database: process.env.DB_NAME ?? 'post_management_nest',
  autoLoadEntities: true,
  synchronize: true,
};

export const jwtSecretKey =
  process.env.jwtSecretKey ?? 'I love Real Madrid CF & G.Bale';
