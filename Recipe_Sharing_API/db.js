import pg from "pg";

export default () => {
  const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });

  db.connect((error) => {
    if (error) {
      console.error("Could not connect to the database!", error);
    } else {
      console.log("Connected to database successfully");
    }
  });

  return db;
};
