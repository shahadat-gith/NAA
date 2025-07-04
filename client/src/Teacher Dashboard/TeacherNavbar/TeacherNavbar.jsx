import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/UserContext';
import { AppContext } from '../../context/AppContext';
import Loader from '../../components/Loader/Loader';
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword';
import './TeacherNavbar.css';

const TeacherNavbar = () => {
  const { teacherData: teacher, teacherToken, setTeacherData, clearUserData } = useContext(UserContext);
  const { backendUrl, getAllTeachers } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const mobileMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home', path: '/teacher' },
    { id: 'attendance', label: 'Attendance', icon: 'fas fa-calendar-check', path: '/teacher/attendance' },
    { id: 'salary', label: 'Transactions', icon: 'fas fa-money-check-alt', path: '/teacher/salary' },
    { id: 'bank', label: 'Bank Details', icon: 'fas fa-university', path: '/teacher/bank' },
  ];

  // Update active page based on current URL
  useEffect(() => {
    const path = location.pathname;
    const currentPage = navItems.find(item => path.includes(item.id));
    if (currentPage) {
      setActivePage(currentPage.id);
    } else if (path === '/teacher' || path === '/teacher/') {
      setActivePage('home');
    }
  }, [location.pathname]);

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsDropdownOpen(false);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const openForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or GIF).');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image file is too large. Maximum size is 10MB.');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfilePicUpdate = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);
    formData.append('teacherId', teacher._id);

    try {
      const response = await fetch(`${backendUrl}/api/teacher/update-profile-picture`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${teacherToken}` },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Profile picture updated successfully!');
        setTeacherData(data.teacher);
        getAllTeachers();
        closeProfileModal();
      } else {
        toast.error(data.message || 'Failed to update profile picture.');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Error updating profile picture. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearUserData('teacher');
    navigate('/');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  // Handle click outside to close dropdown, mobile menu, and modals
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('.tnav__hamburger')
      ) {
        setIsMobileMenuOpen(false);
      }
      if (
        isProfileModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.closest('.tnav__modal-close')
      ) {
        closeProfileModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen, isMobileMenuOpen, isProfileModalOpen]);

  // Handle ESC key to close modals and menus
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (isProfileModalOpen) closeProfileModal();
        if (isForgotPasswordModalOpen) closeForgotPasswordModal();
        if (isDropdownOpen) setIsDropdownOpen(false);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isProfileModalOpen, isForgotPasswordModalOpen, isDropdownOpen, isMobileMenuOpen]);

  // Prevent body scroll when modal or mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isProfileModalOpen || isMobileMenuOpen || isForgotPasswordModalOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isProfileModalOpen, isMobileMenuOpen, isForgotPasswordModalOpen]);

  if (!teacher) return null;

  return (
    <>
      {isLoading && <Loader message="Updating profile..." />}
      
      <nav className="tnav">
        <div className="tnav__container">
          {/* Left Section: School Logo and Name */}
          <div className="tnav__school" onClick={() => navigate('/teacher/home')}>
            <img 
              src="/logo.png" 
              alt="School Logo" 
              className="tnav__school-logo"
              onError={(e) => (e.target.src = '/default-logo.png')}
            />
            <div className="tnav__school-info">
              <h2 className="tnav__school-name">Nashib Ali Academy</h2>
              <p className="tnav__school-tagline">Educating Tomorrow's Leaders</p>
            </div>
          </div>

          {/* Center Section: Navigation Items (Desktop) */}
          <div className="tnav__items">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`tnav__item ${activePage === item.id ? 'tnav__item--active' : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                <i className={`${item.icon} tnav__item-icon`}></i>
                <span className="tnav__item-label">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Section: Teacher Info and Profile Dropdown */}
          <div className="tnav__profile">
            <div className="tnav__dropdown" ref={dropdownRef}>
              <button 
                className="tnav__dropdown-btn" 
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <img
                  src={teacher.image ? `${backendUrl}/${teacher.image}` : '/default-avatar.png'}
                  alt={teacher.name || 'Teacher'}
                  className="tnav__profile-photo"
                  onError={(e) => (e.target.src = '/default-avatar.png')}
                />
                <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} tnav__dropdown-icon`}></i>
              </button>
              
              {isDropdownOpen && (
                <div className="tnav__dropdown-menu">
                  <button className="tnav__dropdown-item" onClick={openProfileModal}>
                    <i className="fas fa-camera tnav__dropdown-item-icon"></i> 
                    <span>Change Profile Picture</span>
                  </button>
                  <button className="tnav__dropdown-item" onClick={openForgotPasswordModal}>
                    <i className="fas fa-lock tnav__dropdown-item-icon"></i> 
                    <span>Change Password</span>
                  </button>
                  <div className="tnav__dropdown-divider"></div>
                  <button className="tnav__dropdown-item tnav__dropdown-item--logout" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt tnav__dropdown-item-icon"></i> 
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger Menu for Mobile */}
            <button
              className="tnav__hamburger"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Toggle menu</span>
              <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`tnav__mobile-menu ${isMobileMenuOpen ? 'tnav__mobile-menu--open' : ''}`}
          ref={mobileMenuRef}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="tnav__mobile-header">
            <div className="tnav__mobile-teacher">
              <img
                src={teacher.image ? `${backendUrl}/${teacher.image}` : '/default-avatar.png'}
                alt={teacher.name || 'Teacher'}
                className="tnav__mobile-photo"
                onError={(e) => (e.target.src = '/default-avatar.png')}
              />
            </div>
          </div>
          
          <div className="tnav__mobile-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`tnav__mobile-item ${activePage === item.id ? 'tnav__mobile-item--active' : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                <i className={`${item.icon} tnav__mobile-item-icon`}></i>
                <span className="tnav__mobile-item-label">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="tnav__mobile-actions">
            <button className="tnav__mobile-action" onClick={openProfileModal}>
              <i className="fas fa-camera tnav__mobile-action-icon"></i>
              <span>Change Profile Picture</span>
            </button>
            <button className="tnav__mobile-action" onClick={openForgotPasswordModal}>
              <i className="fas fa-lock tnav__mobile-action-icon"></i>
              <span>Change Password</span>
            </button>
            <button className="tnav__mobile-action tnav__mobile-action--logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt tnav__mobile-action-icon"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Picture Update Modal */}
      {isProfileModalOpen && (
        <div className="tnav__modal-overlay">
          <div className="tnav__modal" ref={modalRef}>
            <div className="tnav__modal-header">
              <h3 className="tnav__modal-title">Update Profile Picture</h3>
              <button className="tnav__modal-close" onClick={closeProfileModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="tnav__modal-body">
              <div className="tnav__modal-preview">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="tnav__modal-preview-image" 
                  />
                ) : (
                  <img
                    src={teacher.image ? `${backendUrl}/${teacher.image}` : '/default-avatar.png'}
                    alt={teacher.name || 'Teacher'}
                    className="tnav__modal-current-image"
                    onError={(e) => (e.target.src = '/default-avatar.png')}
                  />
                )}
              </div>
              
              <div className="tnav__modal-upload">
                <input
                  type="file"
                  id="profile-pic-input"
                  className="tnav__modal-file-input"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleFileSelect}
                />
                <label htmlFor="profile-pic-input" className="tnav__modal-file-label">
                  <i className="fas fa-upload tnav__modal-file-icon"></i>
                  <span>Choose Image</span>
                </label>
                <p className="tnav__modal-file-info">
                  Maximum file size: 10MB <br />
                  Supported formats: JPEG, PNG, GIF
                </p>
              </div>
            </div>
            
            <div className="tnav__modal-footer">
              <button className="tnav__modal-btn tnav__modal-btn--cancel" onClick={closeProfileModal}>
                Cancel
              </button>
              <button 
                className="tnav__modal-btn tnav__modal-btn--save" 
                onClick={handleProfilePicUpdate}
                disabled={!selectedFile}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      <ForgotPassword 
        isOpen={isForgotPasswordModalOpen} 
        onClose={closeForgotPasswordModal} 
      />
    </>
  );
};

export default TeacherNavbar;