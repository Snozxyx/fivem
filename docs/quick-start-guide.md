# Quick Start Guide - Custom FiveM Build

This is a quick reference guide for building and deploying the customized FiveM with increased player limits and custom authentication.

## 🚀 Quick Start (Windows)

### Prerequisites Installation (5-10 minutes)

1. **Install Visual Studio 2022 Community:**
   - Download: https://visualstudio.microsoft.com/downloads/
   - Required workloads: .NET desktop, Desktop C++, Windows app development
   - Required components: .NET Framework 4.6 targeting pack, Windows 11 SDK

2. **Install Additional Tools:**
   ```powershell
   # Install Chocolatey (package manager)
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   
   # Install required tools
   choco install powershell-core python nodejs yarn msys2 -y
   
   # Refresh environment
   refreshenv
   ```

### Build FiveM (15-30 minutes)

```cmd
:: Clone repository
git clone https://github.com/Snozxyx/fivem.git -c core.symlinks=true
cd fivem

:: Initialize
git submodule update --jobs=16 --init
pip install setuptools

:: Setup build environment
fxd get-chrome
prebuild

:: Generate project
fxd gen -game five
fxd vs -game five

:: Build in Visual Studio (F7 or Build → Build Solution)
```

### Run Your Build

```cmd
cd code\bin\five\debug
FiveM.exe
```

## 🐧 Quick Start (Linux Server)

### Using Docker (Easiest)

```bash
# Clone repository
git clone https://github.com/Snozxyx/fivem.git
cd fivem

# Set environment variables
export CI_BRANCH=master
export CI_COMMIT_REF_NAME=master
export CI_PIPELINE_ID=1
export FIVEM_PRIVATE_URI=https://github.com/your-org/fivem-private.git

# Build
cd code/tools/ci
./build_server_docker_alpine.sh

# Extract and run
tar -xJf fx.tar.xz
cd alpine/opt/cfx-server
./run.sh +exec server.cfg
```

### Manual Build

```bash
# Install dependencies (Alpine)
apk add build-base clang lld python3 git curl lua5.3 lua5.3-dev nodejs yarn

# Clone and setup
git clone https://github.com/Snozxyx/fivem.git
cd fivem
git submodule update --init --recursive

# Build
cd code
premake5 gmake2 --game=server --cc=clang --dotnet=msnet
cd build/server/linux
make config=release -j$(nproc)
```

## 📝 Basic Server Configuration

Create `server.cfg`:

```cfg
# Basic Settings
sv_hostname "My Custom FiveM Server"
sv_maxclients 2048

# Game Settings
gamemode multimode
map spawnpoint

# Resources
ensure mapmanager
ensure chat
ensure spawnmanager
ensure sessionmanager
ensure basic-gamemode
ensure hardcap

# OneSync (Required for >32 players)
set onesync on
set onesync_enableInfinity 1
set onesync_enableBeyond 1

# Custom Settings
set sv_customLicenseKey "your-generated-key"
set sv_poolSizesIncrease "{\"entities\": 10000}"

# Network
endpoint_add_tcp "0.0.0.0:30120"
endpoint_add_udp "0.0.0.0:30120"
```

## 🔑 Custom Authentication Setup

### Option 1: Simple Token File

1. **Generate token:**
   ```bash
   # Linux/Mac
   openssl rand -hex 32 > server_token.txt
   
   # Windows PowerShell
   [Convert]::ToBase64String((1..32|%{Get-Random -Max 256})) > server_token.txt
   ```

2. **Configure server.cfg:**
   ```cfg
   set sv_customLicenseKey "$(cat server_token.txt)"
   ```

### Option 2: Custom Auth Server

1. **Create simple auth server (Node.js):**
   ```javascript
   // auth-server.js
   const express = require('express');
   const app = express();
   app.use(express.json());
   
   const VALID_TOKENS = new Set(['token1', 'token2', 'token3']);
   
   app.post('/validate', (req, res) => {
       const { customAuthToken } = req.body;
       res.json({ success: VALID_TOKENS.has(customAuthToken) });
   });
   
   app.listen(3000);
   ```

