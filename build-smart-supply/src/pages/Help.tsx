
import React from 'react';
import { HelpCircle } from 'lucide-react';

const Help = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">Get assistance and learn how to use the system</p>
      </div>
      
      <div className="bg-white border rounded-lg p-12 text-center">
        <HelpCircle className="h-12 w-12 mx-auto text-primary opacity-50" />
        <h2 className="mt-4 text-xl font-medium">Help documentation coming soon</h2>
        <p className="text-muted-foreground mt-2">
          This feature is under development and will be available in a future update.
        </p>
      </div>
    </div>
  );
};

export default Help;
