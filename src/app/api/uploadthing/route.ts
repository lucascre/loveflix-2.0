import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Cria e exporta os manipuladores de rota GET e POST para o Next.js.
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});