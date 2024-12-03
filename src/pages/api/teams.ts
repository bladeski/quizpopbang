import { APIRoute } from "astro";
import JsonDataService from "../../data/JsonDataService";
import { Team } from "../../types";
import { getJsonPath } from "../../config/Config";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const teams = await JsonDataService.readJsonFile<Team[]>(getJsonPath('TEAMS'))
  return new Response(
    JSON.stringify({
      message: teams
    }),
  )
}