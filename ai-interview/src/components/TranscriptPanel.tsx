// components/TranscriptPanel.tsx
import { X } from "lucide-react";

interface TranscriptPanelProps {
  isOpen: boolean;
  onClose: () => void;
  transcriptions: Array<{
    text: string;
    role: string;
    timestamp: number;
  }>;
}

export function TranscriptPanel({ isOpen, onClose, transcriptions = [] }: TranscriptPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Interview Transcript</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Close transcript"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        {transcriptions.length > 0 ? (
          transcriptions.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg ${
                item.role === 'user' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'
              }`}
            >
              <div className="text-sm font-medium">
                {item.role === 'user' ? 'You' : 'Interviewer'}
              </div>
              <p className="text-gray-800">{item.text}</p>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(item.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No transcriptions yet</p>
        )}
      </div>
    </div>
  );
}