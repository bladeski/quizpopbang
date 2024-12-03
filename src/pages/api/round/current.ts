import { Quiz, Round } from "../../../types";

import { APIRoute } from "astro";
import JsonDataService from "../../../data/JsonDataService";
import { getJsonPath } from "../../../config/Config";

export const prerender = false;

export const GET: APIRoute = async () => {
  const quiz = await JsonDataService.readJsonFile<Quiz>(getJsonPath('QUIZ'));
  const rounds = await JsonDataService.readJsonFile<Round[]>(getJsonPath('ROUNDS'));
  const round = rounds.find(r => r.id === quiz.currentRound);
  return new Response(
    JSON.stringify({
      message: round
    }),
  )
}

export const POST: APIRoute = async ({params}) => {
  const quiz = await JsonDataService.readJsonFile<Quiz>(getJsonPath('QUIZ'));
  quiz.currentRound = params.id ? parseInt(params.id as string) : quiz.currentRound + 1;
  return JsonDataService.writeJsonFile('QUIZ', quiz)
    .then(() => new Response(
    JSON.stringify({
      message: 'Current question updated'
    }))
  );
}