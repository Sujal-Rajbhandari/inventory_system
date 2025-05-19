
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileNavbar from './MobileNavbar';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <Sidebar open={true} onClose={() => {}} />
      )}

      {/* Mobile sidebar (slides in) */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation for mobile */}
        {isMobile && (
          <div className="h-16 border-b flex items-center px-4 bg-white">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-xl font-bold ml-4">SmartSupply</span>
          </div>
        )}

        {/* Main scrollable content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>

        {/* Bottom navigation for mobile */}
        {isMobile && <MobileNavbar />}
      </div>
    </div>
  );
};

export default MainLayout;
