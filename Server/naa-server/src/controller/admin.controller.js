import Student from '../models/Student/student.js';
import Admission from '../models/Student/admission.js';
import Result from '../models/Student/result.js';

import { teacherModel } from "../models/Academic/teacher.js";
import Achievers from '../models/Academic/achievers.js';
import gallery from '../models/Academic/gallery.js';
import { authorityModel } from '../models/Academic/authorities.js';

import AdmitCard from '../models/Settings/admitcard.js';
import Exam from '../models/Settings/exam.js';
import HeroImage from '../models/Settings/heroImages.js';
import services from '../models/Settings/services.js';
import FeesSettings from '../models/Settings/fees.js';





export const initialData = async (req, res) => {

    try {
        const [students, admissions, results, teachers, achievers, galleries, authorities, admitCards, exams, heroImages, serviceSettings, feesSettings] = await Promise.all([
            Student.find({}).exec(),
            Admission.find({}).exec(),
            Result.find({}).exec(),
            teacherModel.find({}).exec(),
            Achievers.find({}).exec(),
            gallery.find({}).exec(),
            authorityModel.find({}).exec(),
            AdmitCard.find({}).exec(),
            Exam.find({}).exec(),
            HeroImage.find({}).exec(),
            services.find({}).exec(),
            FeesSettings.find({}).exec()
        ]);
        res.status(200).json({
            success: true,

            data: {
                students,
                admissions,
                results,
                teachers,
                achievers,
                galleries,
                authorities,
                admitCards,
                exams,
                heroImages,
                serviceSettings,
                feesSettings
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch initial data' });
    }
};


