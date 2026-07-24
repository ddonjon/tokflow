import React from 'react';
import { History, Clock, CheckCircle, AlertTriangle, ArrowLeft, ArrowUpDown } from 'lucide-react';
import { ScheduledPost } from '../types';

interface HistoryViewProps {
  posts: ScheduledPost[];
  sortOrder: 'newest' | 'oldest';
  onSortChange: () => void;
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ posts, sortOrder, onSortChange, onBack }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-y-auto flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <History className="w-4 h-4 text-gray-600" />
            History
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 ml-1">{posts.length}</span>
          </h3>
        </div>
        <button
          onClick={onSortChange}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <ArrowUpDown className="w-3 h-3" />
          {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {posts.length > 0 ? (
          <div className="space-y-2">
            {posts.map((post) => (
              <div key={post.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {post.status === 'posted' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.videoName}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{post.caption}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {post.scheduledFor.toLocaleDateString()} {post.scheduledFor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      post.status === 'posted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <History className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">No history yet</p>
            <p className="text-xs">Posted posts will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};
