import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';
import { AppContext } from '../../../context/AppContext';
import Loader from '../../../components/Loader/Loader';
import './Bank.css';

const TeacherBank = () => {
  const { teacherData: teacher, teacherToken} = useContext(UserContext);
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  });
  const [isUpdatingBank, setIsUpdatingBank] = useState(false);

  useEffect(() => {
    if (!teacherToken) {
      navigate('/login/teacher');
    } else if (teacher) {
      setBankDetails({
        bankName: teacher.bankDetails?.bankName || '',
        accountNumber: teacher.bankDetails?.accountNumber || '',
        ifscCode: teacher.bankDetails?.ifscCode || '',
        accountHolderName: teacher.bankDetails?.accountHolderName || '',
      });
    }
  }, [teacher, teacherToken, navigate]);

  const handleBankInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankDetailsUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingBank(true);
    try {
      const response = await fetch(`${backendUrl}/api/teacher/update-bank-details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${teacherToken}`,
        },
        body: JSON.stringify(bankDetails),
      });

      const data = await response.json();
      if (data.success) {
        navigate("/teacher")
        toast.success('Bank details updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update bank details');
      }
    } catch (error) {
      console.error('Error updating bank details:', error);
      toast.error('Error updating bank details.');
    } finally {
      setIsUpdatingBank(false);
    }
  };

  if (!teacherToken) return null;
  if (!teacher) return <Loader message="Loading teacher data..." />;

  return (
    <div className="teacher-bank-container">
      <div className="teacher-bank-card">
        <h2 className="teacher-bank-title">Bank Details</h2>
        <form
          className="teacher-bank-form"
          onSubmit={handleBankDetailsUpdate}
        >
          <div className="teacher-info-item">
            <label htmlFor="bankName" className="teacher-info-label">
              Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              className="teacher-input"
              value={bankDetails.bankName}
              onChange={handleBankInputChange}
              required
            />
          </div>
          <div className="teacher-info-item">
            <label htmlFor="accountNumber" className="teacher-info-label">
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              className="teacher-input"
              value={bankDetails.accountNumber}
              onChange={handleBankInputChange}
              required
            />
          </div>
          <div className="teacher-info-item">
            <label htmlFor="ifscCode" className="teacher-info-label">
              IFSC Code
            </label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              className="teacher-input"
              value={bankDetails.ifscCode}
              onChange={handleBankInputChange}
              required
            />
          </div>
          <div className="teacher-info-item">
            <label htmlFor="accountHolderName" className="teacher-info-label">
              Account Holder Name
            </label>
            <input
              type="text"
              id="accountHolderName"
              name="accountHolderName"
              className="teacher-input"
              value={bankDetails.accountHolderName}
              onChange={handleBankInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="teacher-bank-submit"
            disabled={isUpdatingBank}
          >
            {isUpdatingBank ? 'Updating...' : 'Update Bank Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherBank;