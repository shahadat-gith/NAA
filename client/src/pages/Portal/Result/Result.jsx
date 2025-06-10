import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';
import './Result.css';

const Result = () => {
    const [registrationNo, setRegistrationNo] = useState('');
    const [examName, setExamName] = useState('');
    const [academicSession, setAcademicSession] = useState('');
    const [resultData, setResultData] = useState(null);
    const [isResultChecked, setIsResultChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { type } = useParams();
    const { backendUrl } = useContext(AppContext);

    const examOptions = [
        'Half Yearly Examination',
        'Annual Examination',
        'Unit Test 1',
        'Unit Test 2',
        'Unit Test 3',
        'Unit Test 4',
    ];

    const sessionOptions = [
        '2023-2024',
        '2024-2025',
        '2025-2026',
        '2026-2027',
        '2027-2028',
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setIsResultChecked(false);
        setResultData(null);

        if (!registrationNo || !examName || !academicSession) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/result/get-result`, {
                registrationNo,
                examName,
                academicSession,
            });

            if (response.data.success) {
                setResultData(response.data.data);
                setIsResultChecked(true);
            } else {
                setError(response.data.message || 'Failed to fetch result');
                setIsResultChecked(true);
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 'An error occurred while fetching the result'
            );
            setIsResultChecked(true);
            setResultData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="result-page">
            <div className="result-header">
                <h2>Student Result Portal</h2>
                <p>Enter your details below to check your examination results</p>
            </div>

            <div className="result-form-container">
                <h3 className="form-title">Enter Your Details</h3>

                <form onSubmit={handleSubmit}>
                    <div className="result-form">
                        <div className="form-group">
                            <label htmlFor="registrationNo">
                                Registration No<span>*</span>
                            </label>
                            <input
                                id="registrationNo"
                                type="text"
                                className="form-control"
                                placeholder="e.g., NAA-25-12-001-A"
                                value={registrationNo}
                                onChange={(e) => setRegistrationNo(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="examName">
                                Exam Name<span>*</span>
                            </label>
                            <select
                                id="examName"
                                className="form-control"
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                                disabled={loading}
                                required
                            >
                                <option value="">Select Exam</option>
                                {examOptions.map((exam) => (
                                    <option key={exam} value={exam}>
                                        {exam}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="academicSession">
                                Academic Session<span>*</span>
                            </label>
                            <select
                                id="academicSession"
                                className="form-control"
                                value={academicSession}
                                onChange={(e) => setAcademicSession(e.target.value)}
                                disabled={loading}
                                required
                            >
                                <option value="">Select Session</option>
                                {sessionOptions.map((session) => (
                                    <option key={session} value={session}>
                                        {session}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Checking...' : 'Check Result'}
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}
            </div>

            <div className="status-container">
                {isResultChecked && !resultData && !error && (
                    <div className="not-found-message">
                        No results found for the provided information. Please verify your details and try again.
                    </div>
                )}

                {resultData && (
                    <div className="success-message">
                        Your result is available!
                        <span
                            className="download-link"
                            onClick={() => navigate("download", { state: { resultData } })}
                        >
                            Click here to download
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Result;