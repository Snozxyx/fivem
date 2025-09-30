import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Server, Key, Users, Clock, Activity, TrendingUp } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalServers: 0,
    activeKeys: 0,
    totalPlayers: 0,
    uptime: '0h 0m'
  })
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Generate sample chart data
    const data = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      players: Math.floor(Math.random() * 100) + 50,
      servers: Math.floor(Math.random() * 20) + 10,
      requests: Math.floor(Math.random() * 500) + 200,
    }))
    setChartData(data)
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

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold mt-2 text-primary">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </p>
            )}
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ServiceStatus = ({ name, status, port }) => (
    <div className="flex items-center justify-between p-4 border-b border-border last:border-0">
      <div className="flex items-center space-x-3">
        <Badge variant={status === 'ok' ? 'success' : 'destructive'}>
          {status === 'ok' ? 'Online' : 'Offline'}
        </Badge>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">Port {port}</p>
        </div>
      </div>
      <Activity className={`w-5 h-5 ${status === 'ok' ? 'text-green-500' : 'text-red-500'}`} />
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-2">GGMP Services Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Servers" 
          value={stats.totalServers} 
          icon={Server}
          trend="+12% from last month"
        />
        <StatCard 
          title="Active Keys" 
          value={stats.activeKeys} 
          icon={Key}
          trend="+8% from last month"
        />
        <StatCard 
          title="Total Players" 
          value={stats.totalPlayers} 
          icon={Users}
          trend="+23% from last month"
        />
        <StatCard 
          title="Uptime" 
          value={stats.uptime} 
          icon={Clock}
          trend="99.9% availability"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Player Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Player Activity (24h)</CardTitle>
            <CardDescription>Active players over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffe0c2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffe0c2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#201e18" />
                <XAxis dataKey="time" stroke="#b4b4b4" />
                <YAxis stroke="#b4b4b4" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#191919', border: '1px solid #201e18' }}
                  labelStyle={{ color: '#eeeeee' }}
                />
                <Area type="monotone" dataKey="players" stroke="#ffe0c2" fillOpacity={1} fill="url(#colorPlayers)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Server Load Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Server Load (24h)</CardTitle>
            <CardDescription>Active servers over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#201e18" />
                <XAxis dataKey="time" stroke="#b4b4b4" />
                <YAxis stroke="#b4b4b4" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#191919', border: '1px solid #201e18' }}
                  labelStyle={{ color: '#eeeeee' }}
                />
                <Line type="monotone" dataKey="servers" stroke="#ffe0c2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* API Requests Chart */}
      <Card>
        <CardHeader>
          <CardTitle>API Request Volume</CardTitle>
          <CardDescription>Total API requests processed in the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#201e18" />
              <XAxis dataKey="time" stroke="#b4b4b4" />
              <YAxis stroke="#b4b4b4" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#191919', border: '1px solid #201e18' }}
                labelStyle={{ color: '#eeeeee' }}
              />
              <Bar dataKey="requests" fill="#ffe0c2" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle>Services Status</CardTitle>
          <CardDescription>Real-time status of all GGMP services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {services.map(service => (
              <ServiceStatus key={service.name} {...service} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="w-full">
              <Key className="w-4 h-4 mr-2" />
              Generate New Token
            </Button>
            <Button variant="secondary" className="w-full">
              <Server className="w-4 h-4 mr-2" />
              View All Servers
            </Button>
            <Button variant="outline" className="w-full">
              <Activity className="w-4 h-4 mr-2" />
              View Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
