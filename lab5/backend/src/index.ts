import { app } from "./app.js";
import { seedDb } from "./db/seed.js";

const PORT = 3000;

async function bootstrap() {
  await seedDb();
  app.listen(PORT, () => {
    console.log(`API started on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
