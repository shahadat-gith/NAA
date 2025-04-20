import cron from "node-cron";
import { teacherModel, teacherTransactionModel } from "../models/teacherModel.js"; // Adjust path

const updateDueBalanceJob = () => {
  cron.schedule("0 0 0 1 * *", async () => { 
    
    console.log("Running due balance update job at", new Date().toISOString());

    try {
      const teachers = await teacherModel.find({});
      const currentDate = new Date();
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const lastMonthKey = `${lastMonth.getFullYear()}-${(lastMonth.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      console.log(`Checking payments for ${lastMonthKey}`);

      for (const teacher of teachers) {
        // Check for any existing transaction for this month
        const existingTransaction = await transactionModel.findOne({
          teacherId: teacher._id,
          paymentMonth: lastMonthKey,
          status: { $in: ["Successful", "Pending"] },
        });

        if (!existingTransaction) {
          // No transaction exists, update dueBalance and create a Pending transaction
          const oldDueBalance = teacher.dueBalance;
          teacher.dueBalance += teacher.salary;
          const transaction = new transactionModel({
            teacherId: teacher._id,
            amount: teacher.salary,
            description: `Salary for ${lastMonth.toLocaleString("default", { month: "long" })} ${lastMonth.getFullYear()}`,
            status: "Pending",
            paymentMonth: lastMonthKey,
          });
          await transaction.save();
          teacher.transactions.push(transaction._id);
          await teacher.save();

          console.log(
            `Updated dueBalance for ${teacher.name} (ID: ${teacher._id}) from ₹${oldDueBalance} to ₹${teacher.dueBalance} and added Pending transaction for ${lastMonthKey}`
          );
        } else {
          console.log(
            `${teacher.name} (ID: ${teacher._id}) already has a ${existingTransaction.status} transaction for ${lastMonthKey}, dueBalance unchanged at ₹${teacher.dueBalance}`
          );
        }
      }

      console.log("Due balance update job completed successfully");
    } catch (error) {
      console.error("Error in due balance update job:", error.message);
    }
  });
};

export { updateDueBalanceJob };