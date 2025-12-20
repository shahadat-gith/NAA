import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header/Header';
import Pagination from '../../components/Pagination/Pagination';
import TeacherCard from './Components/TeacherCard';
import TeacherListItem from './Components/TeacherListItem';
import SearchFilterBar from './Components/SearchFilterBar';
import ResultsInfo from './Components/ResultsInfo';
import './Staff.css';
import { Helmet } from 'react-helmet-async';

const Staff = () => {
  const { teachers } = useContext(AppContext);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [paginatedTeachers, setPaginatedTeachers] = useState([]);

  // Extract unique subjects from subjectClassMappings
  const subjects = useMemo(() => {
    const allSubjects = teachers.flatMap((t) => t.subjectClassMappings.map((m) => m.subject));
    return ['All', ...new Set(allSubjects)];
  }, [teachers]);

  const sortTeachers = (list) => {
    return [...list].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === 'subject') {
        const subjectA = a.subjectClassMappings[0]?.subject || '';
        const subjectB = b.subjectClassMappings[0]?.subject || '';
        return sortOrder === 'asc'
          ? subjectA.localeCompare(subjectB)
          : subjectB.localeCompare(subjectA);
      }
      if (sortBy === 'experience') {
        const expA = Number(a.experience) || 0;
        const expB = Number(b.experience) || 0;
        return sortOrder === 'asc' ? expA - expB : expB - expA;
      }
      return 0;
    });
  };

  const filteredTeachers = useMemo(() => {
    return sortTeachers(
      teachers
        .filter((t) =>
          selectedSubject === 'All'
            ? true
            : t.subjectClassMappings.some((m) => m.subject === selectedSubject)
        )
        .filter((t) =>
          [t.name, ...t.subjectClassMappings.map((m) => m.subject)].some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
    );
  }, [teachers, selectedSubject, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    setPaginatedTeachers(filteredTeachers.slice(0, viewMode === 'grid' ? 4 : 5));
  }, [viewMode, filteredTeachers]);

  const handlePageDataChange = useCallback((currentItems) => {
    setPaginatedTeachers(currentItems);
    document.querySelector('.teachers-grid')?.scrollIntoView({ behavior: 'smooth' });
    document.querySelector('.teachers-list')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const resetFilters = () => {
    setSelectedSubject('All');
    setSearchTerm('');
    setSortBy('name');
    setSortOrder('asc');
    setPaginatedTeachers(filteredTeachers.slice(0, viewMode === 'grid' ? 3 : 4));
  };

  const itemsPerPage = viewMode === 'grid' ? 3 : 4;

  return (
    <div className="staff-page">
      <Helmet>
        <title>Our Staff | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Meet the experienced and dedicated teaching staff of Nashib Ali Academy in Barpeta, Assam, committed to quality education and student development."
        />
      </Helmet>
      <Header
        title="Our Expert Educators"
        tagline="Meet the dedicated professionals shaping tomorrow's leaders"
      />
      <section className="staff-directory">
        <div className="container">
          <div className="directory-header">
            <h2 className="section-title">Staff Directory</h2>
            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i> List
              </button>

              <button
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <i className="fas fa-th"></i> Grid
              </button>

            </div>
          </div>

          <SearchFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            subjects={subjects}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            resetFilters={resetFilters}
          />

          <ResultsInfo
            currentTeachers={paginatedTeachers}
            filteredTeachers={filteredTeachers}
            selectedSubject={selectedSubject}
            searchTerm={searchTerm}
          />

          {filteredTeachers.length > 0 ? (
            <>
              <div className={`teachers-${viewMode}`}>
                {paginatedTeachers.map((teacher, index) =>
                  viewMode === 'grid' ? (
                    <TeacherCard key={index} teacher={teacher} />
                  ) : (
                    <TeacherListItem key={index} teacher={teacher} index={index} />
                  )
                )}
              </div>
              <Pagination
                items={filteredTeachers}
                onPageDataChange={handlePageDataChange}
                itemsPerPage={itemsPerPage}
              />
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <i className="fas fa-frown fa-3x"></i>
              </div>
              <h3>No teachers found</h3>
              <p>We couldn't find any teachers</p>
              <button className="reset-all-btn" onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Staff;