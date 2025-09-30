# GGMP Admin Panel - Features & UI

## Dark Theme Design

The admin panel features a modern dark theme with the following color palette:

- **Primary Green**: `#10b981` - GGMP brand color
- **Secondary Blue**: `#3b82f6` - Accent color
- **Background Dark**: `#020617` - Main background
- **Card Dark**: `#0f172a` - Card/panel background
- **Light Accent**: `#1e293b` - Hover states

## Screenshots (Visual Representation)

### 1. Login Page

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                        GGMP                            │
│                   Admin Panel                          │
│          Game Global Multiplayer Platform              │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │                                               │    │
│  │  Username: [_________________]                │    │
│  │                                               │    │
│  │  Password: [_________________]                │    │
│  │                                               │    │
│  │           [   Sign in   ]                     │    │
│  │                                               │    │
│  │     Default credentials: admin / admin        │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2. Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│ GGMP | Dashboard | Tokens | Servers | Settings    admin [Logout]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Dashboard                                                     │
│  GGMP Services Overview                                        │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ TOTAL    │  │ ACTIVE   │  │ TOTAL    │  │ UPTIME   │     │
│  │ SERVERS  │  │ KEYS     │  │ PLAYERS  │  │          │     │
│  │    0     │  │    0     │  │    0     │  │ 24h 15m  │     │
│  │    🖥️   │  │    🔑    │  │    👥    │  │    ⏱️   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Services Status                                         │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ ● Keymaster          Port 3001              Online     │ │
│  │ ● Nucleus            Port 3003              Online     │ │
│  │ ● Policy             Port 3002              Online     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Quick Actions                                           │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ [Generate New Token] [View All Servers] [View Logs]    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 3. Token Management

```
┌────────────────────────────────────────────────────────────────┐
│ GGMP | Dashboard | Tokens | Servers | Settings    admin [Logout]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Token Management                    [+ Generate New Token]   │
│  Manage GGMP license keys                                      │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Token Key            Server    Max     Usage  Created   │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ GGMP-1234-5678...   Server1   2048      5    Jan 1     │ │
│  │ GGMP-ABCD-EFGH...   Server2   2048      12   Jan 2     │ │
│  │ GGMP-9876-5432...   Test      256       0    Jan 3     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 4. Server List

```
┌────────────────────────────────────────────────────────────────┐
│ GGMP | Dashboard | Tokens | Servers | Settings    admin [Logout]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Server List                                                   │
│  Registered GGMP servers                                       │
│                                                                │
│  ┌────────────────────────┐  ┌────────────────────────┐      │
│  │ GGMP Community Server │  │ Private Roleplay      │      │
│  │ abc123.ggmp.local     │  │ def456.ggmp.local     │      │
│  │                       │  │                       │      │
│  │ Players: 128 / 2048   │  │ Players: 64 / 256     │      │
│  │ Server ID: abc123...  │  │ Server ID: def456...  │      │
│  │                       │  │                       │      │
│  │ ● Online              │  │ ● Online              │      │
│  │ Last seen: 2 min ago  │  │ Last seen: 1 min ago  │      │
│  └────────────────────────┘  └────────────────────────┘      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 5. Settings

