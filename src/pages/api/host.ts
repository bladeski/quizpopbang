import { APIRoute } from "astro";
import type { Host } from "../../types";
import JsonDataService from "../../data/JsonDataService";
import { getJsonPath } from "../../config/Config";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const host = await JsonDataService.readJsonFile<Host>(getJsonPath('HOST'))
  return new Response(
    JSON.stringify({
      message: host
    }),
  )
}

export const POST: APIRoute = async ({params}) => {
  const token = params.token;
  const host = await JsonDataService.readJsonFile<Host>(getJsonPath('HOST'));
  return JsonDataService.writeJsonFile('HOST', {
    ...host,
    token
  })
    .then(() => new Response(
    JSON.stringify({
      message: 'Current question updated'
    }))
  );
}