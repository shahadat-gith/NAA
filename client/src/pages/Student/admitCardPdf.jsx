import { useMemo } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { stylesObj } from "./styles";
import logo from "/logo.png";
import userImg from "/user.png";

/* -------------------- DATE FORMAT -------------------- */
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

  return `${day}${getOrdinal(day)} ${month} ${year} (${weekday})`;
};

/* -------------------- SCHOOL DETAILS -------------------- */
const SCHOOL_DETAILS = {
  name: "NASHIB ALI ACADEMY",
  address: "Mahachara, Kachumara, Barpeta, Assam - 781127",
  contact: "+91-60014-16724",
  email: "nashibaliacademy.offl@gmail.com",
  website: "www.nashibaliacademy.in",
};

const styles = StyleSheet.create(stylesObj);

/* =====================================================
   SINGLE STUDENT ADMIT CARD (CLIENT SIDE)
===================================================== */
const AdmitCardPdf = ({ student, admitCard, examDetails, principal }) => {
  /* -------- GROUP EXAMS BY DATE -------- */
  const { groupedExams, dates } = useMemo(() => {
    const grouped = {};

    admitCard?.exams?.forEach((exam) => {
      const date = new Date(exam.date).toISOString().split("T")[0];
      if (!grouped[date]) {
        grouped[date] = { morning: "—", afternoon: "—" };
      }
      grouped[date][exam.shift.toLowerCase()] = exam.subject;
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

            {/* ================= HEADER ================= */}
            <View style={styles.header}>
              <Image style={styles.logo} src={logo} />
              <Text style={styles.schoolName}>{SCHOOL_DETAILS.name}</Text>

              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.examName}>
                  {examDetails?.examName || "EXAMINATION"}
                </Text>
                <View style={styles.line} />
              </View>

              <Text style={styles.admitTitle}>ADMIT CARD</Text>

              <View style={styles.dividerRow}>
                <View style={{ flex: 1 }} />
                <View style={styles.lineShort} />
                <Text style={styles.sessionText}>
                  SESSION: {examDetails?.academicSession || "-"}
                </Text>
                <View style={styles.lineShort} />
                <View style={{ flex: 1 }} />
              </View>
            </View>

            {/* ================= STUDENT INFO ================= */}
            <View style={styles.studentSection}>
              <View style={styles.studentInfo}>
                <Info label="Name" value={student?.name} />
                <Info label="Father's Name" value={student?.fatherName} />
                <Info label="Mother's Name" value={student?.motherName} />
                <Info label="Class" value={student?.class} />
                <Info label="Medium" value={student?.medium} />
                <Info label="Registration No" value={student?.registrationNo} />
                {student?.stream && (
                  <Info label="Stream" value={student.stream.toUpperCase()} />
                )}
              </View>

              <View style={styles.photoFrame}>
                <Image
                  src={student?.image?.url || userImg}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </View>

            {/* ================= EXAM TABLE ================= */}
            <View style={styles.tableHeaderBox}>
              <Text>Exam Details</Text>
            </View>

            <View style={styles.table}>
              <View style={styles.tRow}>
                <HeaderCell text="DATE" />
                <HeaderCell
                  text={`MORNING\n(${examDetails?.time?.morning || "9:00 AM - 12:00 PM"})`}
                />
                <HeaderCell
                  text={`AFTERNOON\n(${examDetails?.time?.afternoon || "1:00 PM - 4:00 PM"})`}
                />
              </View>

              {dates.map((d, i) => (
                <View key={i} style={styles.tRow}>
                  <Cell text={formatDate(d)} />
                  <Cell text={groupedExams[d].morning} />
                  <Cell text={groupedExams[d].afternoon} />
                </View>
              ))}
            </View>

            {/* ================= INSTRUCTIONS ================= */}
            <View style={styles.instructionSection}>
              <Text style={styles.instructionTitle}>Instructions:</Text>
              <Text style={styles.instructionText}>• Bring this admit card every exam day.</Text>
              <Text style={styles.instructionText}>• Reach the exam hall 15 minutes early.</Text>
              <Text style={styles.instructionText}>• Follow invigilator instructions strictly.</Text>
            </View>

            {/* ================= FOOTER ================= */}
            <View style={styles.footerLayout}>
              <View style={styles.signatureArea}>
                {principal?.signature?.url && (
                  <Image
                    style={styles.signatureImg}
                    src={principal.signature.url}
                  />
                )}
                <Text style={styles.principalLabel}>Principal</Text>
                <Text style={styles.tCellText}>
                  ({principal?.name || "-"})
                </Text>
              </View>

              <View style={styles.schoolContactArea}>
                <DividerTitle text={SCHOOL_DETAILS.name} />
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

export default AdmitCardPdf;

/* ================= SMALL HELPERS ================= */

const Info = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || "-"}</Text>
  </View>
);

const HeaderCell = ({ text }) => (
  <View style={styles.tHeaderCol}>
    <Text style={styles.tHeaderText}>{text}</Text>
  </View>
);

const Cell = ({ text }) => (
  <View style={styles.tCellCol}>
    <Text style={styles.tCellText}>{text || "-"}</Text>
  </View>
);

const DividerTitle = ({ text }) => (
  <View style={styles.dividerRow}>
    <View style={styles.line} />
    <Text style={{ fontSize: 9, fontWeight: "bold", marginHorizontal: 8 }}>
      {text}
    </Text>
    <View style={styles.line} />
  </View>
);
