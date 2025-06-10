import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, assignTaskToAllTeachers } from '../controller/taskController.js';
import { authMiddleware } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const taskRouter = express.Router();

// Create uploads/tasks directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads', 'tasks');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files to uploads/tasks
  },
  filename: (req, file, cb) => {
    // Sanitize file name and add timestamp
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}-${sanitizedFileName}`;
    cb(null, uniqueName);
  }
});



// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

taskRouter.post('/assign-task/:teacherId', authMiddleware, createTask);
taskRouter.post('/assign-task-to-all', authMiddleware, assignTaskToAllTeachers);
taskRouter.get('/get-tasks/:teacherId', getTasks);
taskRouter.put('/update-task', authMiddleware, upload.single('file'), updateTask);
taskRouter.delete('/delete-task', authMiddleware, deleteTask);

export default taskRouter;