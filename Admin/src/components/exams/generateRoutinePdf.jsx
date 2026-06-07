import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Image,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";

/* ================= SCHOOL DETAILS ================= */

const SCHOOL_DETAILS = {
  name: "Nashib Ali Academy",
  estd: "2015",
  regNo: "REG/EDU/ASSAM/2010/1122",
  address: "Mahachara, Barpeta, Assam – 781127",
  contact: "6001416724",
  email: "nashibaliacademy.offl@gmail.com"
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    display: 'flex',
    flexDirection: 'column',
  },

  /* ---------- Header ---------- */
  header: {
    textAlign: "center",
    marginBottom: 10,
  },

  schoolName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2,
  },

  examName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
    textTransform: "uppercase",
  },

  academicSession: {
    fontSize: 12,
    marginTop: 2,
    color: "#334155",
  },

  routineTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "bold",
    textDecoration: "underline",
  },

  divider: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 12,
  },

  /* ---------- Details ---------- */
  detailsBox: {
    marginBottom: 15,
    padding: 10,
    border: "1 solid #000",
    borderRadius: 4,
  },

  detailRow: {
    flexDirection: "row",
    marginBottom: 3,
  },

  detailLabel: {
    width: "25%",
    fontWeight: "bold",
  },

  detailValue: {
    width: "75%",
  },

  /* ---------- Table ---------- */
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 15,
  },

  tableRow: {
    flexDirection: "row",
  },

  tableHeader: {
    backgroundColor: "#f1f5f9",
    fontWeight: "bold",
  },

  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  },

  colSl: { width: "8%" },
  colSubject: { width: "32%" },
  colDate: { width: "22%" },
  colShift: { width: "15%" },
  colTime: { width: "23%" },

  /* ---------- Footer Notes ---------- */
  footerNote: {
    fontSize: 9,
    marginBottom: 20,
    fontStyle: "italic",
  },

  /* ---------- Signatures (Moved to Right) ---------- */
  signatureSection: {
    flexDirection: "row",
    justifyContent: "flex-end", // Aligns signature block to the right
    marginTop: 20,
  },

  signatureBlock: {
    alignItems: "center",
    width: "35%",
  },

  signatureImage: {
    width: 100,
    height: 45,
    marginBottom: 2,
    objectFit: "contain",
  },

  signatureLine: {
    borderTop: "1 solid #000",
    width: "100%",
    marginTop: 4,
  },

  signatureName: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 4,
  },

  signatureDesignation: {
    fontSize: 10,
  },

  /* ---------- Page Footer (School Details) ---------- */
  pageFooter: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: "1 solid #e2e8f0",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 9,
    color: "#64748b",
  }
});

/* ================= PDF DOCUMENT ================= */

const ExamRoutinePDF = ({ routine, principal, examDetails }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>{SCHOOL_DETAILS.name}</Text>
          <Text style={styles.examName}>{examDetails?.examName || "Term Examination"}</Text>
          <Text style={styles.academicSession}>Session: {examDetails?.academicSession || "2024-25"}</Text>
          <Text style={styles.routineTitle}>Examination Routine</Text>
        </View>

        <View style={styles.divider} />

        {/* ================= CLASS DETAILS ================= */}
        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Class / Medium</Text>
            <Text style={styles.detailValue}>
              : {routine.class.toUpperCase()} ({routine.medium || "N/A"})
            </Text>
          </View>
          {routine.stream && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Stream</Text>
              <Text style={styles.detailValue}>: {routine.stream}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Exam Center</Text>
            <Text style={styles.detailValue}>: {routine.examCenter}</Text>
          </View>
        </View>

        {/* ================= TABLE ================= */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol, styles.colSl]}>Sl.</Text>
            <Text style={[styles.tableCol, styles.colSubject]}>Subject</Text>
            <Text style={[styles.tableCol, styles.colDate]}>Date</Text>
            <Text style={[styles.tableCol, styles.colShift]}>Shift</Text>
            <Text style={[styles.tableCol, styles.colTime]}>Time</Text>
          </View>

          {routine.exams.map((exam, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCol, styles.colSl]}>{index + 1}</Text>
              <Text style={[styles.tableCol, styles.colSubject]}>{exam.subject}</Text>
              <Text style={[styles.tableCol, styles.colDate]}>{formatDate(exam.date)}</Text>
              <Text style={[styles.tableCol, styles.colShift]}>
                {exam.shift.charAt(0).toUpperCase() + exam.shift.slice(1)}
              </Text>
              <Text style={[styles.tableCol, styles.colTime]}>{exam.time}</Text>
            </View>
          ))}
        </View>

        {/* ================= NOTES ================= */}
        <View style={styles.footerNote}>
          <Text>Note:</Text>
          <Text>1. Reporting time: 30 minutes before commencement of examination.</Text>
          <Text>2. Carrying bags, mobile phones, or smartwatches into the hall is strictly prohibited.</Text>
        </View>

        {/* ================= SIGNATURE (RIGHT SIDE) ================= */}
        <View style={styles.signatureSection}>
          {principal && (
            <View style={styles.signatureBlock}>
              <Image src={principal.signature} style={styles.signatureImage} />
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>{principal.name}</Text>
              <Text style={styles.signatureDesignation}>{principal.designation}</Text>
            </View>
          )}
        </View>

        {/* ================= STICKY FOOTER ================= */}
        <View style={styles.pageFooter} fixed>
          <Text>{SCHOOL_DETAILS.address}</Text>
          <Text>Contact: {SCHOOL_DETAILS.contact} | Email: {SCHOOL_DETAILS.email}</Text>
        </View>
      </Page>
    </Document>
  );
};

/* ================= GENERATE & DOWNLOAD ================= */

export const generateRoutinePdf = async (routine, signatories, examDetails) => {
  const blob = await pdf(
    <ExamRoutinePDF
      routine={routine}
      signatories={signatories}
      examDetails={examDetails}
    />
  ).toBlob();

  // Conditionally include stream
  const stream = routine?.stream ? `_${routine.stream}` : "";

  saveAs(
    blob,
    `Admitcards_${routine.class}${stream}_${routine.medium}.pdf`
  );
};
