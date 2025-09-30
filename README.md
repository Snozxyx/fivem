# <img src="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.6/assets/png/1f3ae.png" width="32" height="32"> GGMP - Game Global Multiplayer Platform

**GGMP (Game Global Multiplayer Platform)** - A custom build of Cfx.re (FiveM/RedM) with enhanced capabilities for private and local server deployments.

This repository contains the code for the GGMP platform, built on top of Cfx.re projects:

* [FiveM](https://fivem.net/), a dual-purpose (SP/MP) modification framework for the PC version of Grand Theft Auto V as released by Rockstar Games.
* [RedM](https://redm.gg/), a modification framework for the PC version of Red Dead Redemption 2 as released by Rockstar Games.
* FXServer, the server component for multiplayer services on the Cfx.re projects.

On the multiplayer aspect, the GTA/RAGE modifications differ from other similar modifications by utilizing the embedded game networking frameworks, building a modification framework around them, and expanding the game's functionality on an end-to-end level, directly binding to the RAGE Technology Group's base frameworks and Rockstar North's GTA codebase.

## ⚡ GGMP Custom Features

GGMP includes custom modifications for local/private server use with all premium features unlocked:

### 🚀 Enhanced Capabilities
- **2048 Player Support** - Massive player capacity (increased from 42 player limit)
- **18MB Streaming Memory** - 33% more than default (13.5MB) for better asset loading
- **Custom Authentication** - Complete local/private authentication system support
- **Custom Keymaster** - Bypass official keymaster for local deployments with built-in key generator
- **All Premium Features Unlocked** - No Patreon or subscription requirements
- **Unlimited Resources** - No artificial limitations on server resources
- **Enhanced Clothing & Asset Streaming** - Full support for unlimited custom content

### 📚 Complete Documentation
All modifications are fully documented with examples and guides:

- **[CUSTOM_BUILD.md](CUSTOM_BUILD.md)** - Main documentation index and quick reference
- **[Quick Start Guide](docs/quick-start-guide.md)** - Get started in 15-30 minutes
- **[Complete Guide](docs/custom-modifications.md)** - Comprehensive documentation
- **[Technical Details](docs/MODIFICATIONS.md)** - Code-level modifications
- **[Architecture](docs/ARCHITECTURE.md)** - System architecture and design
- **[Changelog](CHANGELOG_CUSTOM.md)** - Version history and changes
- **[Examples](docs/examples/)** - Ready-to-use configurations and auth servers

### ⚠️ Important Notice

**This custom build is designed for:**
- ✅ Local network testing
- ✅ Private/whitelisted servers
- ✅ Development environments
- ✅ Educational purposes

**NOT recommended for:**
- ❌ Public production servers (without security review)
- ❌ Commercial services (without proper licensing)

## Getting Started

### Quick Start

**For the custom build with modifications:**
```bash
# See the complete quick start guide
cat CUSTOM_BUILD.md
# Or jump straight to: docs/quick-start-guide.md
```

**For official FiveM:**
To play FiveM, simply download the launcher binaries from the [website](https://fivem.net).

To develop FiveM, please follow the documentation in [docs/](https://github.com/citizenfx/fivem/tree/master/docs) in the repository.

### Building Custom Version

**Windows:**
```cmd
git clone https://github.com/Snozxyx/fivem.git -c core.symlinks=true
cd fivem
git submodule update --jobs=16 --init
fxd get-chrome
prebuild
fxd gen -game five
fxd vs -game five
```

**Linux (Server):**
```bash
git clone https://github.com/Snozxyx/fivem.git
cd fivem
git submodule update --init --recursive
cd code
premake5 gmake2 --game=server --cc=clang --dotnet=msnet
cd build/server/linux
make config=release -j$(nproc)
```

## Documentation Structure

```
fivem/
├── CUSTOM_BUILD.md              # Main documentation index
├── CHANGELOG_CUSTOM.md          # Version history
├── README.md                    # This file
└── docs/
    ├── quick-start-guide.md     # Fast-track setup
    ├── custom-modifications.md  # Complete guide
    ├── MODIFICATIONS.md         # Technical details
    ├── ARCHITECTURE.md          # System architecture
    ├── building.md              # Build instructions
    └── examples/
        ├── server.cfg.example   # Server configuration
        ├── auth-server-simple.js # Simple auth server
        ├── auth-server-jwt.js   # JWT auth server
        └── package.json         # Node.js dependencies
```

## Key Modifications

### 1. Player Limit (42 → 2048)
**File:** `code/components/citizen-server-impl/include/Client.h`
```cpp
constexpr auto MAX_CLIENTS = (2048 + 1);
```

### 2. Streaming Memory (13.5MB → 18MB)
**File:** `code/components/gta-streaming-five/src/UnkStuff.cpp`
```cpp
if (size == 0xD00000) {
    size = 0x1200000;  // Increased
}
```

### 3. Custom Authentication
**File:** `code/components/net/src/NetLibrary.cpp`
- Added `OnInterceptConnectionForAuth` event
- Custom token validation support
- Local authentication system hooks

## Example Configuration

```cfg
# server.cfg
sv_hostname "Custom FiveM Server - 2048 Players"
sv_maxclients 256

# OneSync (required for >32 players)
set onesync on
set onesync_enableInfinity 1
set onesync_enableBeyond 1

# Custom authentication
set sv_customAuth "enabled"
set sv_customLicenseKey "your-key"
set sv_authEndpoint "http://localhost:3000/validate"

# Pool sizes
set sv_poolSizesIncrease "{\"entities\": 20000, \"props\": 10000}"
```

## Example Auth Server

```javascript
// Simple authentication server
const express = require('express');
const app = express();
app.use(express.json());

app.post('/validate', (req, res) => {
    const { customAuthToken } = req.body;
    // Validate token and return user info
    res.json({ success: true, userId: "...", username: "..." });
});

app.listen(3000);
```

## Support & Resources

- 📖 **Documentation:** [CUSTOM_BUILD.md](CUSTOM_BUILD.md)
- 🚀 **Quick Start:** [docs/quick-start-guide.md](docs/quick-start-guide.md)
- 🔧 **Examples:** [docs/examples/](docs/examples/)
- 🐛 **Issues:** [GitHub Issues](https://github.com/Snozxyx/fivem/issues)
- 💬 **Community:** [FiveM Forums](https://forum.cfx.re/)

## Contributing

Contributions are welcome! Please:
1. Read the documentation
2. Check existing issues
3. Follow coding standards
4. Update documentation
5. Test thoroughly
6. Submit pull request

## License

FiveM is licensed under a dual license, details of which are in the [code/LICENSE](https://github.com/citizenfx/fivem/blob/master/code/LICENSE) file in the repository.

**Custom Build:** These modifications maintain the same license. Intended for local/private use only.

---

**Need Help?**
- Start with [CUSTOM_BUILD.md](CUSTOM_BUILD.md)
- Check [Quick Start Guide](docs/quick-start-guide.md)
- Review [Troubleshooting](docs/custom-modifications.md#troubleshooting)
- Create an [issue](https://github.com/Snozxyx/fivem/issues)

**Ready to Build?** → [Quick Start Guide](docs/quick-start-guide.md)
