import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { pve } from "../pve";
import { z } from "zod/v4";

export async function registerTools(server: McpServer) {
  server.registerTool(
    "getTaskStatus",
    {
      description: "Get the status of a task",
      inputSchema: {
        node: z.string().describe("Node the task is on"),
        upid: z.string().describe("UPID of the task"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node, upid }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/tasks/${upid}/status`),
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "getTaskLog",
    {
      description: "Get the log for a task",
      inputSchema: {
        node: z.string().describe("Node the task is on"),
        upid: z.string().describe("UPID of the task"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node, upid }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(await pve(`nodes/${node}/tasks/${upid}/log`)),
          },
        ],
      };
    },
  );

  server.registerTool(
    "stopTask",
    {
      description: "Stop a running task",
      inputSchema: {
        node: z.string().describe("Node the task is on"),
        upid: z.string().describe("UPID of the task"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
      },
    },
    async ({ node, upid }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/tasks/${upid}/stop`, { method: "POST" }),
            ),
          },
        ],
      };
    },
  );
}
