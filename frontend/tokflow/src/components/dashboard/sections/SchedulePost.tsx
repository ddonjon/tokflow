import React from 'react';
import { Play, Calendar, Loader2 } from 'lucide-react';
import { VideoDropZone } from '../common';

interface SchedulePostProps {
  selectedFile?: File;
  caption: string;
  scheduledDate: string;
  isScheduling: boolean;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onCaptionChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSchedule: () => void;
}

export const SchedulePost: React.FC<SchedulePostProps> = ({
  selectedFile,
  caption,
  scheduledDate,
  isScheduling,
  onFileSelect,
  onFileRemove,
  onCaptionChange,
  onDateChange,
  onSchedule,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Play className="w-4 h-4 text-blue-600" />
        Schedule Post
      </h3>

      <div className="space-y-3">
        <VideoDropZone onFileSelect={onFileSelect} selectedFile={selectedFile} onRemove={onFileRemove} />

        <textarea
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Write your caption..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
        />

        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm pr-9"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={onSchedule}
            disabled={isScheduling}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
          >
            {isScheduling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
            {isScheduling ? 'Scheduling...' : 'Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};
