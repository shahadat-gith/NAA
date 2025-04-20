import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./AdmissionQuery.css";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

const AdmissionQuery = () => {
  const { backendUrl, fetchPendingQueries, adminToken } = useContext(AdminContext);
  const [queries, setQueries] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queryId, setQueryId] = useState("");
  const [replyData, setReplyData] = useState({
    email: "",
    text: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 5; // Number of queries per page

  const fetchQueries = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/query/get-admission-queries`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (response.data.success) {
        setQueries(response.data.queries);
      }
    } catch (error) {
      console.error("Error fetching admission queries:", error);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [backendUrl]);

  const openPopup = (query) => {
    setSelectedQuery(query);
    setQueryId(query._id);
    setReplyData({ email: query.email, text: "" });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedQuery(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReplyData({ ...replyData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!replyData.text.trim()) {
      toast.error("Please enter a message before sending!");
      return;
    }

    const sendReply = async () => {
      const response = await axios.put(
        `${backendUrl}/api/query/reply-admission-query/${queryId}`,
        replyData,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      } else {
        fetchPendingQueries();
        return response.data.message;
      }
    };

    toast.promise(sendReply(), {
      pending: "Sending reply...",
      success: "Reply sent successfully!",
      error: "Failed to send reply, try again.",
    })
      .then(() => {
        fetchQueries();
        closePopup();
      })
      .catch((error) => console.error("Error sending reply:", error));
  };

  // Pagination Logic
  const reversedQueries = queries.slice().reverse(); // Keep existing reverse order (newest first)
  const totalItems = reversedQueries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedQueries = reversedQueries.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="admission-query-container">
      <h2 className="admission-query-title">Admission Queries</h2>
      <div className="admission-query-table-container">
        <table className="admission-query-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {totalItems > 0 ? (
              paginatedQueries.map((query, index) => (
                <tr key={query._id}>
                  <td>{startIndex + index + 1}</td> {/* Sequential numbering for current page */}
                  <td>{query.name}</td>
                  <td>{query.email}</td>
                  <td>{query.message}</td>
                  <td>
                    <span
                      className={`admission-status-badge ${
                        query.isReplied ? "admission-replied" : "admission-pending"
                      }`}
                    >
                      {query.isReplied ? "Replied" : "Pending"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`admission-action-button ${
                        query.isReplied ? "disabled" : "admission-reply"
                      }`}
                      onClick={() => openPopup(query)}
                      disabled={query.isReplied}
                    >
                      {query.isReplied ? "Replied" : "Reply"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="admission-no-data">
                  No admission queries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages} ({startIndex + 1}-{endIndex} of {totalItems})
          </span>
          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Popup Form */}
      {showPopup && (
        <div className="popup-overlay show">
          <div className="popup-container">
            <h3>Reply to {selectedQuery?.name}</h3>
            <form onSubmit={handleSubmit}>
              <label>Message</label>
              <textarea
                name="text"
                rows="4"
                value={replyData.text}
                onChange={handleChange}
                placeholder="Write your reply..."
                required
              />

              <div className="popup-buttons">
                <button type="submit" className="send-button">
                  Send
                </button>
                <button type="button" className="close-button" onClick={closePopup}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionQuery;