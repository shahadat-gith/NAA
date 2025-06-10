import { teacherModel } from "../models/teacherModel.js";
import fs from "fs";
import path from "path";

export const createTask = async (req, res) => {
  const { taskName, taskDescription, dueDate, priority, assignedBy } = req.body;

  try {
    const teacherId = req.params.teacherId;
    const newTask = {
      taskName,
      taskDescription,
      dueDate,
      priority,
      assignedBy,
    };

    const updatedTeacher = await teacherModel.findByIdAndUpdate(
      teacherId,
      { $push: { tasks: newTask } },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    res.status(200).json({ success: true, message: "Task assigned successfully", updatedTeacher });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const assignTaskToAllTeachers = async (req, res) => {
  const { taskName, taskDescription, dueDate, priority, assignedBy } = req.body;

  try {
    const newTask = {
      taskName,
      taskDescription,
      dueDate,
      priority,
      assignedBy,
    };

    const updatedTeachers = await teacherModel.updateMany(
      {},
      { $push: { tasks: newTask } },
      { new: true }
    );

    if (!updatedTeachers.matchedCount) {
      return res.status(404).json({ success: false, message: "No teachers found" });
    }

    res.status(200).json({ success: true, message: "Task assigned to all teachers successfully", updatedTeachers });
  } catch (error) {
    console.error("Error assigning task to all teachers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTasks = async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    res.status(200).json({ success: true, tasks: teacher.tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  const { teacherId, taskId } = req.query;
  const { isCompleted } = req.body;
  const uploadedFilePath = req.file ? `/uploads/tasks/${req.file.filename}` : null;



  try {
    const updatedTask = await teacherModel.findOneAndUpdate(
      { _id: teacherId, "tasks._id": taskId },
      {
        $set: {
          "tasks.$.isCompleted": isCompleted === 'true' ? true : isCompleted === 'false' ? false : isCompleted,
          "tasks.$.uploadedFile": uploadedFilePath
        }
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }


    res.status(200).json({ success: true, message: "Task updated successfully", updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  const { teacherId, taskId } = req.query;

  try {
    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const task = teacher.tasks.find(task => task._id.toString() === taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.uploadedFile) {
      const filePath = path.join(process.cwd(), task.uploadedFile);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting file:", err);
        }
      });
    }

    const updatedTeacher = await teacherModel.findOneAndUpdate(
      { _id: teacherId },
      { $pull: { tasks: { _id: taskId } } },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully", updatedTeacher });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};