import { useState, useEffect } from 'react'
import axios from 'axios'

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
    <tr className="border-b border-gray-800 hover:bg-ggmp-light transition-colors">
      <td className="px-6 py-4 font-mono text-sm">{token.key}</td>
      <td className="px-6 py-4">{token.serverName}</td>
      <td className="px-6 py-4">{token.maxPlayers}</td>
      <td className="px-6 py-4">{token.usage?.length || 0}</td>
      <td className="px-6 py-4 text-sm text-gray-400">
        {new Date(token.registered).toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => handleRevokeToken(token.key)}
          className="btn-danger text-sm"
        >
          Revoke
        </button>
      </td>
    </tr>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading tokens...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-ggmp-primary">Token Management</h1>
          <p className="text-gray-400 mt-2">Manage GGMP license keys</p>
        </div>
        <button
          onClick={() => {
            setNewToken({ ...newToken, key: generateKey() })
            setShowCreateModal(true)
          }}
          className="btn-primary"
        >
          + Generate New Token
        </button>
      </div>

      {/* Tokens Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-ggmp-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Token Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Server Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Max Players
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Usage Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    No tokens found. Create your first token to get started.
                  </td>
                </tr>
              ) : (
                tokens.map(token => <TokenRow key={token.key} token={token} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Token Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="card max-w-lg w-full">
            <h2 className="text-2xl font-bold text-ggmp-primary mb-4">Generate New Token</h2>
            <form onSubmit={handleCreateToken} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Token Key</label>
                <input
                  type="text"
                  className="input w-full font-mono"
                  value={newToken.key}
                  onChange={(e) => setNewToken({ ...newToken, key: e.target.value })}
                  required
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Server Name</label>
                <input
                  type="text"
                  className="input w-full"
                  value={newToken.serverName}
                  onChange={(e) => setNewToken({ ...newToken, serverName: e.target.value })}
                  required
                  placeholder="My GGMP Server"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Players</label>
                <input
                  type="number"
                  className="input w-full"
                  value={newToken.maxPlayers}
                  onChange={(e) => setNewToken({ ...newToken, maxPlayers: parseInt(e.target.value) })}
                  required
                  min="1"
                  max="2048"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Create Token
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
