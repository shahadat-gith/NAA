import React, { useContext, useState } from 'react';
import { TeacherContext } from '../../context/TeacherContext';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './TaskManager.css';
import { useNavigate } from 'react-router-dom';

const TaskManager = () => {
    const { backendUrl, teachers } = useContext(TeacherContext);
    const { adminToken } = useContext(AdminContext);
    const navigate = useNavigate();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isAssignToAll, setIsAssignToAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [taskForm, setTaskForm] = useState({
        taskName: '',
        taskDescription: '',
        dueDate: '',
        priority: 'medium',
        assignedBy: 'Principal Johnson'
    });

    const priorityOptions = ['low', 'medium', 'high'];
    const assignedByOptions = ['Principal', 'Exam IC', 'Managing Director'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAssignTask = (teacher = null) => {
        setSelectedTeacher(teacher);
        setShowTaskForm(true);
    };

    const handleAssignToAll = () => {
        setIsAssignToAll(true);
        setShowTaskForm(true);
    };

    const closeTaskForm = () => {
        setShowTaskForm(false);
        setSelectedTeacher(null);
        setIsAssignToAll(false);
        setTaskForm({
            taskName: '',
            taskDescription: '',
            dueDate: '',
            priority: 'medium',
            assignedBy: 'Principal Johnson'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!taskForm.taskName || !taskForm.taskDescription || !taskForm.dueDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Assigning task...');

        const headers = {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
        };

        try {
            let response;
            if (isAssignToAll) {
                response = await axios.post(`${backendUrl}/api/task/assign-task-to-all`, taskForm, { headers });
            } else {
                response = await axios.post(`${backendUrl}/api/task/assign-task/${selectedTeacher._id}`, taskForm, { headers });
            }
            console.log('Assign Task Response:', response.data); // Debug
            if (response.data.success) {
                toast.success(isAssignToAll 
                    ? 'Task assigned to all teachers successfully!' 
                    : `Task assigned to ${selectedTeacher.name} successfully!`, 
                    { id: toastId }
                );
                closeTaskForm();
            } else {
                toast.error(response.data.message || 'Failed to assign task.', { id: toastId });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error assigning task.', { id: toastId });
            console.error('Assign Task Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenTasks = (teacher) => {
        console.log('Navigating with teacherId:', teacher._id); // Debug
        navigate(`/tasks-info/${teacher._id}`);
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="task-manager">
            <Toaster position="top-right" toastOptions={{ style: { background: '#253650', color: '#e2e5e9' } }} />
            <div className="task-manager-header">
                <h1 className="task-manager-title">Task Manager</h1>
                <button
                    className="assign-all-btn"
                    onClick={() => handleAssignToAll()}
                >
                    ✚ Assign to All
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search teachers by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="teachers-grid">
                {filteredTeachers.length === 0 ? (
                    <div className="no-teachers">
                        <p>No teachers found</p>
                    </div>
                ) : (
                    filteredTeachers.map(teacher => (
                        <div key={teacher._id} className="teacher-card">
                            <div className="teacher-image">
                                <img
                                    src={`${backendUrl}/${teacher.image.replace("\\", "/")}`}
                                    alt={teacher.name}
                                />
                            </div>
                            <div className="teacher-info">
                                <h3 className="teacher-name">{teacher.name}</h3>
                            </div>
                            <div className="action-buttons">
                                <button
                                    className="assign-btn"
                                    onClick={() => handleOpenTasks(teacher)}
                                >
                                    Open Tasks
                                </button>
                                <button
                                    className="assign-btn"
                                    onClick={() => handleAssignTask(teacher)}
                                >
                                    Assign Task
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showTaskForm && (
                <div className="modal-overlay">
                    <div className="task-modal">
                        <div className="modal-header">
                            <h2>
                                {isAssignToAll ? 'Assign to All Teachers' : `Assign to ${selectedTeacher?.name}`}
                            </h2>
                            <button className="close-btn" onClick={closeTaskForm}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Task Name</label>
                                <input
                                    type="text"
                                    name="taskName"
                                    value={taskForm.taskName}
                                    onChange={handleInputChange}
                                    placeholder="Task name"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select
                                        name="priority"
                                        value={taskForm.priority}
                                        onChange={handleInputChange}
                                    >
                                        {priorityOptions.map(priority => (
                                            <option key={priority} value={priority}>
                                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Due Date</label>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={taskForm.dueDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="taskDescription"
                                    value={taskForm.taskDescription}
                                    onChange={handleInputChange}
                                    placeholder="Task description"
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label>Assigned By</label>
                                <select
                                    name="assignedBy"
                                    value={taskForm.assignedBy}
                                    onChange={handleInputChange}
                                >
                                    {assignedByOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={closeTaskForm}>
                                Cancel
                            </button>
                            <button
                                className="submit-btn"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Loading...' : 'Assign Task'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManager;