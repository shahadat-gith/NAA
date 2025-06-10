// DeleteConfirmPopup.js
import React from "react";
import { deleteStudent } from "./api";
import toast from 'react-hot-toast';

const DeleteConfirmPopup = ({ student, onConfirm, onCancel, backendUrl, adminToken }) => {
  const handleDeleteStudent = async () => {
    await deleteStudent(backendUrl, adminToken, student._id);
    onConfirm();
  };

  return (
    <div className="delete-confirm-popup">
      <div className="popup-content">
        <h4>Confirm Deletion</h4>
        <p>
          Are you sure you want to delete {student.name}?
        </p>
        <div className="popup-buttons">
          <button onClick={handleDeleteStudent} className="confirm-btn">
            Yes, Delete
          </button>
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmPopup;