import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { X, Loader2 } from "lucide-react";
import Button from "../common/Button";
import Alert from "../common/Alert";

const ScannerModal = ({ visible, onClose, onScanSuccess, isMarking }) => {
  const [scanned, setScanned] = useState(false);

  // Local notification manager layer
  const [alertState, setAlertState] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info",
  });

  useEffect(() => {
    if (visible) {
      setScanned(false);
      setAlertState((prev) => ({ ...prev, visible: false }));
    }
  }, [visible]);

  if (!visible) return null;

  const triggerAlert = (title, message, variant) => {
    setAlertState({ visible: true, title, message, variant });
  };

  const handleScan = (result) => {
    if (scanned || isMarking) return;
    if (!result || result.length === 0) return;

    try {
      setScanned(true);
      const rawValue = result[0]?.rawValue;

      if (!rawValue) {
        throw new Error("Invalid QR Code. Try Again");
      }

      const parsed = JSON.parse(rawValue);
      const token = parsed?.token;

      if (!token) {
        throw new Error("Token missing in the QR Code.");
      }
      onScanSuccess(token);

    } catch (err) {
      console.error("Malformatted Data Payload: ", err);
      triggerAlert(
        "Invalid Code",
        "The scanned QR code configuration does not match Nashib Ali Academy infrastructure protocols.",
        "danger"
      );
    }
  };

  const handleScanError = (err) => {
    console.error("Web Camera Target Capture Rejection: ", err);

    let message = "An error occurred while accessing the camera. Please try again.";

    const errMsg = err?.message || "";
    const errName = err?.name || "";

    if (/permission/i.test(errMsg) || errName === "NotAllowedError") {
      message = "Camera access denied. Please enable camera permissions in your browser.";
    } else if (errName === "NotFoundError" || /not found|no device/i.test(errMsg)) {
      message = "No camera found. Please connect a camera and try again.";
    } else if (errName === "NotReadableError") {
      message = "Camera is currently in use by another application. Close other apps and retry.";
    }

    triggerAlert("Camera Error", message, "danger");
  };

  const handleAlertClose = () => {
    setAlertState((prev) => ({ ...prev, visible: false }));
    setScanned(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
      {/* Dimmed Overlay Layer Closer Guard */}
      <div
        className="absolute inset-0 -z-10"
        onClick={isMarking || alertState.visible ? undefined : onClose}
      />

      {/* Main Scanner Container Box */}
      <div className="w-full max-w-md rounded-3xl border bg-card border-border shadow-2xl transition-all overflow-hidden flex flex-col">

        {/* Viewfinder Capture Area Frame */}
        <div className="bg-black relative aspect-square mx-5 my-5 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
          {isMarking || scanned ? (
            /* Loading/Processing Stamped Logs Overlay State */
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <p className="text-white text-xs font-semibold uppercase tracking-wider">
                Verifying Token...
              </p>
            </div>
          ) : (
            /* Active Yudiel Engine Portal Node */
            <div className="w-full h-full scale-102">
              <Scanner
                onScan={handleScan}
                onError={handleScanError}
                constraints={{ facingMode: "environment" }}
                scanDelay={250}
                allowMultiple={false}
                styles={{
                  container: { width: "100%", height: "100%" },
                  video: { objectFit: "cover" },
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

      {/* App Component Custom Alert Interceptor */}
      <Alert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        variant={alertState.variant}
        onClose={handleAlertClose}
        buttons={[
          {
            text: "Okay",
            variant: "accent",
            onClick: handleAlertClose,
          },
        ]}
      />
    </div>
  );
};

export default ScannerModal;