import React from "react";
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

/* ================= SCHOOL DETAILS (FROM BACKEND LATER) ================= */

const SCHOOL_DETAILS = {
  name: "Nashib Ali Academy",
  estd: "2015",
  regNo: "REG/EDU/ASSAM/2010/1122",
  address: "Mahachara, Barpeta, Assam – 781127",
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },

  /* ---------- Header ---------- */
  header: {
    textAlign: "center",
    marginBottom: 14,
  },

  schoolName: {
    fontSize: 20,
    fontWeight: "bold",
  },

  schoolMeta: {
    fontSize: 10,
    marginTop: 2,
  },

  title: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  divider: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 10,
  },

  /* ---------- Details ---------- */
  detailsBox: {
    marginBottom: 18,
    padding: 10,
    border: "1 solid #000",
  },

  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  detailLabel: {
    width: "28%",
    fontWeight: "bold",
  },

  detailValue: {
    width: "72%",
  },

  /* ---------- Table ---------- */
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
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

  colSl: { width: "6%" },
  colSubject: { width: "30%" },
  colDate: { width: "18%" },
  colShift: { width: "14%" },
  colTime: { width: "32%" },

  /* ---------- Footer ---------- */
  footerNote: {
    fontSize: 10,
    marginBottom: 28,
  },

  /* ---------- Signatures ---------- */
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  signatureBlock: {
    alignItems: "center",
    width: "40%",
  },

  signatureImage: {
    width: 120,
    height: 50,
    marginBottom: 4,
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
    marginTop: 2,
  },
});

/* ================= PDF DOCUMENT ================= */

const ExamRoutinePDF = ({ routine, signatories }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>
            {SCHOOL_DETAILS.name}
          </Text>
          <Text style={styles.schoolMeta}>
            Estd: {SCHOOL_DETAILS.estd} | Reg. No: {SCHOOL_DETAILS.regNo}
          </Text>
          <Text style={styles.schoolMeta}>
            {SCHOOL_DETAILS.address}
          </Text>
          <Text style={styles.title}>Examination Routine</Text>
        </View>

        <View style={styles.divider} />

        {/* ================= DETAILS ================= */}
        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Class</Text>
            <Text style={styles.detailValue}>: {routine.class}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Stream</Text>
            <Text style={styles.detailValue}>
              : {routine.stream || "—"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Medium</Text>
            <Text style={styles.detailValue}>
              :{" "}
              {routine.medium
                ? routine.medium.charAt(0).toUpperCase() +
                  routine.medium.slice(1)
                : "—"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Exam Center</Text>
            <Text style={styles.detailValue}>
              : {routine.examCenter}
            </Text>
          </View>
        </View>

        {/* ================= TABLE ================= */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol, styles.colSl]}>#</Text>
            <Text style={[styles.tableCol, styles.colSubject]}>
              Subject
            </Text>
            <Text style={[styles.tableCol, styles.colDate]}>
              Date
            </Text>
            <Text style={[styles.tableCol, styles.colShift]}>
              Shift
            </Text>
            <Text style={[styles.tableCol, styles.colTime]}>
              Time
            </Text>
          </View>

          {routine.exams.map((exam, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCol, styles.colSl]}>
                {index + 1}
              </Text>
              <Text style={[styles.tableCol, styles.colSubject]}>
                {exam.subject}
              </Text>
              <Text style={[styles.tableCol, styles.colDate]}>
                {formatDate(exam.date)}
              </Text>
              <Text style={[styles.tableCol, styles.colShift]}>
                {exam.shift.charAt(0).toUpperCase() +
                  exam.shift.slice(1)}
              </Text>
              <Text style={[styles.tableCol, styles.colTime]}>
                {exam.time}
              </Text>
            </View>
          ))}
        </View>

        {/* ================= FOOTER NOTES ================= */}
        <View style={styles.footerNote}>
          <Text>• Students must report at least 30 minutes before exam time.</Text>
          <Text>• Mobile phones and electronic devices are strictly prohibited.</Text>
        </View>

        {/* ================= SIGNATURES ================= */}
        <View style={styles.signatureSection}>
          {signatories?.examIC && (
            <View style={styles.signatureBlock}>
              <Image
                src={signatories.examIC.signature}
                style={styles.signatureImage}
              />
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>
                {signatories.examIC.name}
              </Text>
              <Text style={styles.signatureDesignation}>
                {signatories.examIC.designation}
              </Text>
            </View>
          )}

          {signatories?.principal && (
            <View style={styles.signatureBlock}>
              <Image
                src={signatories.principal.signature}
                style={styles.signatureImage}
              />
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>
                {signatories.principal.name}
              </Text>
              <Text style={styles.signatureDesignation}>
                {signatories.principal.designation}
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

/* ================= GENERATE & DOWNLOAD ================= */

export const generateRoutinePdf = async (routine, signatories) => {
  const blob = await pdf(
    <ExamRoutinePDF
      routine={routine}
      signatories={signatories}
    />
  ).toBlob();

  saveAs(
    blob,
    `Exam_Routine_Class_${routine.class}${
      routine.stream ? "_" + routine.stream : ""
    }.pdf`
  );
};
