# Custom FiveM Build Documentation

This document provides comprehensive instructions for building a customized version of FiveM with the following modifications:
- Increased player limit (from 42 to 2048)
- Increased streaming memory limits
- Custom authentication system
- Custom keymaster implementation for local/private use

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Building FiveM](#building-fivem)
3. [Understanding the Modifications](#understanding-the-modifications)
4. [Custom Authentication System](#custom-authentication-system)
5. [Custom Keymaster Setup](#custom-keymaster-setup)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Windows Build Requirements

To build FiveM on Windows, you need:

- **Visual Studio 2022** (Community edition or higher) with:
  - Workloads:
    - .NET desktop development
    - Desktop development with C++
    - Windows application development
  - Individual components:
    - .NET Framework 4.6 targeting pack
    - Windows 11 SDK (10.0.22000.0)
    
  Install via: Tools → Get Tools and Features → Check required workloads → Click "Modify"

- **PowerShell 7** or higher ([Download](https://aka.ms/powershell-release?tag=stable))
- **Python 3.8+** with the `py` launcher ([Download](https://python.org/))
- **MSYS2** installed at `C:\msys64\` ([Download](https://www.msys2.org/))
- **Node.js** and **Yarn** in your PATH ([Node.js](https://nodejs.org/), [Yarn](https://classic.yarnpkg.com/en/docs/install/))

### Linux Build Requirements (Server)

For building the FiveM server on Linux:

- Docker or a compatible Linux environment (Alpine Linux is used in CI)
- Python 3.8+ with setuptools
- GCC/Clang compiler toolchain
- premake5 build system
- Git with submodule support

## Building FiveM

### Windows Client Build

1. **Clone the repository with symlink support:**
   ```cmd
   git clone https://github.com/Snozxyx/fivem.git -c core.symlinks=true
   cd fivem
   ```

2. **Initialize submodules:**
   ```cmd
   git submodule update --jobs=16 --init
   ```

3. **Install Python dependencies (if using Python 3.12+):**
   ```cmd
   pip install setuptools
   ```

4. **Download Chrome for CEF (64-bit projects):**
   ```cmd
   fxd get-chrome
   ```

5. **Build game natives bindings:**
   ```cmd
   prebuild
   ```

6. **Generate project files:**
   ```cmd
   fxd gen -game five
   ```

7. **Open Visual Studio solution:**
   ```cmd
   fxd vs -game five
   ```

8. **Build the solution in Visual Studio:**
   - Select Debug or Release configuration
   - Build → Build Solution (or press F7)

9. **Set up data files:**
   - After building, files like `code/bin/five/debug/v8.dll` will be created automatically
   - Optionally, symlink the game-storage directory to save disk space (see [Symlink game-storage](#symlink-game-storage))

### Linux Server Build

#### Using Docker (Recommended)

1. **Navigate to the build directory:**
   ```bash
   cd code/tools/ci
   ```

2. **Set required environment variables:**
   ```bash
   export CI_BRANCH=master
   export CI_COMMIT_REF_NAME=master
   export CI_PIPELINE_ID=1
   export FIVEM_PRIVATE_URI=https://github.com/your-org/fivem-private.git
   ```

3. **Run the build script:**
   ```bash
   ./build_server_docker_alpine.sh
   ```

4. **Output:** The built server will be packaged in `fx.tar.xz`

#### Manual Linux Build

1. **Install build dependencies:**
   ```bash
   # On Alpine Linux
   apk add build-base clang lld python3 git curl lua5.3 lua5.3-dev
   ```

2. **Build natives:**
   ```bash
   cd ext/natives
   gcc -O2 -shared -fpic -o cfx.so -I/usr/include/lua5.3/ lua_cfx.c
   ```

3. **Generate project files:**
   ```bash
   cd code
   premake5 gmake2 --game=server --cc=clang --dotnet=msnet
   ```

4. **Build:**
   ```bash
   cd build/server/linux
   make config=release -j$(nproc)
   ```

### Symlink game-storage

To save disk space, symlink the game-storage directory:

1. Navigate to `code\bin\five\debug`
2. Create a `data` directory if it doesn't exist
3. Delete existing `game-storage` folder if present
4. Open PowerShell (Shift + Right-click → Open PowerShell window here) in `code\bin\five\debug\data`
5. Run:
   ```powershell
   cmd
   mklink /d game-storage "%localappdata%\FiveM\FiveM.app\data\game-storage"
   ```

## Understanding the Modifications

This FiveM build includes several key modifications for local/private server use:

### 1. Increased Player Limit (42 → 2048)

**Location:** `code/components/citizen-server-impl/include/Client.h`

**Original:**
```cpp
constexpr auto MAX_CLIENTS = 42;
```

**Modified:**
```cpp
constexpr auto MAX_CLIENTS = (2048 + 1);
```

**Impact:**
- Server can now handle up to 2048 concurrent players
- Memory allocation for client pools increased proportionally
- Network buffers and state tracking arrays sized accordingly

**Related Files:**
- `code/components/citizen-server-impl/src/Client.cpp` - Client pool size
- `code/components/citizen-server-impl/include/state/ServerGameState.h` - State bitsets
- `code/components/citizen-server-impl/src/GameServerNet.ENet.cpp` - Network host configuration

### 2. Increased Streaming Memory Limits

**Location:** `code/components/gta-streaming-five/src/UnkStuff.cpp`

**Modification:**
```cpp
static void* SMPACreateStub(void* a1, void* a2, size_t size, void* a4, bool a5)
{
    if (size == 0xD00000)  // Original: 13.5 MB
    {
        // free original allocation
        rage::GetAllocator()->Free(a2);

        size = 0x1200000;  // Increased to: 18 MB
        a2 = rage::GetAllocator()->Allocate(size, 16, 0);
    }

    return g_origSMPACreate(a1, a2, size, a4, a5);
}
```

**Impact:**
- Streaming memory pool increased from ~13.5 MB to 18 MB
- Allows loading more assets/entities simultaneously
- Better support for large maps and custom resources

**Additional Streaming Modifications:**

The codebase also includes various streaming limit patches:
- Entity level cap defaults to `PRI_OPTIONAL_LOW` instead of `PRI_OPTIONAL_MEDIUM`
- Low-priority objects no longer disabled when LOD distance < 20%
- Increased BVH traversal list size for multi-node operations

### 3. Removed Player Limit from UI

**Location:** `code/components/nui-gsclient/src/ServerList.cpp`

The server browser displays up to the configured `sv_maxclients` value without artificial 42-player UI limitations.

## Custom Authentication System

FiveM's default authentication system relies on Cfx.re's keymaster and license system. For local/private use, you can implement a custom authentication system.

### Architecture Overview

The authentication flow involves:

1. **Client Connection Request** → Server
2. **Server Validation** → Custom Auth Backend
3. **Token Generation** → Returned to Client
4. **Client Authorization** → Connection Established

### Implementation Steps

#### 1. Bypass Policy Live Endpoint

**Location:** `code/components/net/src/NetLibrary.cpp`

The default implementation uses:
```cpp
#ifndef POLICY_LIVE_ENDPOINT
#define POLICY_LIVE_ENDPOINT "https://policy-live.fivem.net/"
#endif
```

**For Custom Auth:**
1. Create a local file `code/components/net/include/CustomPolicy.h`:

```cpp
#pragma once
#define POLICY_LIVE_ENDPOINT "https://your-custom-auth-server.local/"
```

2. Include this in `NetLibrary.cpp` before the default definition:
```cpp
#include "StdInc.h"
#include "CustomPolicy.h"  // Add this line
#include "NetLibrary.h"
// ... rest of includes
```

#### 2. Implement Custom Auth Handler

**Location:** `code/components/net/src/NetLibrary.cpp`

Find the `OnInterceptConnectionForAuth` event handler (around line 1400-1500):

```cpp
if (OnInterceptConnectionForAuth(url, licenseKeyToken, [this, continueRequest](bool success, const std::map<std::string, std::string>& additionalPostData)
{
    // Custom auth logic here
}))
{
    return;
}
```

**Custom Implementation:**

Create a custom auth component:

```cpp
// In a new file: code/components/citizen-server-impl/src/CustomAuth.cpp

#include <StdInc.h>
#include <ServerInstanceBase.h>

namespace fx
{
    class CustomAuthHandler
    {
    public:
        static void Initialize(fx::ServerInstanceBase* instance)
        {
            // Register custom auth handler
            NetLibrary* netLibrary = instance->GetComponent<NetLibrary>().GetRef();
            
            netLibrary->OnInterceptConnectionForAuth.Connect([](
                const std::string& url,
                const std::string& token,
                const std::function<void(bool, const std::map<std::string, std::string>&)>& callback)
            {
                // Custom validation logic
                bool isValid = ValidateCustomToken(token);
                
                std::map<std::string, std::string> additionalData;
                if (isValid)
                {
                    additionalData["customAuth"] = "validated";
                    additionalData["userId"] = ExtractUserIdFromToken(token);
                }
                
                callback(isValid, additionalData);
                return true; // Handled by custom auth
            });
        }
        
    private:
        static bool ValidateCustomToken(const std::string& token)
        {
            // Implement your custom token validation
            // Example: JWT validation, database lookup, etc.
            return !token.empty(); // Simplified example
        }
        
        static std::string ExtractUserIdFromToken(const std::string& token)
        {
            // Extract user ID from custom token
            return "user_" + token.substr(0, 8);
        }
    };
}

static InitFunction initFunction([]()
{
    fx::ServerInstanceBase::OnServerCreate.Connect([](fx::ServerInstanceBase* instance)
    {
        fx::CustomAuthHandler::Initialize(instance);
    });
});
```

#### 3. Server-Side Configuration

Add to your `server.cfg`:

```cfg
# Custom Authentication Settings
set sv_licenseKey "your-custom-server-key"
set sv_customAuth "enabled"
set sv_authEndpoint "https://your-auth-server.local/validate"

# Disable default Cfx.re authentication (for local use only)
set sv_enforceGameBuild ""
```

#### 4. Client-Side Token Provider

For the client to provide custom auth tokens, modify the connection flow:

**Location:** `code/components/net/src/NetLibrary.cpp` (ConnectToServer method)

Add custom token to postMap:
```cpp
// Around line 1200
postMap["guid"] = va("%lld", GetGUID());

// Add custom auth token
postMap["customAuthToken"] = GetCustomAuthToken(); // Implement this function
```

Implement token retrieval:
```cpp
static std::string GetCustomAuthToken()
{
    // Load from local config, environment variable, or file
    std::string token;
    
    // Example: Read from file
    std::ifstream tokenFile("auth_token.txt");
    if (tokenFile.is_open())
    {
        std::getline(tokenFile, token);
        tokenFile.close();
    }
    
    return token;
}
```

### Custom Auth Server Example

A simple Node.js auth server example:

```javascript
// custom-auth-server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const SECRET_KEY = 'your-secret-key-change-this';

app.use(express.json());

// Token validation endpoint
app.post('/validate', (req, res) => {
    const { customAuthToken } = req.body;
    
    try {
        const decoded = jwt.verify(customAuthToken, SECRET_KEY);
        
        res.json({
            success: true,
            userId: decoded.userId,
            username: decoded.username
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
});

// Token generation endpoint (for testing)
app.post('/generate-token', (req, res) => {
    const { userId, username } = req.body;
    
    const token = jwt.sign(
        { userId, username },
        SECRET_KEY,
        { expiresIn: '24h' }
    );
    
    res.json({ token });
});

app.listen(3000, () => {
    console.log('Custom auth server running on port 3000');
});
```

## Custom Keymaster Setup

For local/private server use, you can create your own keymaster replacement.

### Why Custom Keymaster?

The official Cfx.re keymaster:
- Requires online registration
- Tied to Cfx.re services
- Has restrictions on commercial use

A custom keymaster allows:
- Fully offline/local operation
- No external dependencies
- Complete control over server keys

### Implementation

#### 1. Generate Server Keys Locally

Create a key generation utility:

```cpp
// code/tools/keygen/main.cpp
#include <iostream>
#include <fstream>
#include <random>
#include <iomanip>
#include <sstream>

std::string generateRandomKey(size_t length = 32)
{
    const char charset[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, sizeof(charset) - 2);
    
    std::string key;
    for (size_t i = 0; i < length; ++i)
    {
        key += charset[dis(gen)];
    }
    return key;
}

int main()
{
    std::string serverKey = generateRandomKey(64);
    
    std::cout << "Generated Server Key: " << serverKey << std::endl;
    
    // Save to file
    std::ofstream keyFile("server_key.txt");
    keyFile << serverKey;
    keyFile.close();
    
    std::cout << "Key saved to server_key.txt" << std::endl;
    
    return 0;
}
```

Build and run:
```bash
g++ -o keygen main.cpp
./keygen
```

#### 2. Bypass Keymaster Validation

**Location:** Server initialization code

Create a custom validation component:

```cpp
// code/components/citizen-server-impl/src/CustomKeymaster.cpp
#include <StdInc.h>
#include <ServerInstanceBase.h>

namespace fx
{
    class CustomKeymasterValidator
    {
    public:
        static void Initialize()
        {
            // Override default keymaster validation
            static ConVar<std::string> customServerKey(
                "sv_customLicenseKey",
                ConVar_None,
                "",
                &customServerKey
            );
            
            // Hook server start to validate custom key
            fx::ServerInstanceBase::OnServerCreate.Connect([](fx::ServerInstanceBase* instance)
            {
                std::string key = customServerKey.GetValue();
                
                if (key.empty())
                {
                    console::Printf("^3Warning: No custom license key set. Set sv_customLicenseKey in server.cfg^7\n");
                    // For local use, we'll allow it anyway
                }
                else
                {
                    console::Printf("^2Using custom license key: %s...^7\n", key.substr(0, 8).c_str());
                }
                
                // Mark as validated
                instance->SetComponent(new CustomKeymasterComponent(key));
            });
        }
    };
    
    class CustomKeymasterComponent : public fwRefCountable, public IAttached<ServerInstanceBase>
    {
    private:
        std::string m_key;
        
    public:
        CustomKeymasterComponent(const std::string& key) : m_key(key) {}
        
        bool IsValid() const { return !m_key.empty(); }
        const std::string& GetKey() const { return m_key; }
    };
}

static InitFunction initFunction([]()
{
    fx::CustomKeymasterValidator::Initialize();
});
```

#### 3. Server Configuration

Add to `server.cfg`:

```cfg
# Custom Keymaster Configuration
set sv_customLicenseKey "your-generated-key-here"

# Set to 'local' mode to bypass online checks
set sv_master1 ""
set sv_master2 ""
set sv_master3 ""

# For completely offline operation
set sv_disableClientConsole false
set sv_enableNetworkedPhysics true
```

#### 4. Disable External Keymaster Checks

**Location:** `code/components/citizen-server-impl/src/ServerInstance.cpp`

Find the keymaster validation code and wrap it:

```cpp
#ifndef CUSTOM_KEYMASTER
    // Original keymaster validation code
#else
    // Skip external validation for custom keymaster
    console::Printf("Using custom keymaster - skipping external validation\n");
    isValidated = true;
#endif
```

Add to your build configuration:
```cpp
// In premake5.lua or build config
defines { "CUSTOM_KEYMASTER" }
```

## Configuration

### Server Configuration Example

Complete `server.cfg` for custom build:

```cfg
# Server Identity
sv_hostname "Custom FiveM Server - 2048 Players"
sv_maxclients 2048
sv_master1 ""

# Custom Authentication
set sv_customAuth "enabled"
set sv_customLicenseKey "your-custom-server-key-here"
set sv_authEndpoint "https://your-auth-server.local/validate"

# Game Settings
set sv_enforceGameBuild ""
set sv_pureLevel 0

# Network Settings
sv_endpointprivacy true
set sv_enableNetworkedPhysics true

# Resource Settings
set sv_poolSizesIncrease "{\"entities\": 10000, \"props\": 5000}"

# OneSync Settings (required for >32 players)
set onesync on
set onesync_enableInfinity 1
set onesync_enableBeyond 1

# Other Settings
set steam_webApiKey "none"
set sv_licenseKeyToken "none"
```

### Client Configuration

For connecting to custom auth servers, clients may need:

**Location:** `FiveM Application Data/citizen/auth_token.txt`

```
your-client-auth-token-here
```

Or use environment variable:
```cmd
set FIVEM_AUTH_TOKEN=your-client-auth-token-here
FiveM.exe
```

## Troubleshooting

### Build Issues

#### Issue: Error CS0234 - Missing 'API' in namespace

**Solution:** 
```cmd
# Close Visual Studio
prebuild
fxd gen -game five
# Reopen Visual Studio and rebuild
```

#### Issue: Windows error code 126/127

**Solution:**
- Add antivirus exclusion for the repository
- Ensure all required DLLs are present in output directory
- Rebuild from scratch

#### Issue: Missing citizen/ui directory

**Solution:**
Copy from main FiveM installation:
```cmd
xcopy "%LocalAppData%\FiveM\FiveM.app\citizen\ui" "code\bin\five\debug\citizen\ui" /E /I
```

### Runtime Issues

#### Issue: Server crashes with >100 players

**Possible causes:**
- OneSync not enabled
- Insufficient memory allocation
- Network bandwidth limits

**Solution:**
1. Enable OneSync in server.cfg:
   ```cfg
   set onesync on
   set onesync_enableInfinity 1
   ```

2. Increase system limits (Linux):
   ```bash
   ulimit -n 65536
   ```

3. Monitor with:
   ```bash
   txadmin  # Or use custom monitoring
   ```

#### Issue: Custom authentication not working

**Debug steps:**
1. Enable debug logging:
   ```cpp
   #define DEBUG_AUTH 1
   ```

2. Check logs:
   ```bash
   tail -f FXServer.log | grep -i auth
   ```

3. Verify auth server is reachable:
   ```bash
   curl -X POST https://your-auth-server.local/validate \
     -H "Content-Type: application/json" \
     -d '{"customAuthToken": "test"}'
   ```

#### Issue: Streaming limits still hit

**Solution:**
Increase pool sizes in server.cfg:
```cfg
set sv_poolSizesIncrease "{
  \"entities\": 20000,
  \"props\": 10000,
  \"vehicles\": 5000,
  \"peds\": 5000
}"
```

### Memory Issues

If experiencing memory issues with 2048 players:

1. **Increase system limits:**
   ```bash
   # Linux
   sysctl -w vm.max_map_count=262144
   ```

2. **Monitor memory usage:**
   ```bash
   # In FiveM console
   memdbg
   ```

3. **Optimize resources:**
   - Use server-side only where possible
   - Implement proper cleanup in resources
   - Use entity culling/streaming

## Security Considerations

### Important Notes for Local/Private Use

This custom build is designed for:
- Local network testing
- Private/whitelisted servers
- Development environments
- Non-commercial use

**Do NOT use for:**
- Public production servers without proper security review
- Commercial services without appropriate licensing
- Servers accessible to untrusted clients

### Security Checklist

- [ ] Custom authentication properly validates all inputs
- [ ] Server key kept secret and not committed to version control
- [ ] Network endpoints secured with HTTPS/TLS
- [ ] Rate limiting implemented on auth endpoints
- [ ] Player limits enforced at network layer
- [ ] Resource access controls in place
- [ ] Regular security updates applied

## Additional Resources

### Build System

- **Premake5 Documentation:** https://premake.github.io/
- **FiveM Native Reference:** https://docs.fivem.net/natives/

### Development Tools

- **Visual Studio:** https://visualstudio.microsoft.com/
- **PowerShell 7:** https://github.com/PowerShell/PowerShell
- **MSYS2:** https://www.msys2.org/

### Community Resources

- **FiveM Forums:** https://forum.cfx.re/
- **FiveM Discord:** https://discord.gg/fivem
- **Native Reference:** https://runtime.fivem.net/doc/natives/

## License

This modified build is based on the Cfx.re (FiveM) project. Please review:
- `code/LICENSE` - FiveM dual license
- Original project: https://github.com/citizenfx/fivem

## Contributing

For issues or improvements to this documentation:
1. Create an issue on the repository
2. Submit a pull request with detailed changes
3. Update this documentation with any new discoveries

## Changelog

### Current Version
- Increased MAX_CLIENTS from 42 to 2048
- Increased streaming memory from 0xD00000 to 0x1200000
- Added custom authentication system support
- Added custom keymaster implementation
- Complete build documentation

---

**Last Updated:** 2024
**Repository:** https://github.com/Snozxyx/fivem
