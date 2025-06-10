import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { TeacherContext } from '../../context/TeacherContext';
import toast, { Toaster } from 'react-hot-toast';
import './TaskStats.css';

const TaskStats = () => {
    const { backendUrl, teachers, getAllTeachers } = useContext(TeacherContext);
    const { adminToken } = useContext(AdminContext);
    const { teacherId } = useParams();

    const [teacher, setTeacher] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async (id) => {
        try {
            setLoading(true);
            console.log('Fetching tasks for teacherId:', id);
            const response = await axios.get(`${backendUrl}/api/task/get-tasks/${id}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('Tasks Response:', response.data);
            if (response.data.success || response.data.sucess) {
                setTasks(response.data.tasks);
            } else {
                toast.error(response.data.message || 'Failed to fetch tasks.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching tasks.');
            console.error('Fetch Tasks Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('useEffect - teacherId:', teacherId, 'teachers:', teachers);
        if (teacherId) {
            if (teachers.length === 0) {
                console.log('Teachers empty, fetching teachers...');
                getAllTeachers();
            }
            const matchedTeacher = teachers.find(t => t._id.toString() === teacherId);
            if (matchedTeacher) {
                console.log('Matched teacher:', matchedTeacher);
                setTeacher(matchedTeacher);
                fetchTasks(teacherId);
            } else {
                console.log('No teacher matched for teacherId:', teacherId);
                toast.error('Teacher not found.');
                setTeacher(null);
            }
        } else {
            toast.error('Invalid teacher ID.');
        }
    }, [teacherId, teachers, getAllTeachers]);

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await axios.delete(
                    `${backendUrl}/api/task/delete-task?teacherId=${teacherId}&taskId=${taskId.toString()}`,
                    {
                        headers: { Authorization: `Bearer ${adminToken}` }
                    }
                );
                if (response.data.success) {
                    setTasks(tasks.filter(task => task._id.toString() !== taskId));
                    toast.success('Task deleted successfully!');
                } else {
                    toast.error(response.data.message || 'Failed to delete task.');
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error deleting task.');
                console.error('Delete Task Error:', error.message);
            }
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High': return 'priority-high';
            case 'Medium': return 'priority-medium';
            case 'Low': return 'priority-low';
            default: return 'priority-medium';
        }
    };

    const getStatusClass = (isCompleted) => {
        return isCompleted ? 'status-completed' : 'status-pending';
    };

    const isOverdue = (task) => {
        return !task.isCompleted && new Date(task.dueDate) < new Date();
    };

    const taskStats = {
        total: tasks.length,
        completed: tasks.filter(t => t.isCompleted).length,
        pending: tasks.filter(t => !t.isCompleted).length,
        overdue: tasks.filter(t => isOverdue(t)).length
    };

    return (
        <div className="task-stats">
            <div className="task-stats-header">
                <h1>Task Statistics</h1>
            </div>

            {teacher ? (
                <>
                    <div className="selected-teacher">
                        <div className="teacher-info">
                            <img
                                src={`${backendUrl}/${teacher.image.replace("\\", "/")}`}
                                alt={teacher.name}
                                className="teacher-avatar"
                            />
                            <div>
                                <h3>{teacher.name}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="stats-overview">
                        <div className="stat-card">
                            <span className="stat-number">{taskStats.total}</span>
                            <span className="stat-label">Total Tasks</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{taskStats.completed}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{taskStats.pending}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{taskStats.overdue}</span>
                            <span className="stat-label">Overdue</span>
                        </div>
                    </div>

                    <div className="tasks-container">
                        {loading ? (
                            <div className="loading">Loading tasks...</div>
                        ) : tasks.length === 0 ? (
                            <div className="no-tasks">No tasks found</div>
                        ) : (
                            <div className="tasks-grid">
                                {tasks.map(task => (
                                    <div key={task._id.toString()} className="task-card relative">
                                        {isOverdue(task) && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Overdue</span>
                                        )}
                                        <div className="task-header">
                                            <div className="task-title">{task.taskName}</div>
                                            <div className={`priority-badge ${getPriorityClass(task.priority)}`}>
                                                {task.priority}
                                            </div>
                                        </div>
                                        <div className="task-meta">
                                            <div><strong>Assigned by:</strong> {task.assignedBy}</div>
                                            <div><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</div>
                                            <div><strong>Created:</strong> {new Date(task.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div className={`task-status ${getStatusClass(task.isCompleted)}`}>
                                            {task.isCompleted ? 'Completed' : 'Pending'}
                                        </div>
                                        <div className="task-actions">
                                            <a
                                                href={task.uploadedFile ? `${backendUrl}${task.uploadedFile}` : '#'}
                                                className={`action-btn ${task.uploadedFile ? 'view' : 'view opacity-50 cursor-not-allowed'}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download={task.uploadedFile ? true : undefined}
                                                onClick={(e) => !task.uploadedFile && e.preventDefault()}
                                            >
                                                {task.uploadedFile ? 'View file' : 'No file uploaded'}
                                            </a>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDeleteTask(task._id.toString())}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="no-teacher">
                    {loading ? 'Loading tasks...' : 'Teacher not found.'}
                </div>
            )}
        </div>
    );
};

export default TaskStats;