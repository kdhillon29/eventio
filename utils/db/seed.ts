import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { events } from "./schema";
import { events as seedData } from "../../lib/constants";
import * as dotenv from "dotenv";

dotenv.config({ path: "./.env" });

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env file");
// const productsURL = "https://fakestoreapi.com/products";
// const productsData = (await $fetch(
//   productsURL
// )) as (typeof products.$inferInsert)[];
// const seedData = productsData.map(({ id, ...rest }) => rest);

const main = async () => {
  const data: (typeof events.$inferInsert)[] = [];
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);
  try {
    await client.connect();

    console.log("Database connected successfully");
    console.log("Seed start");
    // data = seedData as (typeof events.$inferInsert)[];
    seedData.forEach((event) => {
      data.push({
        title: event.title,
        description: event.description,
        slug: event.slug,
        image: event.image,
        location: event.location,
        date: event.date,
        time: event.time,
      });
    });
    await db.insert(events).values(data);
    console.log("Seed done");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
};

await main();
