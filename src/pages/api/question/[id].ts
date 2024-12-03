import { APIRoute } from "astro";
import JsonDataService from "../../../data/JsonDataService";
import { Question } from "../../../types";
import { getJsonPath } from "../../../config/Config";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = parseInt(params.id as string);
    const questions = await JsonDataService.readJsonFile<Question[]>(getJsonPath('QUESTIONS'))
    const question = questions?.find(q => q.id === id);

    if (!question) {
      throw new Error(`Question with id ${id} not found`);
    }

    return new Response(
      JSON.stringify({
        message: question
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