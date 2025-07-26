## GitHub Copilot Chat

- Extension Version: 0.28.5 (prod)
- VS Code: vscode/1.101.2
- OS: Windows

## Network

User Settings:
```json
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 20.207.73.85 (135 ms)
- DNS ipv6 Lookup: Error (8 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (0 ms)
- Electron fetch (configured): HTTP 200 (162 ms)
- Node.js https: HTTP 200 (155 ms)
- Node.js fetch: HTTP 200 (397 ms)
- Helix fetch: HTTP 200 (246 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.113.21 (8 ms)
- DNS ipv6 Lookup: Error (6 ms): getaddrinfo ENOTFOUND api.individual.githubcopilot.com
- Proxy URL: None (14 ms)
- Electron fetch (configured): HTTP 200 (823 ms)
- Node.js https: HTTP 200 (898 ms)
- Node.js fetch: HTTP 200 (882 ms)
- Helix fetch: HTTP 200 (872 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).