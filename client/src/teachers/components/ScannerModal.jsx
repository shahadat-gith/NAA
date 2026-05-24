import React from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import "../styles/ScannerModal.css";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

const ScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const handleScan = (result) => {
    if (!result || result.length === 0) return;

    const rawValue = result[0]?.rawValue;
    if (!rawValue) return;

    try {
      const { token } = JSON.parse(rawValue);

      if (token) {
        toast.success("QR Code Scanned Successfully!");
        onScanSuccess(token);
        onClose();
      } else {
        toast.error("Invalid QR Code: Token not found");
      }
    } catch (e) {
      console.error("QR Parse Error:", e);
      toast.error("Failed to read QR Code");
    }
  };

  const handleError = (error) => {
    // Only log serious errors, ignore common "no qr found" messages
    if (error?.message?.includes("No QR code found")) return;
    console.warn("Scanner Error:", error);
  };

  if (!isOpen) return null;

  return (
    <div className="qr-scanner-modal">
      <div className="qr-scanner-overlay">
        <div className="qr-scanner-container">
          <button className="close-modal-btn" onClick={onClose}>
            <FiX size={28} />
          </button>

          <div className="scanner-header">
            <h2>Scan Attendance QR Code</h2>
            <p>Position the QR code inside the frame</p>
          </div>

          <div className="scanner-wrapper">
            <Scanner
              onScan={handleScan}
              onError={handleError}
              constraints={{ facingMode: "environment" }}
              styles={{
                container: {
                  width: "100%",
                  height: "380px",
                  borderRadius: "16px",
                },
                video: { borderRadius: "16px" },
              }}
              scanDelay={250}
              allowMultiple={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerModal;
