import React, { useState } from 'react';
import { 
  Upload, Video, Search, Grid, List, 
  Calendar, Clock, FileText, Trash2,
  CheckCircle, AlertCircle, X, Check
} from 'lucide-react';

interface VaultVideo {
  id: string;
  name: string;
  size: number;
  duration: string;
  uploadDate: Date;
  thumbnail?: string;
  url: string;
}

const DUMMY_VIDEOS: VaultVideo[] = [
  { 
    id: '1', 
    name: 'product_showcase.mp4', 
    size: 45.2, 
    duration: '0:32',
    uploadDate: new Date('2026-07-20T10:00:00'),
    url: '#'
  },
  { 
    id: '2', 
    name: 'tutorial_part1.mp4', 
    size: 128.5, 
    duration: '2:15',
    uploadDate: new Date('2026-07-19T14:30:00'),
    url: '#'
  },
  { 
    id: '3', 
    name: 'brand_announcement.mp4', 
    size: 67.8, 
    duration: '0:45',
    uploadDate: new Date('2026-07-18T09:15:00'),
    url: '#'
  },
  { 
    id: '4', 
    name: 'behind_scenes.mp4', 
    size: 234.1, 
    duration: '3:42',
    uploadDate: new Date('2026-07-17T16:20:00'),
    url: '#'
  },
  { 
    id: '5', 
    name: 'summer_vibes.mp4', 
    size: 89.3, 
    duration: '1:08',
    uploadDate: new Date('2026-07-16T11:45:00'),
    url: '#'
  },
];

interface VaultProps {
  onSelectVideo?: (video: VaultVideo) => void;
  selectable?: boolean;
}

export const Vault: React.FC<VaultProps> = ({ onSelectVideo, selectable = false }) => {
  const [videos, setVideos] = useState<VaultVideo[]>(DUMMY_VIDEOS);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} MB`;
    return `${(size / 1024).toFixed(1)} GB`;
  };

  const filteredVideos = videos.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      const newVideo: VaultVideo = {
        id: Date.now().toString(),
        name: file.name,
        size: parseFloat((file.size / 1024 / 1024).toFixed(1)),
        duration: '0:30',
        uploadDate: new Date(),
        url: '#'
      };
      setVideos(prev => [newVideo, ...prev]);
      setIsUploading(false);
    }, 1500);
  };

  const toggleVideoSelection = (id: string) => {
    const newSelection = new Set(selectedVideos);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedVideos(newSelection);
    if (newSelection.size > 0) {
      setIsSelectionMode(true);
    } else {
      setIsSelectionMode(false);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedVideos.size === 0) return;
    setVideos(prev => prev.filter(v => !selectedVideos.has(v.id)));
    setSelectedVideos(new Set());
    setIsSelectionMode(false);
  };

  const handleVideoClick = (video: VaultVideo) => {
    if (selectable && onSelectVideo) {
      onSelectVideo(video);
    } else if (isSelectionMode) {
      toggleVideoSelection(video.id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search & Upload - Compact */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-sm"
          />
        </div>
        
        {!isSelectionMode && (
          <label className="cursor-pointer flex-shrink-0">
            <input
              type="file"
              accept="video/*"
              onChange={handleUpload}
              className="hidden"
              multiple
            />
            <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              <Upload className="w-4 h-4" />
              Upload
            </div>
          </label>
        )}

        {!selectable && !isSelectionMode && (
          <button
            onClick={() => {
              setIsSelectionMode(true);
              setSelectedVideos(new Set());
            }}
            className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            Select
          </button>
        )}

        {isSelectionMode && !selectable && (
          <button
            onClick={() => {
              setSelectedVideos(new Set());
              setIsSelectionMode(false);
            }}
            className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            Cancel
          </button>
        )}

        {isSelectionMode && (
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            Delete ({selectedVideos.size})
          </button>
        )}

        <button
          onClick={() => setViewMode('grid')}
          className={`p-1.5 rounded-lg transition-colors ${
            viewMode === 'grid' ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:bg-gray-100'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-1.5 rounded-lg transition-colors ${
            viewMode === 'list' ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:bg-gray-100'
          }`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {/* Uploading Indicator */}
      {isUploading && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3 flex-shrink-0">
          <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-600">Uploading video...</span>
        </div>
      )}

      {/* Video Grid/List - More space */}
      <div className="flex-1 overflow-y-auto -mx-1 px-1">
        {filteredVideos.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-3">
              {filteredVideos.map((video) => {
                const isSelected = selectedVideos.has(video.id);
                return (
                  <div
                    key={video.id}
                    onClick={() => handleVideoClick(video)}
                    className={`group bg-white rounded-lg border transition-all duration-200 overflow-hidden ${
                      isSelectionMode ? 'cursor-pointer' : 'cursor-default'
                    } ${
                      isSelected ? 'border-gray-900 shadow-sm bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                      {isSelectionMode && (
                        <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-gray-900 border-gray-900' : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      )}
                      {selectable && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Select</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-sm font-medium text-gray-900 truncate">{video.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{video.duration}</span>
                        <span>•</span>
                        <span>{formatSize(video.size)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{video.uploadDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredVideos.map((video) => {
                const isSelected = selectedVideos.has(video.id);
                return (
                  <div
                    key={video.id}
                    onClick={() => handleVideoClick(video)}
                    className={`flex items-center gap-3 p-2.5 bg-white rounded-lg border transition-all duration-200 ${
                      isSelectionMode ? 'cursor-pointer' : 'cursor-default'
                    } ${
                      isSelected ? 'border-gray-900 shadow-sm bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-14 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                      <Video className="w-4 h-4 text-gray-400" />
                      {isSelectionMode && (
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-gray-900 border-gray-900' : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{video.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span>{video.duration}</span>
                        <span>•</span>
                        <span>{formatSize(video.size)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {video.uploadDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {selectable && (
                      <div className="text-xs font-medium text-gray-400">Select</div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Video className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-base font-medium">No videos found</p>
            <p className="text-sm">Upload your first video to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};
