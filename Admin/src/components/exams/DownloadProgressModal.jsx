import React, { useEffect, useRef, useState } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";

const DownloadProgressModal = ({ isOpen, progress = 0, onClose }) => {
  const messages = [
    "Preparing PDF...",
    "Optimizing layout...",
    "Finalizing document...",
    "Almost done..."
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const messageIntervalRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Reset and animate when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setCompleted(false);
    setCurrentMessageIndex(0);
    setDisplayProgress(0);

    // Rotate messages
    messageIntervalRef.current = setInterval(() => {
      setCurrentMessageIndex((prev) =>
        prev < messages.length - 1 ? prev + 1 : prev
      );
    }, 1400);

    return () => {
      clearInterval(messageIntervalRef.current);
      clearInterval(progressIntervalRef.current);
    };
  }, [isOpen]);

  // Sync with real progress from parent
  useEffect(() => {
    if (!isOpen) return;

    if (progress > 0 && progress < 100) {
      setDisplayProgress(progress);
    }

    if (progress === 100) {
      clearInterval(messageIntervalRef.current);
      clearInterval(progressIntervalRef.current);
      setDisplayProgress(100);
      setCompleted(true);
    }
  }, [progress, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1300] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="font-semibold text-lg text-[var(--text-primary)]">Generating PDF</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-10 flex flex-col items-center">
          {!completed ? (
            <>
              {/* Spinner */}
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-[var(--border-default)] rounded-full" />
                <div 
                  className="absolute inset-0 border-4 border-transparent border-t-[var(--color-primary)] rounded-full animate-spin"
                />
              </div>

              {/* Message */}
              <p className="text-[var(--text-primary)] font-medium text-center text-lg min-h-[28px] mb-8">
                {messages[currentMessageIndex]}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-[var(--bg-base)] h-2 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-[var(--color-primary)] transition-all duration-300"
                  style={{ width: `${displayProgress}%` }}
                />
              </div>

              <span className="text-sm font-mono text-[var(--text-muted)]">
                {displayProgress}%
              </span>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full border-4 border-emerald-500/20 flex items-center justify-center mb-6">
                <CheckCircle size={52} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-semibold text-emerald-500 mb-2">Download Ready!</h3>
              <p className="text-[var(--text-secondary)]">Your PDF has been generated successfully.</p>

              <button
                onClick={onClose}
                className="mt-8 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadProgressModal;