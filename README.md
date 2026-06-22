# proxmox-mcp

A MCP server for Proxmox VE, made with bun and @modelcontextprovider/sdk.

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
- [ ] List VMs
- [ ] Get VM status
- [ ] Get VM config
- [ ] Create VM
- [ ] Start VM
- [ ] Stop VM
- [ ] Shutdown VM
- [ ] Restart VM
- [ ] Suspend/resume VM
- [ ] Migrate VM
- [ ] Clone VM
- [ ] Delete VM

### LXC
- [ ] List containers
- [ ] Get container status
- [ ] Get container config
- [ ] Create container
- [ ] Start container
- [ ] Stop container
- [ ] Shutdown container
- [ ] Restart container
- [ ] Migrate container
- [ ] Clone container
- [ ] Delete container

### Snapshots
- [ ] List snapshots
- [ ] Create snapshot
- [ ] Delete snapshot
- [ ] Rollback snapshot

todo: finish coverage list
