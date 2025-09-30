import { useState } from 'react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Simple authentication (in production, call API)
    if (username === 'admin' && password === 'admin') {
      const token = 'fake-jwt-token'
      localStorage.setItem('ggmp_admin_token', token)
      onLogin({ username })
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-ggmp-darker px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-ggmp-primary mb-4">GGMP</h1>
          <h2 className="text-3xl font-semibold">Admin Panel</h2>
          <p className="mt-2 text-gray-400">Game Global Multiplayer Platform</p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Sign in
            </button>

            <div className="text-sm text-center text-gray-400">
              Default credentials: admin / admin
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
