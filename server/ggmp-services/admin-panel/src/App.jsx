import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import TokenManagement from './pages/TokenManagement'
import ServerList from './pages/ServerList'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { Button } from './components/ui/button'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('ggmp_admin_token')
    if (token) {
      setIsAuthenticated(true)
      setCurrentUser({ username: 'admin' }) // TODO: Decode from JWT
    }
  }, [])

  const handleLogin = (user) => {
    setIsAuthenticated(true)
    setCurrentUser(user)
  }

  const handleLogout = () => {
    localStorage.removeItem('ggmp_admin_token')
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Router>
      <div className="min-h-screen dark:bg-ggmp-darker">
        {/* Navigation */}
        <nav className="dark:bg-ggmp-dark border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-ggmp-primary">GGMP</h1>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-ggmp-light transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/tokens" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-ggmp-light transition-colors">
                      Tokens
                    </Link>
                    <Link to="/servers" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-ggmp-light transition-colors">
                      Servers
                    </Link>
                    <Link to="/settings" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-ggmp-light transition-colors">
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">Welcome, {currentUser?.username}</span>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tokens" element={<TokenManagement />} />
            <Route path="/servers" element={<ServerList />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
