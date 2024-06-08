import { Pool } from 'pg';

async function main() {
  const postgresPool = new Pool({
    user: 'postgres',
    password: 'myPassword',
    host: 'localhost',
    port: 5432,
  });

  await postgresPool.query(`DROP DATABASE gwent_draft_maker WITH (FORCE);`);
}

main();
