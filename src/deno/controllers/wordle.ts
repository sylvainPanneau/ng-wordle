import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
const { DATA_API_KEY, APP_ID } = config();
const BASE_URI = `https://data.mongodb-api.com/app/${APP_ID}/endpoint/data/v1`;
const DATA_SOURCE = "Wordle";
const DATABASE = "wordle_db";
const COLLECTION = "wordle_collection";

const options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "api-key": DATA_API_KEY,
    },
    body: ""
};