import { Application } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import router from "./routes.ts";
const app = new Application();
const PORT = 3000;

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: PORT });
console.log(`Server running on port ${PORT}`);