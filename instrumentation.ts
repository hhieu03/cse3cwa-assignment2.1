// instrumentation.ts
export async function register() {
  // Log khi server (Node runtime) của Next khởi động
  console.log("[instrument] app start @", new Date().toISOString());
}
