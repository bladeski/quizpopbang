import { APIRoute } from "astro";
import JsonDataService from "../../../data/JsonDataService";
import { Team } from "../../../types";
import { getJsonPath } from "../../../config/Config";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const teams = await JsonDataService.readJsonFile<Team[]>(getJsonPath('TEAMS'))
    const team = teams?.find(t => t.id === params.id);

    if (!team) {
      throw new Error(`Team with id ${params.id} not found`);
    }

    return new Response(
      JSON.stringify({
        message: team
      }), {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error
      }),
      {
        status: 404
      }
    );
  }  
}