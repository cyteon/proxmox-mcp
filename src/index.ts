import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { oauthRoutes, requireBearer } from "./oauth";

// tools
import * as discovery from "./tools/discovery";
import * as qemu from "./tools/qemu";
import * as lxc from "./tools/lxc";
import * as storage from "./tools/storage";
import * as nodes from "./tools/nodes";
import * as tasks from "./tools/tasks";

console.log(
  `Starting Proxmox MCP Server on :${process.env.PORT ? parseInt(process.env.PORT) : 3000}`,
);

if (
  !process.env.BASE_URL ||
  !process.env.OAUTH_CLIENT_ID ||
  !process.env.OAUTH_CLIENT_SECRET ||
  !process.env.MCP_USERNAME ||
  !process.env.MCP_PASSWORD ||
  !process.env.PVE_API_URL ||
  !process.env.PVE_API_TOKEN ||
  !process.env.JWT_SECRET
) {
  console.error("Required env variables are missing");

  process.exit(1);
}

if (
  process.env.OAUTH_CLIENT_ID === "CHANGE_ME" ||
  process.env.OAUTH_CLIENT_SECRET === "CHANGE_ME" ||
  process.env.MCP_USERNAME === "CHANGE_ME" ||
  process.env.MCP_PASSWORD === "CHANGE_ME" ||
  process.env.JWT_SECRET === "CHANGE_ME"
) {
  console.error("Please replace placeholder env variables");

  process.exit(1);
}

const server = new McpServer({
  name: "proxmox-mcp",
  version: "0.1.0",
});

await discovery.registerTools(server);
await qemu.registerTools(server);
await lxc.registerTools(server);
await storage.registerTools(server);
await nodes.registerTools(server);
await tasks.registerTools(server);

Bun.serve({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  routes: {
    "/mcp": await requireBearer(async (req) => {
      const transport = new WebStandardStreamableHTTPServerTransport({
        enableJsonResponse: true,
      });

      await server.connect(transport);
      return transport.handleRequest(req);
    }),

    ...oauthRoutes,
  },
});
