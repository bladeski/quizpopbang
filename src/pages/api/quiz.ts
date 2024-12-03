import { APIRoute } from "astro";
import JsonDataService from "../../data/JsonDataService";
import type { Quiz } from "../../types";
import { getJsonPath } from "../../config/Config";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const quiz = await JsonDataService.readJsonFile<Quiz>(getJsonPath('QUIZ'));
  return new Response(
    JSON.stringify({
      message: quiz
    }),
  )
}