```
┌────────────────────────────────────────────────────────────────┐
│ GGMP | Dashboard | Tokens | Servers | Settings    admin [Logout]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Settings                                                      │
│  Configure GGMP platform settings                              │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ General Settings                                        │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ Maximum Players:  [2048___________]                     │ │
│  │ Maximum allowed players per server                      │ │
│  │                                                         │ │
│  │ Streaming Memory: [18MB___________]                     │ │
│  │ Memory allocated for asset streaming                    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Security Settings                                       │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ [✓] Allow Offline Mode                                  │ │
│  │     Servers can operate without internet               │ │
│  │                                                         │ │
│  │ [ ] Require Keymaster Validation                       │ │
│  │     All servers must have valid license keys           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                                │
│  [Save Settings]  ✓ Settings saved successfully               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Feature List

### Dashboard
✅ Real-time service status monitoring
✅ Statistics cards (servers, keys, players, uptime)
✅ Service health indicators
✅ Quick action buttons
✅ Auto-refresh capability

### Token Management
✅ Generate new GGMP license keys
✅ View all registered tokens in table
✅ Token usage tracking
✅ Revoke tokens
✅ Export token list
✅ Modal for creating tokens
✅ Auto-generated key format

### Server List
✅ View all registered servers
✅ Real-time player counts
✅ Server status indicators
✅ Last seen timestamps
✅ Server details (ID, host, players)
✅ Grid layout for easy viewing
✅ Auto-refresh every 10 seconds

### Settings
✅ Configure maximum players
✅ Set streaming memory limits
✅ Toggle offline mode
✅ Toggle keymaster requirement
✅ Auto-refresh settings
✅ Save/load from localStorage
✅ Success notifications

### Authentication
✅ Login page with form validation
✅ JWT token storage
✅ Session management
✅ Logout functionality
✅ Protected routes
✅ Default admin credentials

## Dark Theme Implementation

### CSS Classes

```css
/* Background Colors */
.dark:bg-ggmp-darker     /* Main background: #020617 */
.dark:bg-ggmp-dark       /* Card background: #0f172a */
.dark:bg-ggmp-light      /* Hover/input: #1e293b */

/* Text Colors */
.text-ggmp-primary       /* Primary green: #10b981 */
.text-ggmp-secondary     /* Secondary blue: #3b82f6 */
.text-gray-400           /* Secondary text */
.text-gray-100           /* Primary text */

/* Components */
.card                    /* Dark card with border */
.btn-primary             /* Green button */
.btn-secondary           /* Blue button */
.btn-danger              /* Red button */
.input                   /* Dark input field */
```

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Grid layouts adapt to screen size
- Navigation collapses on mobile
- Touch-friendly buttons and inputs

## Tech Stack Details

### Frontend
- **React 18.2** - UI framework
- **React Router 6** - Navigation
- **Tailwind CSS 3.3** - Styling (dark theme)
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend Services
- **Express.js** - Web framework
- **CORS** - Cross-origin support
- **Body-parser** - Request parsing
- **UUID** - Unique ID generation
- **Crypto** - Key generation

### Development
- **Vite Dev Server** - Hot module reload
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility

## API Integration

### Proxy Configuration

The admin panel uses Vite's proxy to forward API requests:

```javascript
// vite.config.js
proxy: {
  '/api/keymaster': 'http://localhost:3001',
  '/api/policy': 'http://localhost:3002',
  '/api/nucleus': 'http://localhost:3003'
}
```

### Request Flow

```
Admin Panel (Port 3000)
    ↓
Vite Proxy
    ↓
┌────────────────────────────┐
│ /api/keymaster → Port 3001 │ Keymaster Service
│ /api/policy    → Port 3002 │ Policy Service
│ /api/nucleus   → Port 3003 │ Nucleus Service
└────────────────────────────┘
```

## Performance

### Optimization Features
- Lazy loading for routes
- Memoized components
- Debounced API calls
- Cached responses
- Efficient re-renders
- Code splitting

### Loading States
- Skeleton screens
- Loading indicators
- Error boundaries
- Fallback UI

## Accessibility

### Features
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast (WCAG AA)
- Screen reader support

## Security

### Implemented
- Input validation
- XSS prevention
- CSRF protection
- Secure token storage
- Environment variables
- HTTPS ready

## Future Enhancements

### Planned Features
- [ ] Real-time updates with WebSocket
- [ ] Advanced analytics dashboard
- [ ] Log viewer with filtering
- [ ] User role management
- [ ] API key management
- [ ] Email notifications
- [ ] Backup/restore functionality
- [ ] Multi-language support
- [ ] Theme customization
- [ ] Mobile app

---

**GGMP Admin Panel v1.0.0**  
Dark Theme | React | Tailwind CSS | Real-time Monitoring
