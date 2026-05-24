import React, { useEffect, useRef } from "react";
import "../styles/ScannerModal.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

const ScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const initializeScanner = () => {
      const readerElement = document.getElementById("reader");
      if (!readerElement) return;

      if (scannerRef.current) {
        scannerRef.current.clear();
      }

      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 12,
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1.0,
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
        },
        false
      );

      scannerRef.current = scanner;

      scanner.render(
        async (decodedText) => {
          scanner.clear();
          onClose();

          try {
            const parsedData = JSON.parse(decodedText);
            if (parsedData.token) {
              onScanSuccess(parsedData.token);
            } else {
              toast.error("Invalid QR Code");
            }
          } catch (e) {
            console.error(e);
            toast.error("Failed to read QR Code");
          }
        },
        (error) => {
          if (!error?.startsWith("NotFoundException")) {
            console.warn(error);
          }
        }
      );
    };

    setTimeout(initializeScanner, 150);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [isOpen, onClose, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="qr-scanner-modal">
      <div className="qr-scanner-overlay">
        <div className="qr-scanner-container">
          
          {/* Close Button */}
          <button className="close-modal-btn" onClick={onClose}>
            <FiX size={28} />
          </button>

          <div className="scanner-header">
            <h3>Scan Attendance QR Code</h3>
            <p className="scanner-subtitle">
              Position the QR code within the frame
            </p>
          </div>

          {/* Scanner Area */}
          <div className="scanner-wrapper">
            <div id="reader" className="scanner-reader"></div>
          </div>

          <div className="scanner-footer">
            <p className="scan-instruction">
              📱 Make sure the QR code is clear and well-lit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerModal;