
import AddAchiver from "./AddAchiver";
import UpdateAchiver from "./UpdateAchiver";
import AdmitCardDownload from "./AdmitCardDownload";
import CurrentExamUpdate from "./CurrentExamUpdate";
import ExamRoutine from "./ExamRoutine";
import PreviewRoutine from "./PreviewRoutine";
import GalleryImageUpload from "./GalleryImageUpload";
import EditResult from "./EditResult";
import UploadResults from "./UploadResults";
import EditBannerImage from "./EditBannerImage";
import StudentImageUpload from "./StudentImageUpload";
import PromoteStudents from "./PromoteStudents";
import UpdateStudent from "./UpdateStudent";
import NoticeForm from "./NoticeForm";

// Rich configuration map
export const actionConfig = {
  AddAchiver: {
    component: AddAchiver,
    title: "Add New Achiever",
    needsAuth: true,
  },
  UpdateAchiver: {
    component: UpdateAchiver,
    title: "Update Achiever",
    needsAuth: true,
  },
  AdmitCardDownload: {
    component: AdmitCardDownload,
    title: "Download Admit Cards",
    needsAuth: true,
  },
  CurrentExamUpdate: {
    component: CurrentExamUpdate,
    title: "Update Current Exam",
    needsAuth: true,
  },
  ExamRoutine: {
    component: ExamRoutine,
    title: "Manage Exam Routine",
    needsAuth: true,
  },
  PreviewRoutine: {
    component: PreviewRoutine,
    title: "Preview Exam Routine",
    needsAuth: true,
  },
  GalleryImageUpload: {
    component: GalleryImageUpload,
    title: "Upload Gallery Images",
    needsAuth: true,
  },
  EditResult: {
    component: EditResult,
    title: "Edit Student Result",
    needsAuth: true,
  },
  UploadResults: {
    component: UploadResults,
    title: "Upload Results via Excel",
    needsAuth: true,
  },
  EditBannerImage: {
    component: EditBannerImage,
    title: "Manage Banner Image",
    needsAuth: true,
  },
  StudentImageUpload: {
    component: StudentImageUpload,
    title: "Upload Student Photo",
    needsAuth: true,
  },
  PromoteStudents: {
    component: PromoteStudents,
    title: "Promote Students",
    needsAuth: true,
  },
  UpdateStudent: {
    component: UpdateStudent,
    title: "Manage Student",
    needsAuth: true,
  },
  NoticeForm: {
    component: NoticeForm,
    title: "Manage Notice",
    needsAuth: true,
  },
};

// Helper to get component by type
export const getActionComponent = (type) => {
  const config = actionConfig[type];
  return config ? config.component : null;
};

// Helper to get full config
export const getActionConfig = (type) => {
  return actionConfig[type] || null;
};

export default actionConfig;