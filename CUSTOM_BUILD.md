# Custom FiveM Build - Documentation Index

Welcome! This is a modified FiveM build designed for local/private server use with increased limits and custom authentication.

## 🎯 What's Different?

This build includes three major enhancements:

1. **2048 Player Support** - Increased from the default 42 player limit
2. **Enhanced Streaming** - 33% more streaming memory for better asset loading
3. **Custom Authentication** - Local/private authentication system for complete control

## 📚 Documentation

### Getting Started

Start here if you're new to this custom build:

- **[Quick Start Guide](docs/quick-start-guide.md)** - Get up and running in 15-30 minutes
  - Prerequisites installation
  - Quick build steps for Windows and Linux
  - Basic server configuration
  - Common troubleshooting

### Complete Documentation

For comprehensive information:

- **[Custom Modifications Guide](docs/custom-modifications.md)** - Full documentation covering:
  - Detailed build instructions for Windows and Linux
  - Understanding the modifications
  - Custom authentication implementation
  - Custom keymaster setup
  - Configuration options
  - Performance tuning
  - Security considerations
  - Troubleshooting

### Technical Reference

For developers and advanced users:

- **[Modifications Technical Summary](docs/MODIFICATIONS.md)** - Detailed technical documentation:
  - Code changes with file locations and line numbers
  - Memory and performance impact analysis
  - Build system integration
  - Testing procedures
  - Compatibility notes

### Examples & Configuration

Ready-to-use examples:

- **[Example Configurations](docs/examples/)** - Includes:
  - `server.cfg.example` - Complete server configuration
  - `auth-server-simple.js` - Simple token-based authentication server
  - `auth-server-jwt.js` - JWT-based authentication server with password hashing
  - `package.json` - Node.js dependencies for auth servers
  - `README.md` - Usage instructions for examples

## 🚀 Quick Start Commands

### Build on Windows

```cmd
git clone https://github.com/Snozxyx/fivem.git -c core.symlinks=true
cd fivem
git submodule update --jobs=16 --init
pip install setuptools
fxd get-chrome
prebuild
fxd gen -game five
fxd vs -game five
```

Then build in Visual Studio (F7).

### Build on Linux (Server)

```bash
git clone https://github.com/Snozxyx/fivem.git
cd fivem
git submodule update --init --recursive
cd code
premake5 gmake2 --game=server --cc=clang --dotnet=msnet
cd build/server/linux
make config=release -j$(nproc)
```

### Run Example Auth Server

```bash
cd docs/examples
npm install
npm run start:simple
```

## 📊 Key Features

### Player Capacity

| Feature | Default | Custom Build |
|---------|---------|--------------|
| Max Players | 42 | 2048 |
| Memory per Client | ~50 KB | ~50 KB |
| Total Client Memory | ~2 MB | ~1 GB |

### Streaming Memory

| Feature | Default | Custom Build |
|---------|---------|--------------|
| Streaming Pool | 13.5 MB | 18 MB |
| Increase | - | +33% |
| More Assets | Standard | Enhanced |

### Authentication

| Feature | Default | Custom Build |
|---------|---------|--------------|
| Auth System | Cfx.re Keymaster | Custom/Local |
| Requires Internet | Yes | No (optional) |
| Local Control | Limited | Complete |

## 🔧 Configuration Examples

### Basic Server Config

```cfg
sv_hostname "My Custom Server - 2048 Players"
sv_maxclients 256

# OneSync (required for >32 players)
set onesync on
set onesync_enableInfinity 1
set onesync_enableBeyond 1

# Custom auth
set sv_customLicenseKey "your-key-here"
set sv_authEndpoint "http://localhost:3000/validate"

# Pool sizes
set sv_poolSizesIncrease "{\"entities\": 20000, \"props\": 10000}"
```

### Simple Auth Server

```javascript
const express = require('express');
const app = express();
app.use(express.json());

const validTokens = new Set(['token1', 'token2', 'token3']);

app.post('/validate', (req, res) => {
    const { customAuthToken } = req.body;
    res.json({ success: validTokens.has(customAuthToken) });
});

app.listen(3000);
```

## 🎓 Learning Path

1. **Complete Beginner?**
   - Start with [Quick Start Guide](docs/quick-start-guide.md)
   - Follow step-by-step instructions
   - Use example configurations

2. **Have Some Experience?**
   - Read [Custom Modifications Guide](docs/custom-modifications.md)
   - Customize authentication system
   - Optimize for your use case