2. **Run auth server:**
   ```bash
   npm install express
   node auth-server.js
   ```

3. **Configure server.cfg:**
   ```cfg
   set sv_customAuth "enabled"
   set sv_authEndpoint "http://localhost:3000/validate"
   ```

## 🔧 Key Modifications in This Build

### 1. Player Limit: 42 → 2048
**File:** `code/components/citizen-server-impl/include/Client.h`
```cpp
constexpr auto MAX_CLIENTS = (2048 + 1);
```

### 2. Streaming Memory: 13.5MB → 18MB
**File:** `code/components/gta-streaming-five/src/UnkStuff.cpp`
```cpp
if (size == 0xD00000)
{
    size = 0x1200000;  // Increased
}
```

### 3. Custom Authentication Hooks
**File:** `code/components/net/src/NetLibrary.cpp`
- Custom auth endpoints
- Token validation
- Keymaster bypass

## ⚡ Performance Tips

### For High Player Counts (>100 players)

1. **Enable OneSync Infinity:**
   ```cfg
   set onesync on
   set onesync_enableInfinity 1
   set onesync_enableBeyond 1
   ```

2. **Increase System Limits (Linux):**
   ```bash
   # File descriptors
   ulimit -n 65536
   
   # Memory map areas
   sysctl -w vm.max_map_count=262144
   ```

3. **Optimize Pool Sizes:**
   ```cfg
   set sv_poolSizesIncrease "{
     \"entities\": 20000,
     \"props\": 10000,
     \"vehicles\": 5000,
     \"peds\": 5000,
     \"pickups\": 5000
   }"
   ```

4. **Server Hardware:**
   - Minimum: 8GB RAM, 4 cores
   - Recommended: 16GB+ RAM, 8+ cores
   - Network: 100Mbps+ dedicated

## 🐛 Common Issues & Fixes

### Build Fails

```cmd
:: Clean and rebuild
cd code\build\five\debug
del /s /q *
cd ..\..\..
fxd gen -game five
fxd vs -game five
```

### Missing DLLs

```cmd
:: Copy from main FiveM installation
xcopy "%LocalAppData%\FiveM\FiveM.app\*" "code\bin\five\debug\" /E /I /Y
```

### Server Crashes

```cfg
# Add to server.cfg
set sv_debugLog "true"
set sv_trace "true"

# Check logs
tail -f FXServer.log
```

### Authentication Fails

1. Check auth server is running: `curl http://localhost:3000/validate`
2. Verify token in server.cfg
3. Check firewall rules
4. Enable debug logging

## 📚 Next Steps

- Read full documentation: [custom-modifications.md](custom-modifications.md)
- Check build documentation: [building.md](building.md)
- Join community: https://forum.cfx.re/
- Report issues: https://github.com/Snozxyx/fivem/issues

## 🔒 Security Warning

⚠️ **This build is for local/private use only!**

- Do NOT expose to public internet without proper security
- Keep server keys and tokens secret
- Use HTTPS for auth endpoints
- Implement rate limiting
- Regular security updates

## 📞 Support

Having issues? Try:

1. Check [Troubleshooting](custom-modifications.md#troubleshooting)
2. Search existing issues
3. Create new issue with:
   - Build logs
   - Error messages
   - Server configuration
   - Steps to reproduce

## 🎯 Success Checklist

- [ ] All prerequisites installed
- [ ] Repository cloned with submodules
- [ ] Client builds successfully
- [ ] Server builds successfully
- [ ] Server starts with custom config
- [ ] Can connect to server
- [ ] OneSync enabled for >32 players
- [ ] Custom auth working (if enabled)
- [ ] Resources loading correctly
- [ ] Performance acceptable

---

**Happy building!** 🎉

For detailed information, see [custom-modifications.md](custom-modifications.md)
