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

export const POST: APIRoute = async ({request}) => {
  const body = await request.json();
  const token = body.token;
  const host = await JsonDataService.readJsonFile<Host>(getJsonPath('HOST'));
  return JsonDataService.writeJsonFile(getJsonPath('HOST'), {
    ...host,
    token
  })
  .then(() => new Response(
    JSON.stringify({
      message: 'Host token updated'
    }))
  );
}