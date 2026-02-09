import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Helmet } from 'react-helmet-async';
import './Teachers.css';
import { TeacherCard } from './TeacherCard';

const Teachers = () => {
  const { teachers } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    // If search is empty, show everyone
    if (!term) return teachers;

    return teachers.filter((teacher) =>
      teacher.name?.toLowerCase().includes(term)
    );
  }, [teachers, searchTerm]);

  return (
    <div className="te-teacher-page">
      <Helmet>
        <title>Our Teachers | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Meet the experienced and dedicated teaching staff of Nashib Ali Academy."
        />
      </Helmet>

      {/* Hero & Search Section */}
      <section className="te-teacher-hero">
        <div className="te-container te-teacher-hero-inner">
          <div className="te-teacher-hero-content">
            <p className="te-teacher-kicker">Our Faculty</p>
            <h1 className="te-teacher-title">Teachers Who Shape Futures</h1>
          </div>

          <div className="te-teacher-search-card">
            <label className="te-teacher-search-label" htmlFor="teacher-search">
              Search teachers
            </label>
            <div className="te-teacher-search">
              <input
                id="teacher-search"
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="te-search-input"
              />
              {searchTerm && (
                <button
                  className="te-search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <div className="te-teacher-search-meta">
              <span>{filteredTeachers.length} teachers found</span>
              <span>
                {searchTerm
                  ? `Filtered by "${searchTerm}"`
                  : 'Search by teacher name'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="te-teacher-directory">
        <div className="te-container">
          {filteredTeachers.length > 0 ? (
            <div className="te-teachers-grid">
              {filteredTeachers.map((teacher, index) => (
                <TeacherCard key={teacher.id || index} teacher={teacher} />
              ))}
            </div>
          ) : (
            <div className="te-no-results">
              <h3>No teachers found</h3>
              <p>Try a different search term like "Science" or "English".</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Teachers;