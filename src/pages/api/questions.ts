import { Question, Round } from "../../types";

import { APIRoute } from "astro";
import JsonDataService from "../../data/JsonDataService";
import { getJsonPath } from "../../config/Config";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const roundId = parseInt(params.roundId as string);

  const questions = await JsonDataService.readJsonFile<Question[]>(getJsonPath('QUESTIONS'))
  const rounds = await JsonDataService.readJsonFile<Round[]>(getJsonPath('ROUNDS'))
  const round = rounds.find(r => r.id === roundId);

  return new Response(
    JSON.stringify({
      message: questions.filter(q => !round || round.questions.includes(q.id))
    }),
  )
}