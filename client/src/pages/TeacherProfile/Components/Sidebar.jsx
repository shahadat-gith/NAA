import React, { useContext, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../../../context/AppContext';
import { UserContext } from '../../../context/UserContext';
import Loader from '../../../components/Loader/Loader';

const Sidebar = ({ teacher, backendUrl, handlePasswordChangeNavigation, handleLogout }) => {
  const fileInputRef = useRef(null);
  const { getAllTeachers } = useContext(AppContext);
  const { teacherToken, setTeacherData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfilePicButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicChange = async (event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    if (!file) {
      toast.error('No file selected.');
      setIsLoading(false);
      return;
    }

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or GIF).');
      setIsLoading(false);
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image file is too large. Maximum size is 5MB.');
      setIsLoading(false);
      return;
    }

    // Prepare FormData for API call
    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('teacherId', teacher._id);

    try {
      const response = await fetch(`${backendUrl}/api/teacher/update-profile-picture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${teacherToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Profile picture updated successfully!');
        setTeacherData(data.teacher);
        getAllTeachers();
      } else {
        toast.error(data.message || 'Failed to update profile picture.');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Error updating profile picture. Please try again.');
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = null;
    }
  };

  return (
    <>
      {isLoading && <Loader text="Updating profile..." />}
      <div className="teacher-profile-sidebar">
        <div className="teacher-profile-image-container">
          <img
            src={teacher.image ? `${backendUrl}/${teacher.image}` : '/default-avatar.png'}
            alt={teacher.name || 'Teacher'}
            className="teacher-profile-image"
            onError={(e) => (e.target.src = '/default-avatar.png')}
          />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/jpeg,image/png,image/gif"
            onChange={handleProfilePicChange}
          />
        </div>
        <h2 className="teacher-name">{teacher.name || 'N/A'}</h2>
        <p className="teacher-subject">{teacher.subject || 'N/A'}</p>
        <div className="teacher-action-buttons">
          <button
            onClick={handleProfilePicButtonClick}
            className="teacher-action-button teacher-profile-pic-button"
          >
            <i className="fas fa-camera"></i> Change Profile Picture
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/jpeg,image/png,image/gif"
            onChange={handleProfilePicChange}
          />
          <button
            onClick={handlePasswordChangeNavigation}
            className="teacher-action-button teacher-password-button"
          >
            <i className="fas fa-lock"></i> Change Password
          </button>
          <button
            onClick={handleLogout}
            className="teacher-action-button teacher-logout-button"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;