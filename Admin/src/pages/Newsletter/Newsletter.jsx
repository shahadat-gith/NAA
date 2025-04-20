import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import "./Newsletter.css";
import { AdminContext } from "../../context/AdminContext";

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState(""); // New state for subject
  const [isSending, setIsSending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const subscribersPerPage = 3;
  const { backendUrl, adminToken } = useContext(AdminContext);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/newsletter/get-all-newsletters`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.newsletters);
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
  };

  useEffect(()=>{
    fetchSubscribers()
  },[backendUrl])

  const handleSendPromotion = async (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a promotional message");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`${backendUrl}/api/newsletter/send-promotion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ subject, message }), 
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setSubject(""); 
        setMessage(""); 
      } else {
        toast.error(data.message || "Failed to send promotional message");
      }
    } catch (error) {
      console.error("Error sending promotion:", error);
      toast.error("Something went wrong while sending the message");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [backendUrl, adminToken]);

  const totalPages = Math.ceil(subscribers.length / subscribersPerPage);
  const indexOfLastSubscriber = currentPage * subscribersPerPage;
  const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage;
  const currentSubscribers = subscribers.slice(indexOfFirstSubscriber, indexOfLastSubscriber);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="admin-newsletter-container">
      <div className="admin-newsletter-page">
        <h2>Newsletter Management</h2>

        <div className="promotion-section">
          <h3>Send Promotional Message</h3>
          <form onSubmit={handleSendPromotion}>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="promotion-subject"
              disabled={isSending}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your promotional message here..."
              className="promotion-textarea"
              rows="5"
              disabled={isSending}
            />
            <button type="submit" className="send-button" disabled={isSending}>
              {isSending ? "Sending..." : "Send to All Subscribers"}
            </button>
          </form>
        </div>

        <div className="subscribers-section">
          <h3>Subscribers ({subscribers.length})</h3>
          {subscribers.length > 0 ? (
            <>
              <ul className="subscribers-list">
                {currentSubscribers.map((subscriber) => (
                  <li key={subscriber._id}>
                    {subscriber.email} - Subscribed on{" "}
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>No subscribers found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;