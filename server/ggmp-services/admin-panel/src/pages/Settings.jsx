import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Save, Check } from 'lucide-react'

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
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure GGMP platform settings</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure general platform parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-players">Maximum Players</Label>
              <Input
                id="max-players"
                type="number"
                value={settings.maxPlayers}
                onChange={(e) => setSettings({ ...settings, maxPlayers: parseInt(e.target.value) })}
                min="1"
                max="2048"
              />
              <p className="text-xs text-muted-foreground">Maximum allowed players per server</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="streaming-memory">Streaming Memory</Label>
              <Input
                id="streaming-memory"
                type="text"
                value={settings.streamingMemory}
                onChange={(e) => setSettings({ ...settings, streamingMemory: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Memory allocated for asset streaming</p>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage security and authentication options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowOfflineMode}
                onChange={(e) => setSettings({ ...settings, allowOfflineMode: e.target.checked })}
                className="w-5 h-5 rounded border-border bg-input focus:ring-2 focus:ring-ring"
              />
              <div>
                <span className="font-medium">Allow Offline Mode</span>
                <p className="text-xs text-muted-foreground">Servers can operate without internet connection</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireKeymaster}
                onChange={(e) => setSettings({ ...settings, requireKeymaster: e.target.checked })}
                className="w-5 h-5 rounded border-border bg-input focus:ring-2 focus:ring-ring"
              />
              <div>
                <span className="font-medium">Require Keymaster Validation</span>
                <p className="text-xs text-muted-foreground">All servers must have valid license keys</p>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Interface Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Interface Settings</CardTitle>
            <CardDescription>Customize the admin panel interface</CardDescription>
          </CardHeader>
          <CardContent>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) => setSettings({ ...settings, autoRefresh: e.target.checked })}
                className="w-5 h-5 rounded border-border bg-input focus:ring-2 focus:ring-ring"
              />
              <div>
                <span className="font-medium">Auto-refresh Dashboard</span>
                <p className="text-xs text-muted-foreground">Automatically refresh data every 30 seconds</p>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center space-x-4">
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
          {saved && (
            <span className="text-green-500 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              Settings saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
