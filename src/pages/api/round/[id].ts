import { APIRoute } from "astro";
import JsonDataService from "../../../data/JsonDataService";
import { Round } from "../../../types";
import { getJsonPath } from "../../../config/Config";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = parseInt(params.id as string);
    const rounds = await JsonDataService.readJsonFile<Round[]>(getJsonPath('ROUNDS'));
    const round = rounds?.find(r => r.id === id);

    if (!round) {
      throw new Error(`Round with id ${id} not found`);
    }

    return new Response(
      JSON.stringify({
        message: round
      }),
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