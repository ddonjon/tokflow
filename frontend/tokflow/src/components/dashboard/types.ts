export interface Account {
  id: string;
  username: string;
  avatar?: string;
  sessionCookie?: string;
  platform: 'tiktok' | 'threads' | 'youtube';
  status?: 'active' | 'expired' | 'checking'; // New property for health checks
}

export interface ScheduledPost {
  id: string;
  accountId: string;
  videoName: string;
  caption: string;
  scheduledFor: Date;
  status: 'scheduled' | 'posted' | 'failed';
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'error';
  message: string;
}
