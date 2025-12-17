import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';
import { EXAM_OPTIONS, SESSION_OPTIONS } from './academicOptions'; 
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
    const { backendUrl } = useContext(AppContext);

    const examOptions = EXAM_OPTIONS;
    const sessionOptions = SESSION_OPTIONS;

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
            const response = await axios.post(`${backendUrl}/api/student/result/fetch`, {
                registrationNo: registrationNo.trim(),
                examName,
                academicSession,
            });

            if (response.data.success) {
                setResultData(response.data.result);
                setIsResultChecked(true);
            } else {
                setError(response.data.message || 'Result not found');
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

    useEffect(() => {
        if (resultData) {
            navigate("download", { state: { resultData } });
        }
    }, [resultData, navigate]);

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
                                placeholder="e.g., NAA2511001A"
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
            </div>
        </div>
    );
};

export default Result;