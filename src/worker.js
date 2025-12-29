// @ts-check
import { workerAdapter } from "./common/adapter.js";
import api from "../api/index.js";
import pin from "../api/pin.js";
import topLangs from "../api/top-langs.js";
import wakatime from "../api/wakatime.js";
import gist from "../api/gist.js";

export default {
  /**
   * Fetch handler for Cloudflare Worker.
   *
   * @param {Request} request The incoming request.
   * @param {*} env The environment variables.
   * @param {*} ctx The execution context.
   * @returns {Promise<Response>} The response.
   */
  // eslint-disable-next-line no-unused-vars
  async fetch(request2, env3, ctx) {
    // 核心修复：在任何 import 的逻辑运行前，强制同步 env
    globalThis.process = globalThis.process || {};
    globalThis.process.env = {
      ...globalThis.process.env,
      ...env3,
      NODE_ENV: "production"
    };

    const url = new URL(request2.url);
    const path = url.pathname;

    // 打印日志，方便你在 Cloudflare 后台查看
    console.log(`Path: ${path}, Username: ${url.searchParams.get("username")}`);

    switch (path) {
      case "/api":
      case "/api/index":
        return workerAdapter(request2, api_default);
      case "/api/pin":
        return workerAdapter(request2, pin_default);
      case "/api/top-langs":
        return workerAdapter(request2, top_langs_default);
      case "/api/wakatime":
        return workerAdapter(request2, wakatime_default);
      case "/api/gist":
        return workerAdapter(request2, gist_default);
      default:
        return new Response("Not Found", { status: 404 });
    }
  }
};
