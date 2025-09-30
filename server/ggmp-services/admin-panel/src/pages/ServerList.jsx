import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default function ServerList() {
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServers()
    const interval = setInterval(fetchServers, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [])

  const fetchServers = async () => {
    try {
      const res = await axios.get('/api/nucleus/servers')
      setServers(res.data.servers || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching servers:', error)
      setLoading(false)
    }
  }

  const ServerCard = ({ server }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-ggmp-primary">{server.name || 'Unnamed Server'}</CardTitle>
            <CardDescription className="mt-1">{server.host}</CardDescription>
          </div>
          <Badge variant="success">Online</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Players</p>
            <p className="text-2xl font-bold">{server.players || 0} / {server.maxPlayers || 2048}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Server ID</p>
            <p className="text-sm font-mono">{server.id.substring(0, 8)}...</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Last seen: {new Date(server.lastSeen).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading servers...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ggmp-primary">Server List</h1>
        <p className="text-gray-400 mt-2">Registered GGMP servers</p>
      </div>

      {servers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-400">No servers registered yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {servers.map(server => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      )}
    </div>
  )
}
