import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Plus, Trash2 } from 'lucide-react'

export default function TokenManagement() {
  const [tokens, setTokens] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newToken, setNewToken] = useState({
    key: '',
    serverName: '',
    maxPlayers: 2048
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTokens()
  }, [])

  const fetchTokens = async () => {
    try {
      const res = await axios.get('/api/keymaster/keys')
      setTokens(res.data.keys || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching tokens:', error)
      setLoading(false)
    }
  }

  const generateKey = () => {
    const parts = []
    for (let i = 0; i < 5; i++) {
      const segment = Math.random().toString(16).substring(2, 6).toUpperCase()
      parts.push(segment)
    }
    return `GGMP-${parts.join('-')}`
  }

  const handleCreateToken = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/keymaster/register-key', newToken)
      setShowCreateModal(false)
      setNewToken({ key: '', serverName: '', maxPlayers: 2048 })
      fetchTokens()
    } catch (error) {
      console.error('Error creating token:', error)
      alert('Failed to create token')
    }
  }

  const handleRevokeToken = async (key) => {
    if (confirm('Are you sure you want to revoke this token?')) {
      try {
        await axios.delete(`/api/keymaster/keys/${key}`)
        fetchTokens()
      } catch (error) {
        console.error('Error revoking token:', error)
        alert('Failed to revoke token')
      }
    }
  }

  const TokenRow = ({ token }) => (
    <TableRow>
      <TableCell className="font-mono text-sm">{token.key}</TableCell>
      <TableCell>{token.serverName}</TableCell>
      <TableCell>{token.maxPlayers}</TableCell>
      <TableCell>{token.usage?.length || 0}</TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {new Date(token.registered).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Button
          onClick={() => handleRevokeToken(token.key)}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Revoke
        </Button>
      </TableCell>
    </TableRow>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading tokens...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Token Management</h1>
          <p className="text-muted-foreground mt-2">Manage GGMP license keys</p>
        </div>
        <Button
          onClick={() => {
            setNewToken({ ...newToken, key: generateKey() })
            setShowCreateModal(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate New Token
        </Button>
      </div>

      {/* Tokens Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token Key</TableHead>
                <TableHead>Server Name</TableHead>
                <TableHead>Max Players</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No tokens found. Create your first token to get started.
                  </TableCell>
                </TableRow>
              ) : (
                tokens.map(token => <TokenRow key={token.key} token={token} />)
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Token Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">Generate New Token</DialogTitle>
            <DialogDescription>Create a new license key for a GGMP server</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateToken} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token-key">Token Key</Label>
              <Input
                id="token-key"
                type="text"
                className="font-mono"
                value={newToken.key}
                onChange={(e) => setNewToken({ ...newToken, key: e.target.value })}
                required
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-name">Server Name</Label>
              <Input
                id="server-name"
                type="text"
                value={newToken.serverName}
                onChange={(e) => setNewToken({ ...newToken, serverName: e.target.value })}
                required
                placeholder="My GGMP Server"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-players">Max Players</Label>
              <Input
                id="max-players"
                type="number"
                value={newToken.maxPlayers}
                onChange={(e) => setNewToken({ ...newToken, maxPlayers: parseInt(e.target.value) })}
                required
                min="1"
                max="2048"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Token
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
