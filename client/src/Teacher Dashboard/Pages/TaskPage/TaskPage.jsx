

import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../context/UserContext';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './TaskPage.css';
import TaskSummary from './TaskSummary';
import TasksFilter from './TasksFilter';
import TaskList from './TaskList';


// Dummy data for tasks
export const dummyTasks = [
    {
        _id: '1',
        taskName: 'Prepare Quarterly Assessment',
        taskDescription: 'Create end-of-quarter assessment tests for Grade 10 Mathematics. Include chapters 5-8 with both multiple choice and long-form questions.',
        dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'Pending',
        assignedBy: 'Principal Johnson',
        createdAt: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
    {
        _id: '2',
        taskName: 'Submit Student Progress Reports',
        taskDescription: 'Complete all student progress reports for the mid-semester evaluation. Include comments on academic performance and behavior.',
        dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'In Progress',
        assignedBy: 'Vice Principal Williams',
        createdAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
        _id: '3',
        taskName: 'Update Lesson Plans',
        taskDescription: 'Review and update lesson plans for the upcoming semester based on curriculum changes.',
        dueDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: 'Pending',
        assignedBy: 'Department Head Smith',
        createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
        _id: '4',
        taskName: 'Attend Professional Development Workshop',
        taskDescription: 'Participate in the "Modern Teaching Methods" workshop and prepare a summary report for department meeting.',
        dueDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'Pending',
        assignedBy: 'Principal Johnson',
        createdAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
        _id: '5',
        taskName: 'Review Textbook Selection',
        taskDescription: 'Review proposed textbooks for next academic year and provide recommendations based on curriculum requirements.',
        dueDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        status: 'Completed',
        completedAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        assignedBy: 'Curriculum Committee',
        createdAt: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        file: 'textbook_review.pdf',
        fileName: 'Textbook Review Report.pdf'
    }
];


const TaskPage = () => {
    const { teacherData: teacher, teacherToken } = useContext(UserContext);
    const { backendUrl } = useContext(AppContext);

    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('dueDate');
    const [sortOrder, setSortOrder] = useState('asc');
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    // Fetch tasks from backend
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${backendUrl}/api/task/get-tasks/${teacher._id}`, {
                    headers: { Authorization: `Bearer ${teacherToken}` }
                });
                if (response.data.success || response.data.sucess) {
                    // Map backend tasks to frontend format
                    const formattedTasks = response.data.tasks.map(task => ({
                        _id: task._id,
                        taskName: task.taskName,
                        taskDescription: task.taskDescription,
                        dueDate: new Date(task.dueDate),
                        status: task.isCompleted ? 'Completed' : 'Pending',
                        assignedBy: task.assignedBy,
                        createdAt: new Date(task.createdAt),
                        file: task.uploadedFile || null,
                        fileName: task.uploadedFile ? task.uploadedFile.split('/').pop() : null,
                        completedAt: task.isCompleted ? new Date() : null
                    }));
                    setTasks(formattedTasks);
                } else {
                    toast.error(response.data.message || 'Failed to load tasks.');
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error fetching tasks.');
                console.error('Fetch Tasks Error:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [teacher, teacherToken, backendUrl]);

    const handleFileUpload = async (taskId, event) => {
        const file = event.target.files[0];
        if (!file) return;

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error('File size exceeds 10MB limit');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const toastId = toast.loading('Uploading file...');
            const response = await axios.put(
                `${backendUrl}/api/task/update-task?teacherId=${teacher._id}&taskId=${taskId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${teacherToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            if (response.data.success) {
                const updatedTasks = tasks.map(task =>
                    task._id === taskId ? {
                        ...task,
                        file: response.data.updatedTask.tasks.find(t => t._id === taskId).uploadedFile,
                        fileName: file.name
                    } : task
                );
                setTasks(updatedTasks);
                toast.success('File uploaded successfully!', { id: toastId });
            } else {
                toast.error(response.data.message || 'File upload failed.', { id: toastId });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error uploading file.', { id: toastId });
            console.error('File Upload Error:', error);
        }
    };

    const handleTaskCompletion = async (taskId) => {
        try {
            const toastId = toast.loading('Marking task as complete...');
            const response = await axios.put(
                `${backendUrl}/api/task/update-task?teacherId=${teacher._id}&taskId=${taskId}`,
                { isCompleted: true },
                {
                    headers: {
                        Authorization: `Bearer ${teacherToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
           
            if (response.data.success) {
                const updatedTasks = tasks.map(task =>
                    task._id === taskId ? {
                        ...task,
                        status: 'Completed',
                        completedAt: new Date()
                    } : task
                );
                setTasks(updatedTasks);
                toast.success('Task marked as complete!', { id: toastId });
            } else {
                toast.error(response.data.message || 'Failed to update task status.', { id: toastId });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error marking task as complete.');
            console.error('Task Completion Error:', error);
        }
    };

    const handleSearchTasks = (e) => {
        setSearchQuery(e.target.value);
    };

    const toggleExpandTask = (taskId) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Filter and sort tasks
    const filteredTasks = tasks.filter(task => {
        const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
        const matchesSearch =
            searchQuery === '' ||
            task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.taskDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.assignedBy.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    }).sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
            case 'dueDate':
                comparison = new Date(a.dueDate) - new Date(b.dueDate);
                break;
            case 'taskName':
                comparison = a.taskName.localeCompare(b.taskName);
                break;
            case 'status':
                comparison = a.status.localeCompare(b.status);
                break;
            case 'createdAt':
                comparison = new Date(a.createdAt) - new Date(b.createdAt);
                break;
            default:
                comparison = 0;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const getTimeRemaining = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'Overdue';
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        return `Due in ${diffDays} days`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="task-page">
           
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <h1>Your Tasks</h1>
                    <p className="subtitle">Manage and track your assigned tasks</p>
                </div>
            </div>

            <TaskSummary tasks={tasks} />

            <TasksFilter
                searchQuery={searchQuery}
                filterStatus={filterStatus}
                handleSearchTasks={handleSearchTasks}
                setFilterStatus={setFilterStatus}
                sortBy={sortBy}
                handleSort={handleSort}
                setSortOrder={setSortOrder}
                sortOrder={sortOrder}
            />

            <TaskList
                isLoading={isLoading}
                filteredTasks={filteredTasks}
                searchQuery={searchQuery}
                filterStatus={filterStatus}
                getTimeRemaining={getTimeRemaining}
                formatDate={formatDate}
                expandedTaskId={expandedTaskId}
                handleFileUpload={handleFileUpload}
                toggleExpandTask={toggleExpandTask}
                handleTaskCompletion={handleTaskCompletion}
            />
        </div>
    );
};

export default TaskPage;