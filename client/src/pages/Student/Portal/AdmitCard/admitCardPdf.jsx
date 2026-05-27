import React, { useMemo } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { stylesObj } from "./styles";
import logo from "/logo.png";
import userImg from "/user.png";


 const SCHOOL_DETAILS = {
    name: "NASHIB ALI ACADEMY",
    logo: "/logo.png",
    address: "Mahachara, Kachumara, Barpeta, Assam - 781127",
    contact: "+91-60014-16724",
    email: "nashibaliacademy.offl@gmail.com",
    website: "www.nashibaliacademy.in",
  };

/* -------------------- DATE FORMATTING ENGINE -------------------- */
const formatDate = (dateInput) => {
  if (!dateInput) return "-";

  const date = new Date(dateInput);
  if (isNaN(date)) return "-";

  const day = date.getDate();
  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const weekday = date.toLocaleString("en-GB", { weekday: "long" });

  return `${day}${getOrdinal(day)} ${month} ${year} ( ${weekday} )`;
};

const styles = StyleSheet.create(stylesObj);

/* ==========================================================================
   OFFICIAL INSTITUTIONAL PRINT TRANSCRIPT GENERATOR
   ========================================================================== */
const AdmitCardPdf = ({ student, admitCard, examDetails, principal }) => {
  
  /* -------- RE-ARRANGE AND CHRONO-SORT EXAMS BY UNIQUE DATE -------- */
  const { groupedExams, dates } = useMemo(() => {
    const grouped = {};

    admitCard?.exams?.forEach((exam) => {
      // Group dates using local string formatting standard rules to avoid timezone shifting
      const dObj = new Date(exam.date);
      const dateKey = isNaN(dObj) ? exam.date : dObj.toLocaleDateString('en-CA'); 
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = { morning: "X", afternoon: "X" };
      }
      grouped[dateKey][exam.shift.toLowerCase()] = exam.subject;
    });

    return {
      groupedExams: grouped,
      dates: Object.keys(grouped).sort(),
    };
  }, [admitCard]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>

            {/* ================= HEADER SECTION ================= */}
            <View style={styles.header}>
              <Image style={styles.logo} src={logo} />
              <Text style={styles.schoolName}>NASHIB ALI ACADEMY</Text>

              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.examName}>
                  {(examDetails?.examName || "ANNUAL EXAMINATION").toUpperCase()}
                </Text>
                <View style={styles.line} />
              </View>

              <Text style={styles.admitTitle}>ADMIT CARD</Text>

              <View style={styles.sessionWrapper}>
                <View style={styles.lineShort} />
                <Text style={styles.sessionText}>
                  SESSION: {examDetails?.academicSession || "2025 - 2026"}
                </Text>
                <View style={styles.lineShort} />
              </View>
            </View>

            {/* ================= STUDENT PROFILE BLOCK ================= */}
            <View style={styles.studentSection}>
              <View style={styles.studentInfo}>
                <Info label="Name" value={student?.name} />
                <Info label="Father's Name" value={student?.fatherName} />
                <Info label="Mother's Name" value={student?.motherName} />
                <Info label="Class" value={student?.class} />
                <Info label="Medium" value={student?.medium} />
                {student?.stream && (
                  <Info label="Stream" value={student.stream} />
                )}
                <Info label="Registration No" value={student?.registrationNo} />
              </View>

              <View style={styles.photoFrame}>
                <Image
                  src={student?.image?.url || userImg}
                  style={styles.photoImg}
                />
              </View>
            </View>

            {/* ================= EXAM TIMETABLE MATRIX ================= */}
            <View style={styles.tableHeaderBox}>
              <Text>Exam Details</Text>
            </View>

            <View style={styles.table}>
              <View style={[styles.tRow, styles.tHeadBg]}>
                <View style={styles.tHeaderColDate}>
                  <Text style={styles.tHeaderText}>DATE</Text>
                </View>
                
                <View style={styles.tHeaderCol}>
                  <Text style={styles.tHeaderText}>MORNING</Text>
                  <Text style={styles.tHeaderTimeSub}>
                    ( {examDetails?.time?.morning || "9:00 AM - 12:00 PM"} )
                  </Text>
                </View>
                
                <View style={styles.tHeaderColLast}>
                  <Text style={styles.tHeaderText}>AFTERNOON</Text>
                  <Text style={styles.tHeaderTimeSub}>
                    ( {examDetails?.time?.afternoon || "1:00 PM - 4:00 PM"} )
                  </Text>
                </View>
              </View>

              {dates.length > 0 ? (
                dates.map((d, i) => (
                  <View key={i} style={styles.tRow} wrap={false}>
                    <View style={styles.tCellColDate}>
                      <Text style={styles.tCellText}>{formatDate(d)}</Text>
                    </View>
                    <View style={styles.tCellCol}>
                      <Text style={[styles.tCellText, styles.tCellSubject]}>
                        {groupedExams[d].morning}
                      </Text>
                    </View>
                    <View style={styles.tCellColLast}>
                      <Text style={[styles.tCellText, styles.tCellSubject]}>
                        {groupedExams[d].afternoon}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.tRow}>
                  <Text style={styles.emptyTableText}>No exams scheduled</Text>
                </View>
              )}
            </View>

            {/* ================= EXAM INSTRUCTIONS RULES ================= */}
            <View style={styles.instructionSection}>
              <Text style={styles.instructionTitle}>Instructions:</Text>
              <View style={styles.instructionItem}>
                <Text style={styles.instructionText}>
                  • This admit card must be brought to the examination hall every day.
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Text style={styles.instructionText}>
                  • Students must be in the examination hall 15 minutes prior to the exam time.
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Text style={styles.instructionText}>
                  • All students must bring their own pens, pencils, and other necessary stationery.
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Text style={styles.instructionText}>
                  • Any form of cheating or malpractice will result in immediate disqualification.
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Text style={styles.instructionText}>
                  • Maintain discipline and follow the invigilator's instructions at all times.
                </Text>
              </View>
            </View>

            {/* ================= FOOTER / SIGNATURE BLOCKS ================= */}
            <View style={styles.footerLayout} fixed>
              <View style={styles.signatureArea}>
                <View style={styles.signatureImgFrame}>
                  {principal?.signature?.url && (
                    <Image
                      style={styles.signatureImg}
                      src={principal.signature.url}
                    />
                  )}
                </View>
                <View style={styles.signLine} />
                <Text style={styles.principalLabel}>Principal</Text>
                <Text style={styles.principalName}>
                  ( {principal?.name || "Abdul Mozid Mondol"} )
                </Text>
              </View>

              <View style={styles.schoolContactArea}>
                <View style={styles.dividerFooterRow}>
                  <View style={styles.line} />
                  <Text style={styles.footerSchoolName}>NASHIB ALI ACADEMY</Text>
                  <View style={styles.line} />
                </View>
                <Text style={styles.contactText}>{SCHOOL_DETAILS.address}</Text>
                <Text style={styles.contactText}>{SCHOOL_DETAILS.website}</Text>
                <Text style={styles.contactText}>
                  {SCHOOL_DETAILS.email} | {SCHOOL_DETAILS.contact}
                </Text>
              </View>
            </View>

          </View>
        </View>
      </Page>
    </Document>
  );
};

/* ================= COMPONENT DATA CELLS ================= */

const Info = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || "-"}</Text>
  </View>
);

export default AdmitCardPdf;