import React from 'react';
import { ListChecks, Clock, Video, MoreVertical, Edit, Trash2, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScheduledPost } from '../types';

interface ScheduledViewProps {
  posts: ScheduledPost[];
  dropdownOpen: string | null;
  onDropdownToggle: (id: string | null) => void;
  onEdit: (post: ScheduledPost) => void;
  onCancel: (id: string) => void;
  onViewHistory: () => void;
}

export const ScheduledView: React.FC<ScheduledViewProps> = ({
  posts,
  dropdownOpen,
  onDropdownToggle,
  onEdit,
  onCancel,
  onViewHistory,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-y-auto flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-blue-600" />
          Scheduled
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 ml-1">{posts.length}</span>
        </h3>
        <button
          onClick={onViewHistory}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
        >
          <History className="w-3.5 h-3.5" />
          View History
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {posts.length > 0 ? (
          <div className="space-y-2">
            {posts.map((post) => (
              <div key={post.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors group relative">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Video className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.videoName}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{post.caption}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {post.scheduledFor.toLocaleDateString()} {post.scheduledFor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{post.status}</span>
                  </div>
                </div>
                
                <div className="relative dropdown-menu">
                  <button
                    onClick={() => onDropdownToggle(dropdownOpen === post.id ? null : post.id)}
                    className="p-1 rounded-lg hover:bg-gray-200 transition-colors opacity-60 hover:opacity-100 focus:opacity-100"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  <AnimatePresence>
                    {dropdownOpen === post.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10"
                      >
                        <button
                          onClick={() => onEdit(post)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => onCancel(post.id)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <ListChecks className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">No scheduled posts</p>
            <p className="text-xs">Schedule a post from the left</p>
          </div>
        )}
      </div>
    </div>
  );
};
