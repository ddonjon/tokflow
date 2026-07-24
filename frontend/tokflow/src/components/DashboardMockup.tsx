import React from 'react';
import { LayoutDashboard, BarChart3, Zap, Settings, Users, Eye, TrendingUp } from 'lucide-react';

const DashboardMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900/40 backdrop-blur-xl">
      {/* Top bar */}
      <div className="p-4 bg-gray-900/60 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            TF
          </div>
          <span className="text-white font-semibold text-sm">Tokflow</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="flex h-72">
        {/* Sidebar */}
        <div className="w-16 bg-gray-900/40 p-2 flex flex-col items-center gap-2 border-r border-white/5">
          <LayoutDashboard className="w-5 h-5 text-blue-400" />
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <Zap className="w-5 h-5 text-gray-500" />
          <Settings className="w-5 h-5 text-gray-500" />
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-3 w-full max-w-md">
            <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <p className="text-white font-bold text-lg">28.4K</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Followers</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
              <Eye className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <p className="text-white font-bold text-lg">1.2M</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Views</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
              <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-white font-bold text-lg">4.8%</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Engagement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
