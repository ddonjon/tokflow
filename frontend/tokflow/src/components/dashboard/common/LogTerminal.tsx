import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Maximize2, Minimize2 } from 'lucide-react';
import { LogEntry } from '../types';

interface LogTerminalProps {
  logs: LogEntry[];
  isExpanded: boolean;
  onToggle: () => void;
}

export const LogTerminal: React.FC<LogTerminalProps> = ({ logs, isExpanded, onToggle }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? 'auto' : '48px' }}
      className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden transition-all duration-300"
    >
      <div
        className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-gray-800/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-mono text-gray-300">Logs</span>
          <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-400">{logs.length}</span>
        </div>
        <button className="p-1 hover:bg-gray-800 rounded-lg transition-colors">
          {isExpanded ? <Minimize2 className="w-4 h-4 text-gray-400" /> : <Maximize2 className="w-4 h-4 text-gray-400" />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={terminalRef}
            className="max-h-40 overflow-y-auto px-4 pb-3 space-y-1 font-mono text-xs"
          >
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 py-0.5">
                <span className="text-gray-600 flex-shrink-0">{log.timestamp.toLocaleTimeString()}</span>
                <span
                  className={`flex-shrink-0 ${
                    log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : 'text-blue-400'
                  }`}
                >
                  {log.type === 'success' ? '✓' : log.type === 'error' ? '✗' : 'ℹ'}
                </span>
                <span className="text-gray-300 break-all">{log.message}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
