# proxmox-mcp

A MCP server for Proxmox VE, made with bun and @modelcontextprotocol/sdk. Uses (static) oauth details for authentication.

## PVE API2 Coverage

### Discovery
- [x] Cluster version
- [x] Cluster resources
- [x] Cluster status
- [x] Next/free cluster vmids
- [x] List nodes
- [x] Cluster log
- [x] Cluster tasks

### QEMU
- [x] List VMs
- [x] Get VM status
- [x] Get VM config
- [x] Power actions (start, stop, reset, reboot, shutdown, suspend, resume)
- [ ] Migrate VM
- [ ] Clone VM
- [ ] Delete VM
- [ ] List snapshots
- [ ] Create snapshot
- [ ] Delete snapshot
- [ ] Rollback snapshot

### LXC
- [x] List containers
- [x] Get container status
- [x] Get container config
- [x] Power actions (start, stop, reboot, shutdown, suspend, resume)
- [ ] Migrate container
- [ ] Clone container
- [ ] Delete container
- [ ] List snapshots
- [ ] Create snapshot
- [ ] Delete snapshot
- [ ] Rollback snapshot

### Storage

- [x] List datastores
- [x] Get storage status
- [x] Get storage content
- [x] Get backup prune info
- [ ] Prune backups

### Nodes
- [x] Get node status
- [ ] Reboot/shutdown node
- [x] List APT updates

### Tasks
- [x] Get task status
- [x] Get task log
- [x] Stop task

todo: finish coverage list
