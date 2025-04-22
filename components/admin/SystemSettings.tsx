// components/admin/SystemSettings.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Save } from 'lucide-react';

interface SystemSettings {
  siteName: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maxUploadSize: number;
  allowRegistration: boolean;
  contactEmail: string;
  defaultUserLevel: string;
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'EdNav',
    maintenanceMode: false,
    maintenanceMessage: 'System is currently undergoing scheduled maintenance. Please check back later.',
    maxUploadSize: 5,
    allowRegistration: true,
    contactEmail: 'support@ednavapp.com',
    defaultUserLevel: 'user'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings().then();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof SystemSettings) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name as keyof SystemSettings]
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setSaveSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-48">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Configure global system settings and parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className=" font-medium">General Settings</h3>

          <div className="grid gap-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contactEmail">Support Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className=" font-medium">Maintenance Settings</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              <p className=" text-muted-foreground">
                When enabled, only admin users can access the site
              </p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={() => handleSwitchChange('maintenanceMode')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
            <Textarea
              id="maintenanceMessage"
              name="maintenanceMessage"
              value={settings.maintenanceMessage}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className=" font-medium">User Settings</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allowRegistration">Allow User Registration</Label>
              <p className=" text-muted-foreground">
                Allow new users to register accounts
              </p>
            </div>
            <Switch
              id="allowRegistration"
              checked={settings.allowRegistration}
              onCheckedChange={() => handleSwitchChange('allowRegistration')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="defaultUserLevel">Default User Level</Label>
            <Input
              id="defaultUserLevel"
              name="defaultUserLevel"
              value={settings.defaultUserLevel}
              onChange={handleInputChange}
              disabled
            />
            <p className=" text-muted-foreground">
              Changing this requires code changes for security reasons
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="maxUploadSize">
              Max Upload Size (MB)
            </Label>
            <Input
              id="maxUploadSize"
              name="maxUploadSize"
              type="number"
              min="1"
              max="50"
              value={settings.maxUploadSize}
              onChange={handleNumberChange}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>

          {saveSuccess && (
            <div className="ml-4 text-success flex items-center">
              Settings saved successfully!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}