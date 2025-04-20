import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header/Header';
import Pagination from '../../components/Pagination/Pagination';
import TeacherCard from './Components/TeacherCard';
import TeacherListItem from './Components/TeacherListItem';
import SearchFilterBar from './Components/SearchFilterBar';
import ResultsInfo from './Components/ResultsInfo';
import './Staff.css';

const Staff = () => {
  const { teachers } = useContext(AppContext);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [paginatedTeachers, setPaginatedTeachers] = useState([]);

  const departments = ['All', ...new Set(teachers.map((t) => t.department))];


  const sortTeachers = (list) => {
    return [...list].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === 'department') {
        return sortOrder === 'asc'
          ? a.department.localeCompare(b.department)
          : b.department.localeCompare(a.department);
      }
      if (sortBy === 'experience') {
        const expA = parseInt(a.experience) || 0;
        const expB = parseInt(b.experience) || 0;
        return sortOrder === 'asc' ? expA - expB : expB - expA;
      }
      return 0;
    });
  };

  const filteredTeachers = useMemo(() => {
    return sortTeachers(
      teachers
        .filter((t) =>
          selectedDepartment === 'All' ? true : t.department === selectedDepartment
        )
        .filter((t) =>
          [t.name, t.subject, t.department].some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
    );
  }, [teachers, selectedDepartment, searchTerm, sortBy, sortOrder]);

    // Reset pagination when viewMode or filteredTeachers change
    useEffect(() => {
      setPaginatedTeachers(filteredTeachers.slice(0, viewMode === 'grid' ? 4 : 5));
    }, [viewMode, filteredTeachers]);
  
  const handlePageDataChange = useCallback((currentItems) => {
    setPaginatedTeachers(currentItems);
    document.querySelector('.teachers-grid')?.scrollIntoView({ behavior: 'smooth' });
    document.querySelector('.teachers-list')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const resetFilters = () => {
    setSelectedDepartment('All');
    setSearchTerm('');
    setSortBy('name');
    setSortOrder('asc');
    setPaginatedTeachers(filteredTeachers.slice(0, viewMode === 'grid' ? 3 : 4));
  };

  const itemsPerPage = viewMode === 'grid' ? 3 : 4;

  return (
    <div className="staff-page">
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
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <i className="fas fa-th"></i> Grid
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i> List
              </button>
            </div>
          </div>

          <SearchFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            departments={departments}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            resetFilters={resetFilters}
          />

          <ResultsInfo
            currentTeachers={paginatedTeachers}
            filteredTeachers={filteredTeachers}
            selectedDepartment={selectedDepartment}
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
              <p>We couldn't find any teachers matching your criteria</p>
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