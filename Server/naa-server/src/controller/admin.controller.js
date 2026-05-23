import Student from '../models/Student/student.js';
import Admission from '../models/Student/admission.js';
import Result from '../models/Student/result.js';

import { teacherModel } from "../models/Teacher/teacher.js";
import Achievers from '../models/Academic/achievers.js';
import Gallery from '../models/Academic/gallery.js';
import { authorityModel } from '../models/Academic/authorities.js';

import AdmitCard from '../models/Settings/admitcard.js';
import Exam from '../models/Settings/exam.js';
import HeroImage from '../models/Settings/heroImages.js';
import ServiceSettings from '../models/Settings/services.js';
import Fee from '../models/Settings/fees.js';
import Notice from '../models/Academic/notices.js';


export const initialData = async (req, res) => {

    try {
        const [students, admissions, teachers, achievers, galleries, authorities, admitCards, exams, heroImages, serviceSettings, feesSettings, notices] = await Promise.all([
            Student.find({}).exec(),
            Admission.find({}).exec(),
            teacherModel.find({}).exec(),
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
        res.status(200).json({
            success: true,

            data: {
                students,
                admissions,
                teachers,
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
        res.status(500).json({ error: 'Failed to fetch initial data' });
    }
};


