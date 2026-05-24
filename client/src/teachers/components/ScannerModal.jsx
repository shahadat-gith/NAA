import React, { useEffect, useRef } from "react";
import "../styles/ScannerModal.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";   // ← Added for X icon

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

    setTimeout(initializeScanner, 100);

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
          <button className="close-modal-btn" onClick={onClose}>
            <FiX size={28} />
          </button>

          <h3>Scan Attendance QR Code</h3>
          
          <div
            id="reader"
            style={{
              width: "100%",
              maxWidth: "420px",
              margin: "20px auto",
            }}
          ></div>

        </div>
      </div>
    </div>
  );
};

export default ScannerModal;