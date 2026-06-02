import Student from '../models/Student/student.js';
import Admission from '../models/Student/admission.js';
import Result from '../models/Student/result.js';

import Staff from '../models/Staff/staff.js'; 
import Achievers from '../models/Academic/achievers.js';
import Gallery from '../models/Academic/gallery.js';
import { authorityModel } from '../models/Academic/authorities.js';

import AdmitCard from '../models/Settings/admitcard.js';
import Exam from '../models/Settings/exam.js';
import HeroImage from '../models/Settings/heroImages.js';
import ServiceSettings from '../models/Settings/services.js';
import Fee from '../models/Settings/fees.js';
import Notice from '../models/Academic/notices.js';

// =========================================================================
// 🔄 FETCH MASTER INITIALIZATION STATE DATA DATA ARRAY (Admin Context Bootloader)
// =========================================================================
export const initialData = async (req, res) => {
  try {
    // Concurrent thread grouping query engine optimized execution
    const [
      students, 
      admissions, 
      staffs, // Renamed tracking index key array destination
      achievers, 
      galleries, 
      authorities, 
      admitCards, 
      exams, 
      heroImages, 
      serviceSettings, 
      feesSettings, 
      notices
    ] = await Promise.all([
      Student.find({}).exec(),
      Admission.find({}).exec(),
      Staff.find({}).select("-password -verificationOtp").exec(), // Clean projection added to protect credentials leaks
      Achievers.find({}).exec(),
      Gallery.find({}).exec(),
      authorityModel.find({}).exec(),
      AdmitCard.find({}).exec(),
      Exam.find({}).exec(),
      HeroImage.find({}).exec(),
      ServiceSettings.find({}).exec(),
      Fee.find({}).exec(),
      Notice.find({}).exec()
    ]);

    return res.status(200).json({
      success: true,
      data: {
        students,
        admissions,
        staffs, // Unified listing return containing both Teaching and Non-Teaching categories
        achievers,
        galleries,
        authorities,
        admitCards,
        exams,
        heroImages,
        serviceSettings,
        feesSettings,
        notices,
      }
    });

  } catch (error) {
    console.error("initialData bootloader aggregation anomaly:", error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch initial application database parameters.',
      message: error.message 
    });
  }
};