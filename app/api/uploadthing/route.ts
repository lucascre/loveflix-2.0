import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Exporte o handler da rota
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});