import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Search, Filter, Download, Bell, Calendar } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header/Header';
import './Notices.css';

const Notices = () => {
  const [activeCategory, setActiveCategory] = useState('academic');
  const [notices, setNotices] = useState({
    academic: [],
    administrative: [],
    extracurricular: [],
  });
  const [latestNotices, setLatestNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotices, setFilteredNotices] = useState([]);
  const { backendUrl } = useContext(AppContext);

  // Fetch notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/admin/get-notices`);
        const fetchedNotices = response.data.notices;

        setNotices(fetchedNotices);

        // Latest notices
        const latest = [
          fetchedNotices.academic[0],
          fetchedNotices.administrative[0],
          fetchedNotices.extracurricular[0],
        ].filter(notice => notice);
        setLatestNotices(latest);

        // Initial filtered notices
        setFilteredNotices(fetchedNotices[activeCategory]);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };

    fetchNotices();
  }, [backendUrl]);

  // Filter notices
  useEffect(() => {
    const filtered = notices[activeCategory].filter(notice =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotices(filtered);
  }, [activeCategory, searchTerm, notices]);

  // Handle PDF download
  const handleDownload = (pdfPath) => {
    const link = document.createElement('a');
    link.href = `${backendUrl}${pdfPath}`;
    link.download = pdfPath.split('/').pop();
    link.click();
  };

  return (
    <>
      <Header
        title="Notice Board"
        tagline="Stay updated with the latest institutional announcements"
      />
      <div className="notices-page">
        {/* Marquee Section */}
        <div className="marquee-section">
          <div className="marquee-container">
            <div className="marquee">
              {latestNotices.map(notice => (
                <span key={notice.id} className="marquee-item">
                  <Bell size={14} /> {notice.title} -{' '}
                  {new Date(notice.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="notices-controls">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search notices by title or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="category-filters">
            {Object.keys(notices).map(category => (
              <button
                key={category}
                className={`category-filter ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        <div className="notices-grid">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice, index) => (
              <div
                key={notice.id}
                className="notice-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="notice-header">
                  <h3>{notice.title}</h3>
                  <div className="notice-date">
                    <Calendar size={16} />
                    <span>
                      {new Date(notice.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <div className="notice-body">
                  <p>{notice.description}</p>
                  {notice.pdf && (
                    <button
                      className="download-button"
                      onClick={() => handleDownload(notice.pdf)}
                    >
                      <Download size={16} />
                      Download PDF
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-notices">
              <Bell size={24} />
              <p>No notices available in this category.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notices;