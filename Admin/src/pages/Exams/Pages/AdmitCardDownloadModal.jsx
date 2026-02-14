import React, { useContext, useMemo, useState } from "react";
import "../Styles/AdmitCardDownloadModal.css";
import { AppContext } from "../../../context/AppContext";
import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../../utils/academicOptions";
import { formatClassName } from "../../../utils/utility";
import { generateAdmitCards } from "../AdmitcardPdf/generateAdmitCard";
import { PDFDownloadLink } from "@react-pdf/renderer";
import StudentList from "./StudentList";

const AdmitCardDownloadModal = ({ open, onClose }) => {

    const { settings, students, fetchingStudents } = useContext(AppContext);


    const [medium, setMedium] = useState("");
    const [cls, setCls] = useState("");
    const [stream, setStream] = useState("");
    const [query, setQuery] = useState("");
    const [selectedStudentKey, setSelectedStudentKey] = useState("");


    const currentExam =
        settings?.exams?.[settings.exams?.length - 1] ?? null;

    const principal = settings?.authorities?.find(
        a => a.role?.toLowerCase() === "principal"
    ) ?? null;



    const isSeniorClass = cls === "11" || cls === "12";

    /* -------------------- MEDIUM → CLASS -------------------- */
    const availableClasses = useMemo(() => {
        return medium ? CLASS_OPTIONS[medium] || [] : [];
    }, [medium]);

    /* -------------------- CLASS MODE STUDENTS -------------------- */
    const classStudents = useMemo(() => {
        if (!medium || !cls) return [];

        return (students || []).filter((s) => {
            if (s.medium !== medium) return false;
            if (s.class !== cls) return false;
            if (isSeniorClass && stream && s.stream !== stream) return false;
            return true;
        });
    }, [students, medium, cls, stream, isSeniorClass]);

    /* -------------------- SEARCH MODE STUDENTS -------------------- */
    const searchedStudents = useMemo(() => {
        if (!query.trim()) return [];

        const term = query.toLowerCase();
        return (students || []).filter(
            (s) =>
                s.name?.toLowerCase().includes(term) ||
                s.registrationNo?.toLowerCase().includes(term)
        );
    }, [students, query]);

    /* -------------------- ADMIT CARD LOOKUP -------------------- */
    const getAdmitCard = (student) => {
        return (settings?.admitCards || []).find((card) => {
            if (card.class !== student.class) return false;
            if (card.medium !== student.medium) return false;
            return student.stream
                ? card.stream === student.stream
                : !card.stream;
        });
    };

    /* -------------------- MODE LOGIC -------------------- */
    let studentsToDownload = [];
    let admitCard = null;
    let errorMessage = "";

    const isSearchMode = query.trim().length > 0;

    if (isSearchMode) {
        if (searchedStudents.length === 0) {
            errorMessage = "No student found";
        } else if (searchedStudents.length === 1) {
            studentsToDownload = searchedStudents;
        } else {
            if (!selectedStudentKey) {
                errorMessage = "Multiple students found. Select one.";
            } else {
                const picked = searchedStudents.find(
                    (s) =>
                        (s._id || s.registrationNo) === selectedStudentKey
                );
                if (!picked) {
                    errorMessage = "Selected student not found";
                } else {
                    studentsToDownload = [picked];
                }
            }
        }
    } else {
        if (!medium) errorMessage = "Medium is required";
        else if (!cls) errorMessage = "Class is required";
        else if (isSeniorClass && !stream)
            errorMessage = "Stream is required";
        else if (classStudents.length === 0)
            errorMessage = "No students found";
        else studentsToDownload = classStudents;
    }

    if (studentsToDownload.length > 0) {
        admitCard = getAdmitCard(studentsToDownload[0]);
        if (!currentExam) errorMessage = "Current exam is not set";
        else if (!principal)
            errorMessage = "Principal details not found";
        else if (!admitCard)
            errorMessage = "No admit card schedule found";
    }

    const fileName =
        studentsToDownload.length === 1
            ? `admit_card_${studentsToDownload[0].registrationNo}.pdf`
            : `admit_cards_${cls}_${medium}.pdf`;

    /* -------------------- RESET -------------------- */
    const resetAndClose = () => {
        setMedium("");
        setCls("");
        setStream("");
        setQuery("");
        setSelectedStudentKey("");
        onClose();
    };

    const resetFilters = () => {
        setMedium("");
        setCls("");
        setStream("");
        setSelectedStudentKey("");
    };

    const resetSearch = () => {
        setQuery("");
        setSelectedStudentKey("");
    };

    /* -------------------- SAFE RETURN -------------------- */
    if (!open) return null;

    /* -------------------- STUDENTS TO SHOW -------------------- */
    const studentsToShow = isSearchMode
        ? searchedStudents
        : classStudents;

    /* -------------------- JSX -------------------- */
    return (
        <div className="admit-download-overlay" onClick={resetAndClose}>
            <div
                className="admit-download-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="admit-download-header">
                    <h3>Download Admit Cards</h3>
                    <button onClick={resetAndClose}>✕</button>
                </div>

                <div className="admit-download-body">
                    <div className="admit-download-grid">
                        <div className="admit-download-field">
                            <label>Medium *</label>
                            <select
                                value={medium}
                                onChange={(e) => {
                                    setMedium(e.target.value);
                                    setCls("");
                                    setStream("");
                                }}
                            >
                                <option value="">Select Medium</option>
                                <option value="english">English</option>
                                <option value="assamese">Assamese</option>
                            </select>
                        </div>

                        <div className="admit-download-field">
                            <label>Class *</label>
                            <select
                                value={cls}
                                disabled={!medium}
                                onChange={(e) => {
                                    setCls(e.target.value);
                                    setStream("");
                                }}
                            >
                                <option value="">Select Class</option>
                                {availableClasses.map((c) => (
                                    <option key={c} value={c}>
                                        {formatClassName(c)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {isSeniorClass && (
                            <div className="admit-download-field">
                                <label>Stream *</label>
                                <select
                                    value={stream}
                                    onChange={(e) =>
                                        setStream(e.target.value)
                                    }
                                >
                                    <option value="">Select Stream</option>
                                    {STREAM_OPTIONS.map((s) => (
                                        <option key={s} value={s}>
                                            {s.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="admit-download-search">
                        <input
                            placeholder="Search by name or registration no"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSelectedStudentKey("");
                            }}

                        />
                    </div>

                    <div className="admit-download-summary">
                        {errorMessage || "Ready to download"}
                        {fetchingStudents && <span> Loading...</span>}
                    </div>

                    {/* ✅ STUDENT LIST*/}

                    <StudentList
                        students={studentsToShow}
                        selectable={isSearchMode}
                        selectedKey={selectedStudentKey}
                        onSelect={setSelectedStudentKey}
                    />
                </div>

                <div className="admit-download-actions">
                    <div className="admit-download-actions-left">
                        <button
                            type="button"
                            className="admit-download-reset"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </button>
                        <button
                            type="button"
                            className="admit-download-reset"
                            onClick={resetSearch}
                        >
                            Reset Search
                        </button>
                    </div>

                    {errorMessage || studentsToDownload.length === 0 ? (
                        <button
                            type="button"
                            className="admit-download-submit"
                            disabled
                            title={errorMessage || "Select students to download"}
                        >
                            Download
                        </button>
                    ) : (
                        <PDFDownloadLink
                            document={generateAdmitCards({
                                students: studentsToDownload,
                                admitCard,
                                examDetails: currentExam,
                                principal,
                            })}
                            fileName={fileName}
                        >
                            {({ loading }) => (
                                <button
                                    type="button"
                                    className="admit-download-submit"
                                    disabled={loading}
                                    onClick={onclose}
                                >
                                    {loading
                                        ? "Please wait..."
                                        : "Download Now"}
                                </button>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdmitCardDownloadModal;
