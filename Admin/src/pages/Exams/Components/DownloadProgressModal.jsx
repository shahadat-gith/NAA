import React, { useEffect, useRef, useState } from "react";
import "../Styles/DownloadProgressModal.css";

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

    // Reset when modal opens
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
        }, 1500);

        // Simulate progress until real progress arrives
        progressIntervalRef.current = setInterval(() => {
            setDisplayProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + 4;
            });
        }, 250);

        return () => {
            clearInterval(messageIntervalRef.current);
            clearInterval(progressIntervalRef.current);
        };
    }, [isOpen]);

    // Listen to real progress updates from parent
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
        <div className="download-progress-overlay">
            <div className="download-progress-modal">
                {!completed ? (
                    <>
                        <div className="spinner" />

                        <p className="progress-message">
                            {messages[currentMessageIndex]}
                        </p>

                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${displayProgress}%` }}
                            />
                        </div>

                        <span className="progress-percent">
                            {displayProgress}%
                        </span>
                    </>
                ) : (
                    <div className="download-complete">
                        <div className="checkmark">✓</div>
                        <p>Download Completed!</p>

                        <button
                            className="download-close-btn"
                            onClick={onClose}
                        >
                            Okay
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DownloadProgressModal;