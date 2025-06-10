import React, { useState, useContext } from 'react';
import './AddEvents.css';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddEvents = () => {
  const [formdata, setFormdata] = useState({
    title: '',
    date: '',
    time: ''
  });

  const [loading, setLoading] = useState(false);

  const { backendUrl, adminToken } = useContext(AdminContext);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(backendUrl)

    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/add-event`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response)

      if(response.data.success){
        toast.success('Event added successfully!');
      }
      setFormdata({ title: '', date: '', time: '' });
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="events-form-container">
      <div className="event-title">
        <h2>Schedule An Event</h2>
      </div>
      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Name<span>*</span></label>
          <input
            type="text"
            id="title"
            placeholder="Type Event Name"
            required
            value={formdata.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Event Date<span>*</span></label>
          <input
            type="date"
            id="date"
            required
            value={formdata.date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Event Time<span>*</span></label>
          <input
            type="time"
            id="time"
            required
            value={formdata.time}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
};

export default AddEvents;
