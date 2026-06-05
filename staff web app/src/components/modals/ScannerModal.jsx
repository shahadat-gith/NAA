import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { X, CameraOff, Loader2 } from "lucide-react";
import Button from "../common/Button";

const ScannerModal = ({ visible, onClose, onScanSuccess, isMarking }) => {
  const [scanned, setScanned] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
      setCameraError(false);
    }
  }, [visible]);

  if (!visible) return null;

  const handleScan = (text) => {
    if (scanned || isMarking || !text) return;
    setScanned(true);

    try {
      // Safely read payload mapping parameters mirroring original native regex splits
      const parsed = JSON.parse(text);
      const token = parsed?.token;

      if (!token) {
        alert("Invalid QR Code: This QR code format cannot be verified for institutional roster logs.");
        setScanned(false);
        return;
      }

      onScanSuccess(token);
    } catch (error) {
      alert("Invalid QR Code: Please present a valid administration attendance token.");
      setScanned(false);
    }
  };

  const handleScanError = (err) => {
    console.error("Web Camera Target Capture Rejection: ", err);
    setCameraError(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
      {/* Dimmed Overlay Layer Closer Guard */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={isMarking ? undefined : onClose} 
      />

      {/* Main Scanner Container Box */}
      <div className="w-full max-w-md rounded-3xl border bg-card border-border shadow-2xl transition-all overflow-hidden flex flex-col">
        
        {/* Header Block Row */}
        <div className="flex items-center justify-between p-5 border-b border-border/60">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-text-primary tracking-tight">
              Scan QR
            </h3>
            <p className="mt-0.5 text-xs font-medium text-text-secondary">
              Position the digital voucher inside the live view window frame.
            </p>
          </div>

          <button
            type="button"
            disabled={isMarking}
            onClick={onClose}
            className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-text-primary/5 transition-colors disabled:opacity-50 cursor-pointer border-none bg-transparent outline-none shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder Capture Area Frame */}
        <div className="bg-black relative aspect-square mx-5 my-5 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
          {cameraError ? (
            /* Error Fallback Display (Permissions / Device block) */
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
              <CameraOff size={38} className="text-danger/70" />
              <p className="text-white text-sm font-medium max-w-xs leading-relaxed">
                Camera initialization rejected. Please verify browser hardware permissions are approved for this domain.
              </p>
            </div>
          ) : isMarking || scanned ? (
            /* Loading/Processing Stamped Logs Overlay State */
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <p className="text-white text-xs font-semibold uppercase tracking-wider">
                Verifying Stamped Token...
              </p>
            </div>
          ) : (
            /* Active Yudiel Engine Portal Node */
            <div className="w-full h-full scale-102">
              <Scanner
                onResult={(text) => handleScan(text)}
                onError={(err) => handleScanError(err)}
                options={{
                  delayBetweenScans: 2000,
                }}
                styles={{
                  container: { width: "100%", height: "100%" },
                  video: { objectFit: "cover" }
                }}
              />
            </div>
          )}
        </div>

        {/* Close Button Anchor Trigger */}
        <div className="px-5 pb-5 mt-auto">
          <Button
            type="button"
            variant="outline"
            size="md"
            fullWidth
            disabled={isMarking}
            onClick={onClose}
          >
            Close Scanner
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ScannerModal;