# Cfx.re Developer Documentation

This directory contains developer documentation for the Cfx.re projects.

## Standard Documentation

* [Building Cfx.re Native codebase](./building.md)
* [Source code layout](./layout.md)

## Custom Build Documentation

This repository includes modifications for local/private server use with increased limits and custom authentication:

* **[Quick Start Guide](./quick-start-guide.md)** - Fast-track setup for building and running the custom build
* **[Custom Modifications Guide](./custom-modifications.md)** - Comprehensive documentation covering:
  - Building FiveM (Windows & Linux)
  - 2048 player limit implementation
  - Increased streaming memory limits
  - Custom authentication system
  - Custom keymaster setup
  - Configuration examples
  - Troubleshooting
* **[Modifications Technical Summary](./MODIFICATIONS.md)** - Detailed technical documentation of all code changes
* **[Example Configurations](./examples/)** - Ready-to-use configuration files and authentication server examples

### Key Modifications

1. **Player Limit:** Increased from 42 to 2048 concurrent players
2. **Streaming Memory:** Increased from 13.5MB to 18MB for better asset loading
3. **Custom Authentication:** Support for local/private authentication systems
4. **Custom Keymaster:** Bypass official keymaster for local deployments

### Quick Links

- 🚀 [Get started quickly](./quick-start-guide.md)
- 📚 [Full documentation](./custom-modifications.md)
- 🔧 [Technical details](./MODIFICATIONS.md)
- 📁 [Configuration examples](./examples/)

### Use Cases

These modifications are designed for:
- Local network testing and development
- Private/whitelisted servers
- Educational purposes
- Non-commercial local deployments

⚠️ **Important:** This custom build is for local/private use only. Not intended for public production servers without proper security review and compliance with licensing terms.