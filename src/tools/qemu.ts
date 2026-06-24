import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { pve } from "../pve";
import { z } from "zod/v4";

export async function registerTools(server: McpServer) {
  server.registerTool(
    "listVMs",
    {
      description: "List all QEMU virtual machines",
      inputSchema: {
        node: z.string().describe("Node to list VMs on"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(await pve(`nodes/${node}/qemu`)),
          },
        ],
      };
    },
  );

  server.registerTool(
    "qemuStatus",
    {
      description: "Get the status of a VM",
      inputSchema: {
        node: z.string().describe("Node the VM is on"),
        vmid: z.string().describe("ID of the VM"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node, vmid }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/qemu/${vmid}/status/current`),
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "qemuConfig",
    {
      description: "Get the configuration of a VM",
      inputSchema: {
        node: z.string().describe("Node the VM is on"),
        vmid: z.string().describe("ID of the VM"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async ({ node, vmid }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/qemu/${vmid}/config`),
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "qemuPowerAction",
    {
      description: "Perform a power action on a VM",
      inputSchema: {
        node: z.string().describe("Node the VM is on"),
        vmid: z.string().describe("ID of the VM"),
        action: z
          .enum([
            "start",
            "stop",
            "reset",
            "reboot",
            "shutdown",
            "suspend",
            "resume",
          ])
          .describe("Power action to perform"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
      },
    },
    async ({ node, vmid, action }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/qemu/${vmid}/status/${action}`, {
                method: "POST",
              }),
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "qemuUpdateConfig",
    {
      description: "Update the configuration of a VM",
      inputSchema: {
        node: z.string().describe("Node the VM is on"),
        vmid: z.string().describe("ID of the VM"),
        // the qemu config object is HUGE so im omitting a lot that the LLM should know from training
        config: z
          .object({
            acpi: z.boolean().optional(),
            affinity: z.string().optional(),
            agent: z
              .string()
              .optional()
              .describe(
                "[enabled=]<1|0> [,freeze-fs=<1|0>] [,fstrim_cloned_disks=<1|0>] [,type=<virtio|isa>]",
              ),
            "allow-ksm": z.boolean().optional(),
            "amd-sev": z
              .string()
              .optional()
              .describe(
                "[type=]<sev-type> [,allow-smt=<1|0>] [,kernel-hashes=<1|0>] [,no-debug=<1|0>] [,no-key-sharing=<1|0>]",
              ),
            audio0: z
              .string()
              .optional()
              .describe(
                "device=<ich9-intel-hda|intel-hda|AC97> [,driver=<spice|none>]",
              ),
            balloon: z.number().int().optional().describe("in MB"),
            bios: z.enum(["seabios", "ovmf"]).optional(),
            boot: z
              .string()
              .optional()
              .describe(
                "[[legacy=]<[acdn]{1,4}>] [,order=<device[;device...]>]",
              ),
            cdrom: z.string().optional(),
            cicustom: z
              .string()
              .optional()
              .describe(
                "[meta=<volume>] [,network=<volume>] [,user=<volume>] [,vendor=<volume>]",
              ),
            cpu: z
              .string()
              .optional()
              .describe(
                "[[cputype=]<string>] [,flags=<+FLAG[;-FLAG...]>] [,guest-phys-bits=<integer>] [,hidden=<1|0>] [,hv-vendor-id=<vendor-id>] [,level=<integer>] [,phys-bits=<8-64|host>] [,reported-model=<enum>]",
              ),
            delete: z
              .string()
              .optional()
              .describe("A list of settings you want to delete."),
            digest: z.string(), // to make sure the llm has read the config
            hugepages: z.enum(["any", "2", "1024"]).optional(),
            machine: z
              .string()
              .optional()
              .describe(
                "[[type=]<machine type>] [,aw-bits=<number>] [,enable-s3=<1|0>] [,enable-s4=<1|0>] [,viommu=<intel|virtio>]",
              ),
            memory: z.number().int().min(16).optional().describe("in MB"),
            ostype: z
              .enum([
                "other",
                "wxp",
                "w2k",
                "w2k3",
                "w2k8",
                "wvista",
                "win7",
                "win8",
                "win10",
                "win11",
                "l24",
                "l26",
                "solaris",
              ])
              .optional(),
            revert: z.string().optional().describe("Revert a pending change"),
            scsihw: z
              .enum([
                "lsi",
                "lsi53c810",
                "virtio-scsi-pci",
                "virtio-scsi-single",
                "megasas",
                "pvscsi",
              ])
              .optional(),
            spice_enhancements: z
              .string()
              .optional()
              .describe(
                "[,foldersharing=<boolean>] [,videostreaming=(off | all | filter)]",
              ),
            startup: z
              .string()
              .optional()
              .describe("[order=]\\d+ [,up=\\d+] [,down=\\d+]"),
            vga: z
              .string()
              .optional()
              .describe(
                " [,clipboard=(vnc)] [,memory=<integer>] [,[type=](cirrus | qxl | qxl2 | qxl3 | qxl4 | none | serial0 | serial1 | serial2 | serial3 | std | virtio | virtio-gl | vmware)]",
              ),
          })
          .loose()
          .describe("Configuration to update the VM with"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
      },
    },
    async ({ node, vmid, config }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await pve(`nodes/${node}/qemu/${vmid}/config`, {
                method: "POST",
                body: JSON.stringify(config),
              }),
            ),
          },
        ],
      };
    },
  );
}
