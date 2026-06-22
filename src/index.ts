import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { oauthRoutes, requireBearer } from "./oauth";

// tools
import * as discovery from "./tools/discovery";
import * as qemu from "./tools/qemu";
import * as lxc from "./tools/lxc";

console.log(
  `Starting Proxmox MCP Server on :${process.env.PORT ? parseInt(process.env.PORT) : 3000}`,
);

Bun.serve({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  routes: {
    "/mcp": await requireBearer(async (req) => {
      const transport = new WebStandardStreamableHTTPServerTransport({
        enableJsonResponse: true,
      });

      const server = new McpServer({
        name: "proxmox-mcp",
        version: "0.1.0",
      });

      await discovery.registerTools(server);
      await qemu.registerTools(server);
      await lxc.registerTools(server);

      await server.connect(transport);
      return transport.handleRequest(req);
    }),

    ...oauthRoutes,
  },
});
