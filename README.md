# proxmox-mcp

A MCP server for Proxmox VE, made with bun and @modelcontextprotocol/sdk. Uses (static) oauth details for authentication.

## Setup
1. Clone the repository
2. Install dependencies with `bun install`
3. Copy `.env.example` to `.env` and fill in all values
4. Run the server with `bun .`
5. Add http://localhost:3000/mcp (replace base url if applicable) to the AI of your choice (example configurations below), along with the oauth client id and secret.
6. The AI should now be able to make requests to the MCP server.

### Example: Opencode
Add the mcp to your opencode config, and run `opencode mcp auth proxmox-mcp` to log in. \
Example opencode config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "proxmox-mcp": {
      "type": "remote",
      "url": "http://localhost:3000/mcp",
      "enabled": true,
      "oauth": {
        "clientId": "CHANGE_ME",
        "clientSecret": "CHANGE_ME"
      }
    }
  }
}
```

### Example: Claude (web)
1. Navigate to https://claude.ai/customize/connectors?modal=add-custom-connector
2. Set a name for the connector and paste the mcp url (base url + /mcp)
3. Expand advanced options and enter the oauth client id and client secret

## Features

### Discovery
- [x] Cluster version
- [x] Cluster resources
- [x] Cluster status
- [x] Next/free cluster vmid
- [x] List nodes
- [x] Cluster log
- [x] Cluster tasks

### QEMU
- [x] List VMs
- [x] Get VM status
- [x] Get VM config
- [x] Update VM config
- [x] Power actions (start, stop, reset, reboot, shutdown, suspend, resume)
- [ ] Migrate VM
- [ ] Clone VM
- [ ] List snapshots
- [ ] Create snapshot
- [ ] Rollback snapshot

Guest agent:
- [x] Command execution
- [x] Get network interfaces
- [x] Get OS info

### LXC
- [x] List containers
- [x] Get container status
- [x] Get container config
- [x] Update container config
- [x] Power actions (start, stop, reboot, shutdown, suspend, resume)
- [ ] Migrate container
- [ ] Clone container
- [ ] List snapshots
- [ ] Create snapshot
- [ ] Rollback snapshot

### Storage

- [x] List datastores
- [x] Get storage status
- [x] Get storage content
- [x] Get backup prune info

### Nodes
- [x] Get node status
- [x] Reboot node
- [x] List APT updates

### Tasks
- [x] Get task status
- [x] Get task log
- [x] Stop task

todo: finish list
