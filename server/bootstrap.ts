import { sdk } from "./observability/instrumentation";

async function bootstrap() {
  try {
    await sdk.start();
    console.log("[OpenTelemetry] SDK started successfully");

    await import("./index");
  } catch (error) {
    console.error("[OpenTelemetry] Failed to start SDK", error);
  }
}

bootstrap();

process.on("SIGTERM", async () => {
  await sdk.shutdown();
  console.log("[OpenTelemetry] SDK shut down gracefully");
});