3. **Advanced Developer?**
   - Review [Technical Summary](docs/MODIFICATIONS.md)
   - Understand code modifications
   - Extend or customize further

## 🔐 Security Notice

⚠️ **Important:** This custom build is designed for:

- ✅ Local network testing
- ✅ Private/whitelisted servers
- ✅ Development environments
- ✅ Educational purposes

❌ **NOT recommended for:**

- Public production servers (without security review)
- Commercial services (without proper licensing)
- Servers accessible to untrusted users

**Security Checklist:**
- [ ] Change all default passwords and keys
- [ ] Use HTTPS for authentication endpoints
- [ ] Implement rate limiting
- [ ] Enable logging and monitoring
- [ ] Regular security updates
- [ ] Access control for admin functions

## 🐛 Troubleshooting

### Build Issues

**Problem:** VS Build fails  
**Solution:** Run `prebuild` then `fxd gen -game five` again

**Problem:** Missing DLLs  
**Solution:** Copy from `%LocalAppData%\FiveM\FiveM.app\`

### Runtime Issues

**Problem:** Server crashes with >100 players  
**Solution:** Enable OneSync and increase system limits

**Problem:** Auth not working  
**Solution:** Check auth server is running and endpoint URL is correct

For more solutions, see the [Troubleshooting](docs/custom-modifications.md#troubleshooting) section.

## 📦 What's Included

```
fivem/
├── code/                          # Source code (with modifications)
│   ├── components/
│   │   ├── citizen-server-impl/  # Server implementation (player limit)
│   │   ├── gta-streaming-five/   # Streaming system (memory increase)
│   │   └── net/                  # Networking (custom auth hooks)
│   └── tools/                     # Build tools
├── docs/                          # Documentation
│   ├── quick-start-guide.md      # Quick start guide
│   ├── custom-modifications.md   # Complete documentation
│   ├── MODIFICATIONS.md          # Technical reference
│   └── examples/                 # Example configurations
│       ├── server.cfg.example    # Server config
│       ├── auth-server-simple.js # Simple auth server
│       ├── auth-server-jwt.js    # JWT auth server
│       └── package.json          # Node.js dependencies
└── CUSTOM_BUILD.md               # This file
```

## 🤝 Contributing

Found an issue or have improvements?

1. Check existing issues
2. Create a detailed issue report
3. Submit a pull request with:
   - Clear description
   - Test results
   - Documentation updates

## 📄 License

This custom build is based on Cfx.re (FiveM) project. Please review:

- [code/LICENSE](code/LICENSE) - FiveM license
- Original project: https://github.com/citizenfx/fivem

**Important:** Respect the licensing terms and use responsibly.

## 🔗 Useful Links

### Documentation
- [Quick Start](docs/quick-start-guide.md)
- [Full Guide](docs/custom-modifications.md)
- [Technical Docs](docs/MODIFICATIONS.md)
- [Examples](docs/examples/)

### Resources
- [FiveM Documentation](https://docs.fivem.net/)
- [FiveM Forums](https://forum.cfx.re/)
- [FiveM Native Reference](https://docs.fivem.net/natives/)
- [OneSync Documentation](https://docs.fivem.net/docs/scripting-manual/onesync/)

### Community
- [FiveM Discord](https://discord.gg/fivem)
- [GitHub Issues](https://github.com/Snozxyx/fivem/issues)

## 📝 Version Information

- **Build Version:** Custom 1.0
- **Base FiveM:** master branch
- **Max Players:** 2048
- **Streaming Memory:** 18 MB
- **Custom Auth:** Enabled

## ✨ Features Summary

✅ **Implemented:**
- 2048 concurrent player support
- Increased streaming memory (13.5MB → 18MB)
- Custom authentication system hooks
- Custom keymaster bypass
- Example auth servers (simple & JWT)
- Complete documentation
- Configuration examples
- Troubleshooting guides

✅ **Compatible With:**
- OneSync Infinity
- OneSync Beyond
- txAdmin
- Most existing resources
- Linux and Windows

✅ **Optimized For:**
- Local/private networks
- High player counts
- Large custom maps
- Custom authentication

---

**Ready to get started?** → [Quick Start Guide](docs/quick-start-guide.md)

**Need help?** → [Troubleshooting](docs/custom-modifications.md#troubleshooting)

**Want details?** → [Technical Documentation](docs/MODIFICATIONS.md)

---

*Last Updated: 2024*  
*Repository: https://github.com/Snozxyx/fivem*
