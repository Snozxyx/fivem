import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalServers: 0,
    activeKeys: 0,
    totalPlayers: 0,
    uptime: '0h 0m'
  })
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch from all services
      const [keymasterRes, nucleusRes, policyRes] = await Promise.all([
        axios.get('/api/keymaster/health').catch(() => ({ data: { status: 'error' } })),
        axios.get('/api/nucleus/health').catch(() => ({ data: { status: 'error' } })),
        axios.get('/api/policy/health').catch(() => ({ data: { status: 'error' } }))
      ])

      // Fetch keys and servers
      const [keysRes, serversRes] = await Promise.all([
        axios.get('/api/keymaster/keys').catch(() => ({ data: { count: 0 } })),
        axios.get('/api/nucleus/servers').catch(() => ({ data: { count: 0, servers: [] } }))
      ])

      setStats({
        totalServers: serversRes.data.count || 0,
        activeKeys: keysRes.data.count || 0,
        totalPlayers: serversRes.data.servers?.reduce((sum, s) => sum + (s.players || 0), 0) || 0,
        uptime: '24h 15m' // TODO: Calculate actual uptime
      })

      setServices([
        { name: 'Keymaster', status: keymasterRes.data.status, port: 3001 },
        { name: 'Nucleus', status: nucleusRes.data.status, port: 3003 },
        { name: 'Policy', status: policyRes.data.status, port: 3002 }
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color = 'ggmp-primary' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wide">{title}</p>
          <p className={`text-3xl font-bold mt-2 text-${color}`}>{value}</p>
        </div>
        <div className={`text-4xl text-${color} opacity-20`}>{icon}</div>
      </div>
    </div>
  )

  const ServiceStatus = ({ name, status, port }) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-800 last:border-0">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`} />
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-400">Port {port}</p>
        </div>
      </div>
      <span className={`text-sm font-medium ${status === 'ok' ? 'text-green-500' : 'text-red-500'}`}>
        {status === 'ok' ? 'Online' : 'Offline'}
      </span>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ggmp-primary">Dashboard</h1>
        <p className="text-gray-400 mt-2">GGMP Services Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Servers" value={stats.totalServers} icon="🖥️" />
        <StatCard title="Active Keys" value={stats.activeKeys} icon="🔑" color="ggmp-secondary" />
        <StatCard title="Total Players" value={stats.totalPlayers} icon="👥" color="green-500" />
        <StatCard title="Uptime" value={stats.uptime} icon="⏱️" color="blue-500" />
      </div>

      {/* Services Status */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Services Status</h2>
        <div className="space-y-0">
          {services.map(service => (
            <ServiceStatus key={service.name} {...service} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary">Generate New Token</button>
          <button className="btn-secondary">View All Servers</button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            View Logs
          </button>
        </div>
      </div>
    </div>
  )
}
