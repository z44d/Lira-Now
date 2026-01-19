import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import IORedis from "ioredis";

const app = new Hono();
app.use("/*", cors());

const redis = new IORedis();
const { EXCHANGERATE_API_KEY, CACHE_TIME_SECONDS = "7200" } = process.env;

export const getRates = async () => {
  const rates = await redis.get("rates");
  if (rates) {
    return JSON.parse(rates);
  }

  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/latest/SYP`,
  );
  const data = await response.json();
  await redis.setex(
    "rates",
    Number(CACHE_TIME_SECONDS),
    JSON.stringify(data),
  );
  return data;
};

app.get("/rates", async (c) => {
  const rates = await getRates();
  return c.json(rates);
});

export default {
  port: Number(process.env.SERVER_PORT || 3000),
  host: process.env.SERVER_HOST || "localhost",
  fetch: app.fetch,
};
