import { Question, Quiz } from "../../../types";

import { APIRoute } from "astro";
import JsonDataService from "../../../data/JsonDataService";
import { getJsonPath } from "../../../config/Config";

export const prerender = false;

export const GET: APIRoute = async () => {
  const quiz = await JsonDataService.readJsonFile<Quiz>(getJsonPath('QUIZ'));
  const questions = await JsonDataService.readJsonFile<Question[]>(getJsonPath('QUESTIONS'))
  const question = questions.find(q => q.id === quiz.currentQuestion);
  return new Response(
    JSON.stringify({
      message: question
    }),
  )
}

export const POST: APIRoute = async ({params}) => {
  const quiz = await JsonDataService.readJsonFile<Quiz>(getJsonPath('QUIZ'));
  quiz.currentQuestion = params.id ? parseInt(params.id as string) : quiz.currentQuestion + 1;
  return JsonDataService.writeJsonFile('QUIZ', quiz)
    .then(() => new Response(
    JSON.stringify({
      message: 'Current question updated'
    }))
  );
}