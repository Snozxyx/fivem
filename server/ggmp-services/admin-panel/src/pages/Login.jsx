import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Lock } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Lock className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-primary mb-2">GGMP</h1>
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
          <p className="mt-2 text-muted-foreground">Game Global Multiplayer Platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="bg-destructive/20 border border-destructive text-destructive-foreground px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full">
                Sign in
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Default credentials: admin / admin
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
