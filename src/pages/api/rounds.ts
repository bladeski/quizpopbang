import { APIRoute } from "astro";
import JsonDataService from "../../data/JsonDataService";
import { Round } from "../../types";
import { getJsonPath } from "../../config/Config";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const rounds = await JsonDataService.readJsonFile<Round[]>(getJsonPath('ROUNDS'))
  return new Response(
    JSON.stringify({
      message: rounds
    }),
  )
}