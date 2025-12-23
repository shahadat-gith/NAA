import React, { useEffect, useState } from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}) => {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      // wait for animation before unmount
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className={`confirm-modal-overlay ${
        open ? "open" : "close"
      }`}
    >
      <div
        className={`confirm-modal ${
          open ? "open" : "close"
        }`}
      >
        <h3 className={danger ? "danger" : ""}>{title}</h3>

        <div className="confirm-message">{message}</div>

        <div className="confirm-modal-actions">
          <button
            className="btn cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            className={`btn ${danger ? "danger" : "primary"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
