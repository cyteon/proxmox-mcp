# proxmox-mcp

A MCP server for Proxmox VE, made with bun and @modelcontextprovider/sdk. Uses (static) oauth details for authentication.

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
- [ ] Power actions
- [ ] Suspend/resume VM
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
- [ ] Power actions
- [ ] Migrate container
- [ ] Clone container
- [ ] Delete container
- [ ] List snapshots
- [ ] Create snapshot
- [ ] Delete snapshot
- [ ] Rollback snapshot

### Storage
These are on a node level

- [x] List datastores
- [x] Get storage status
- [x] Get storage content
- [x] Get backup prune info
- [ ] Prune backups

### Nodes
- [x] Get node status
- [ ] Reboot/shutdown node
- [x] List APT updates

todo: finish coverage list
