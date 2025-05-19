
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and account settings</p>
      </div>
      
      <div className="bg-white border rounded-lg p-12 text-center">
        <SettingsIcon className="h-12 w-12 mx-auto text-primary opacity-50" />
        <h2 className="mt-4 text-xl font-medium">Settings page coming soon</h2>
        <p className="text-muted-foreground mt-2">
          This feature is under development and will be available in a future update.
        </p>
      </div>
    </div>
  );
};

export default Settings;
