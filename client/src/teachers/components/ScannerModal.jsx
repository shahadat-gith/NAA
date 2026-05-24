import React from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import "../styles/ScannerModal.css";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

const ScannerModal = ({ isOpen, onClose, onScanSuccess }) => {

  const handleScan = (result) => {
    if (result?.[0]?.rawValue) {
      
      try {
        const decodedText = result[0].rawValue;
        const parsedData = JSON.parse(decodedText);

        if (parsedData.token) {
          onScanSuccess(parsedData.token);
          onClose();
        } else {
          toast.error("Invalid QR Code");
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to read QR Code");
      }
    }
  };

  const handleError = (error) => {
    console.warn(error);
    // Don't show error toast for every frame
  };

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
            <h2>Scan QR Code</h2>
            <p>Position the QR code inside the frame</p>
          </div>

          {/* Scanner */}
          <div className="scanner-wrapper">
            <Scanner
              onScan={handleScan}
              onError={handleError}
              constraints={{
                facingMode: "environment",   // Back Camera
              }}
              styles={{
                container: { 
                  width: "100%",
                  height: "380px",
                  borderRadius: "16px",
                },
                video: {
                  borderRadius: "16px",
                },
              }}
              scanDelay={300}
              allowMultiple={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerModal;