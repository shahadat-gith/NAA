import TeacherPayment from "../models/Teacher/payment.js";
import TeacherDues from "../models/Teacher/dues.js";
import StudentPayment from "../models/Student/payment.js";
import { teacherModel } from "../models/Teacher/teacher.js";

export const paymentDashboardData = async (req, res) => {
  try {
    const [studentStats,teacherStats,teacherDues,teacherDuesList] = await Promise.all([

      // STUDENT PAYMENTS (INFLOW)
      StudentPayment.aggregate([
        {
          $facet: {
            overview: [
              {
                $group: {
                  _id: null,
                  totalReceived: {
                    $sum: { $cond: [{ $eq: ["$status", "Paid"] }, "$amount", 0] }
                  },
                  totalPending: {
                    $sum: { $cond: [{ $eq: ["$status", "Pending"] }, "$amount", 0] }
                  }
                }
              }
            ],
            monthlyCollection: [
              { $match: { status: "Paid" } },
              {
                $group: {
                  _id: { $dateToString: { format: "%Y-%m", date: "$paymentDate" } },
                  amount: { $sum: "$amount" }
                }
              },
              { $sort: { _id: 1 } }
            ],
            recentPayments: [
              { $sort: { paymentDate: -1 } },
              { $limit: 10 },
              {
                $lookup: {
                  from: "students",
                  localField: "student",
                  foreignField: "_id",
                  as: "student"
                }
              },
              {
                $unwind: {
                  path: "$student",
                  preserveNullAndEmptyArrays: true
                }
              }
            ]
          }
        }
      ]),

      // TEACHER PAYMENTS (OUTFLOW)
      TeacherPayment.aggregate([
        {
          $facet: {
            overview: [
              { $match: { status: "Paid" } },
              {
                $group: {
                  _id: null,
                  totalPaid: { $sum: "$amount" }
                }
              }
            ],
            monthlySalary: [
              { $match: { status: "Paid" } },
              {
                $group: {
                  _id: "$salaryMonth",
                  amount: { $sum: "$amount" }
                }
              },
              { $sort: { _id: 1 } }
            ],
            recentPayments: [
              { $sort: { paymentDate: -1 } },
              { $limit: 10 },
              {
                $lookup: {
                  from: "teachers",
                  localField: "teacher",
                  foreignField: "_id",
                  as: "teacher"
                }
              },
              {
                $unwind: {
                  path: "$teacher",
                  preserveNullAndEmptyArrays: true
                }
              }
            ]
          }
        }
      ]),

      // TOTAL DUES
      TeacherDues.aggregate([
        {
          $group: {
            _id: null,
            totalDue: { $sum: "$totalDue" }
          }
        }
      ]),

      // TEACHER DUES LIST
      teacherModel.aggregate([
        {
          $lookup: {
            from: "teacherdues",
            localField: "_id",
            foreignField: "teacher",
            as: "due"
          }
        },
        {
          $unwind: {
            path: "$due",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            name: 1,
            email: 1,
            image: 1,
            contact: 1,
            totalDue: { $ifNull: ["$due.totalDue", 0] },
            dueMonths: { $ifNull: ["$due.dueMonths", []] }
          }
        },
        { $sort: { totalDue: -1 } }
      ])
    ]);

    // =========================
    // EXTRACT DATA
    // =========================
    const studentData = studentStats[0];
    const teacherData = teacherStats[0];

    const totalIncome = studentData?.overview[0]?.totalReceived || 0;
    const totalPendingFees = studentData?.overview[0]?.totalPending || 0;
    const totalExpense = teacherData?.overview[0]?.totalPaid || 0;
    const totalTeacherDue = teacherDues[0]?.totalDue || 0;
    const balance = totalIncome - totalExpense;

    // =========================
    // RESPONSE
    // =========================
    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      dashboard: {
        stats: {
          totalIncome,
          totalExpense,
          totalPendingFees,
          totalTeacherDue,
          balance
        },
        income: {
          monthlyCollection: studentData?.monthlyCollection || [],
          recentPayments: studentData?.recentPayments || []
        },
        expense: {
          monthlySalary: teacherData?.monthlySalary || [],
          recentPayments: teacherData?.recentPayments || []
        },
        teacherDues: teacherDuesList
      }
    });

  } catch (error) {
    console.log("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
      error: error.message
    });
  }
};


export const teacherCashPayment = async (req, res) => {
  try {
    const { teacherId, amount, salaryMonth } = req.body;

    // 1. Basic field payload validations
    if (!teacherId || !amount || !salaryMonth) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: teacherId, amount, and salaryMonth are mandatory.",
      });
    }

    const paymentAmount = Number(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be a valid positive number.",
      });
    }

    // 2. Fetch the master dues tracking record for this teacher
    const duesRecord = await TeacherDues.findOne({ teacher: teacherId });
    if (!duesRecord) {
      return res.status(404).json({
        success: false,
        message: "No dues profile configuration found for this teacher.",
      });
    }

    // Find the targeted month subdocument from our array structure
    const monthDueIndex = duesRecord.dueMonths.findIndex(m => m.month === salaryMonth);
    if (monthDueIndex === -1) {
      return res.status(400).json({
        success: false,
        message: `No outstanding dues discovered matching the month: ${salaryMonth}.`,
      });
    }

    const currentMonthDueAmount = duesRecord.dueMonths[monthDueIndex].amount;

    // 3. Safety Gate: Make sure the admin isn't overpaying what is owed for that month
    if (paymentAmount > currentMonthDueAmount) {
      return res.status(400).json({
        success: false,
        message: `Overpayment Error. You are trying to pay ₹${paymentAmount}, but only ₹${currentMonthDueAmount} remains due for ${salaryMonth}.`,
      });
    }

    // 4. Determine if this processing represents a Partial or Full settlement
    let updatedDues;
    const isPartialPayment = paymentAmount < currentMonthDueAmount;

    if (isPartialPayment) {
      // 🔸 PARTIAL PAYMENT FLOW: Modify the subdocument element balance matching the index
      updatedDues = await TeacherDues.findOneAndUpdate(
        { 
          teacher: teacherId, 
          "dueMonths.month": salaryMonth // Target the exact month inside the array
        },
        {
          $inc: { 
            totalDue: -paymentAmount,               // Decrease overall master global due tracking balance
            "dueMonths.$.amount": -paymentAmount    // Decrease the nested month amount balance dynamically using '$' positional placeholder
          }
        },
        { new: true }
      );
    } else {
      // 🔹 FULL PAYMENT FLOW: Remove the entire subdocument row since the month is now completely settled
      updatedDues = await TeacherDues.findOneAndUpdate(
        { teacher: teacherId },
        {
          $pull: { dueMonths: { month: salaryMonth } },
          $inc: { totalDue: -paymentAmount }
        },
        { new: true }
      );
    }

    // 5. Create and save the formal cash voucher record
    const cashPaymentRecord = new TeacherPayment({
      teacher: teacherId,
      amount: paymentAmount,
      salaryMonth,
      paymentMethod: "Cash",
      status: "Paid",
      paymentDate: new Date(),
    });
    await cashPaymentRecord.save();

    return res.status(201).json({
      success: true,
      message: `Payment recorded!`,
      paymentRecord: cashPaymentRecord,
      remainingDues: updatedDues,
    });

  } catch (error) {
    console.error("Error inside teacherCashPayment partial system engine:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred!Failed to process the cash payment transaction.",
      error: error.message,
    });
  }
};



export const createDuesForTeacher = async (req, res) => {
  try {
    const { teacherId, month, amount } = req.body;

    // 1. Validate mandatory incoming fields
    if (!teacherId || !month || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: teacherId, month, and amount are mandatory.",
      });
    }

    const assignedAmount = Number(amount);
    if (isNaN(assignedAmount) || assignedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Due amount must be a valid positive number.",
      });
    }

    // 2. Safety Check: Verify that the teacher actually exists in the core system roster
    const targetTeacherProfile = await teacherModel.findById(teacherId);
    if (!targetTeacherProfile) {
      return res.status(404).json({
        success: false,
        message: "Operation aborted. No active teacher profile discovered matching the provided ID.",
      });
    }

    // 3. ATOMIC PROCESS STEP A: Try updating an existing month subdocument element entry
    // This updates the nested month array balance AND master total balance simultaneously
    let updatedDuesDocument = await TeacherDues.findOneAndUpdate(
      { 
        teacher: teacherId, 
        "dueMonths.month": month // Looking for a match for this specific month inside the sub-array
      },
      {
        $inc: { 
          totalDue: assignedAmount,
          "dueMonths.$.amount": assignedAmount // Positional operator increases the amount inside the matched month object
        }
      },
      { new: true } // Returns the newly modified state
    );

    // 4. ATOMIC PROCESS STEP B: If Step A returned null, it means this month doesn't exist yet!
    if (!updatedDuesDocument) {
      // Use upsert to cleanly handle the creation of the parent document if it's the teacher's very first liability entry
      updatedDuesDocument = await TeacherDues.findOneAndUpdate(
        { teacher: teacherId },
        {
          $inc: { totalDue: assignedAmount },
          $push: { 
            dueMonths: { 
              month, 
              amount: assignedAmount,
            } 
          }
        },
        { new: true, upsert: true } // upsert: true ensures document creation if completely absent
      );
    }

    return res.status(200).json({
      success: true,
      message: `Dues updated successfully! `,
      duesRecord: updatedDuesDocument
    });

  } catch (error) {
    console.error("Failure inside createDuesForTeacher controller:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server Error",
      error: error.message,
    });
  }
};




