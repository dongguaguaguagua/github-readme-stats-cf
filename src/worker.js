// @ts-check
import { workerAdapter } from "./common/adapter.js";
import api from "../api/index.js";
import pin from "../api/pin.js";
import topLangs from "../api/top-langs.js";
import wakatime from "../api/wakatime.js";
import gist from "../api/gist.js";

// 调试
export default {
  async fetch(request, env, ctx) {
    // 强制打印当前收到的所有环境变量名（不打印值，保护隐私）
    const keys = Object.keys(env);
    console.log("Worker Started. Available Env Keys:", JSON.stringify(keys));

    // 检查是否有 PAT_ 开头的变量
    const hasToken = keys.some(k => k.startsWith("PAT_"));
    if (!hasToken) {
      return new Response("Error: No PAT_ tokens found in Environment Variables!", { status: 500 });
    }

    // 强制同步
    globalThis.process = { env: { ...env, NODE_ENV: "production" } };

    try {
      // 这里的 api_default 等需要确保你代码里有 import
      const url = new URL(request.url);
      if (url.pathname === "/api") {
        // 直接尝试最核心的逻辑
        return workerAdapter(request, api_default);
      }
      return new Response("Not Found", { status: 404 });
    } catch (e) {
      console.log("Fatal Error:", e.message);
      return new Response(e.message, { status: 500 });
    }
  }
};
