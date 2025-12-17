import Result from "../models/Student/result.js";


export const calculateClassRanks = async ({ academicSession, examName, resultClass }) => {
  try {
    // 1. Fetch relevant results
    const results = await Result.find({
      academicSession,
      examName,
      class: resultClass,
    });

    if (!results || results.length === 0) return;

    // 2. Map results with their calculated totals
    const resultsWithTotals = results.map((res) => {
      const totalMarks = res.marks.reduce(
        (sum, m) => sum + Number(m.marksObtained || 0), 
        0
      );
      return {
        _id: res._id,
        totalMarks,
      };
    });

    // 3. Sort by total marks Descending
    resultsWithTotals.sort((a, b) => b.totalMarks - a.totalMarks);

    // 4. Prepare Bulk Operations
    const bulkOps = [];
    let currentRank = 0;
    let lastTotal = null;

    resultsWithTotals.forEach((res, index) => {
      // Logic for handling ties (e.g., two students with 450 marks both get Rank 1)
      if (lastTotal === null || res.totalMarks < lastTotal) {
        currentRank = index + 1;
      }
      
      bulkOps.push({
        updateOne: {
          filter: { _id: res._id },
          update: { $set: { rank: currentRank } },
        },
      });

      lastTotal = res.totalMarks;
    });

    // 5. Execute all updates in ONE database call
    if (bulkOps.length > 0) {
      await Result.bulkWrite(bulkOps);
    }
  } catch (error) {
    console.error("Error calculating class ranks:", error);
    throw error;
  }
};