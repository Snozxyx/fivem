import { useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    maxPlayers: 2048,
    streamingMemory: '18MB',
    allowOfflineMode: true,
    requireKeymaster: false,
    autoRefresh: true
  })

  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    // TODO: Save to backend
    localStorage.setItem('ggmp_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ggmp-primary">Settings</h1>
        <p className="text-gray-400 mt-2">Configure GGMP platform settings</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Maximum Players</label>
              <input
                type="number"
                className="input w-full"
                value={settings.maxPlayers}
                onChange={(e) => setSettings({ ...settings, maxPlayers: parseInt(e.target.value) })}
                min="1"
                max="2048"
              />
              <p className="text-xs text-gray-400 mt-1">Maximum allowed players per server</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Streaming Memory</label>
              <input
                type="text"
                className="input w-full"
                value={settings.streamingMemory}
                onChange={(e) => setSettings({ ...settings, streamingMemory: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">Memory allocated for asset streaming</p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowOfflineMode}
                onChange={(e) => setSettings({ ...settings, allowOfflineMode: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 bg-ggmp-light focus:ring-2 focus:ring-ggmp-primary"
              />
              <div>
                <span className="font-medium">Allow Offline Mode</span>
                <p className="text-xs text-gray-400">Servers can operate without internet connection</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireKeymaster}
                onChange={(e) => setSettings({ ...settings, requireKeymaster: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 bg-ggmp-light focus:ring-2 focus:ring-ggmp-primary"
              />
              <div>
                <span className="font-medium">Require Keymaster Validation</span>
                <p className="text-xs text-gray-400">All servers must have valid license keys</p>
              </div>
            </label>
          </div>
        </div>

        {/* Interface Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Interface Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) => setSettings({ ...settings, autoRefresh: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 bg-ggmp-light focus:ring-2 focus:ring-ggmp-primary"
              />
              <div>
                <span className="font-medium">Auto-refresh Dashboard</span>
                <p className="text-xs text-gray-400">Automatically refresh data every 30 seconds</p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center space-x-4">
          <button type="submit" className="btn-primary">
            Save Settings
          </button>
          {saved && (
            <span className="text-green-500 text-sm">✓ Settings saved successfully</span>
          )}
        </div>
      </form>
    </div>
  )
}
