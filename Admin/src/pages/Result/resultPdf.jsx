import { useMemo } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { stylesObj } from "./styles";
import logo from "/logo.png";
import userImg from "/user.png";

const styles = StyleSheet.create(stylesObj);

/* ================= GRADE ================= */

const calculateGrade = (marks) => {
  const m = parseInt(marks);
  if (isNaN(m)) return "-";
  if (m >= 90) return "A+";
  if (m >= 80) return "A";
  if (m >= 70) return "B+";
  if (m >= 60) return "B";
  if (m >= 50) return "C+";
  if (m >= 40) return "C";
  if (m > 30) return "D";
  return "F";
};

/* ================= SCHOOL DETAILS ================= */

const SCHOOL_DETAILS = {
  name: "NASHIB ALI ACADEMY",
  address: "Mahachara, Kachumara, Barpeta, Assam - 781127",
  contact: "+91-60014-16724",
  email: "nashibaliacademy.offl@gmail.com",
  website: "www.nashibaliacademy.in",
};

/* ================= CAPITALIZE WORDS ================= */

const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/* ===================================================== */

const ResultReportPdf = ({ result, principal }) => {

  const { marksRows, total, percentage } = useMemo(() => {

    const rows = result?.marks?.map((m) => ({
      subject: m.subject,
      obtained: m.mark,
      grade: calculateGrade(m.mark),
    })) || [];

    return {
      marksRows: rows,
      total: result.totalMarks || 0,
      percentage: result.percentage || 0
    };

  }, [result]);

  return (
    <Page size="A4" style={styles.page}>

      <View style={styles.outerBorder}>
        <View style={styles.innerBorder}>

          {/* ================= HEADER ================= */}

          <View style={styles.header}>
            <Image style={styles.logo} src={logo} />

            <Text style={styles.schoolName}>
              {SCHOOL_DETAILS.name}
            </Text>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.examName}>
                {result?.examName || "RESULT"}
              </Text>
              <View style={styles.line} />
            </View>

            <Text style={styles.admitTitle}>
              REPORT CARD
            </Text>

            <View style={styles.dividerRow}>
              <View style={{ flex: 1 }} />
              <View style={styles.lineShort} />
              <Text style={styles.sessionText}>
                SESSION: {result?.academicSession || "-"}
              </Text>
              <View style={styles.lineShort} />
              <View style={{ flex: 1 }} />
            </View>
          </View>

          {/* ================= STUDENT INFO ================= */}

          <View style={styles.studentSection}>

            <View style={styles.studentInfo}>
              <Info label="Name" value={capitalizeWords(result?.name)} />
              <Info label="Father's Name" value={capitalizeWords(result?.fatherName)} />
              <Info label="Mother's Name" value={capitalizeWords(result?.motherName)} />
              <Info label="Class" value={capitalizeWords(result?.class)} />
              <Info label="Registration No" value={result?.registrationNo} />

              {(result?.class === "11" || result?.class === "12") && (
                <Info label="Stream" value={capitalizeWords(result?.stream)} />
              )}

              <Info label="Rank" value={result.rank || "-"} />

            </View>

            <View style={styles.photoFrame}>
              <Image
                src={result?.image?.url || userImg}
                style={{ width: "100%", height: "100%" }}
              />
            </View>

          </View>

          {/* ================= MARKS TABLE ================= */}

          <View style={styles.tableHeaderBox}>
            <Text>Marks Details</Text>
          </View>

          <View style={styles.table}>

            <View style={styles.tRow}>
              <HeaderCell text="SUBJECT" />
              <HeaderCell text="MAX MARKS" />
              <HeaderCell text="OBTAINED" />
              <HeaderCell text="GRADE" />
            </View>

            {marksRows.map((m, i) => (
              <View key={i} style={styles.tRow}>
                <Cell text={m.subject} />
                <Cell text={result?.maxMarksPerSubject || "100"} />
                <Cell text={m.obtained === 0 ? "Absent" : m.obtained} />
                <Cell text={m.grade} />
              </View>
            ))}

          </View>

          {/* ================= SUMMARY ================= */}

          <View style={styles.instructionSection}>

            <Text style={styles.instructionTitle}>Result Summary:</Text>
            <Text style={[styles.instructionText, { fontWeight: "bold" }]}>
              Marks Obtained: {total}/{result?.marks?.length * (result?.maxMarksPerSubject || 100)}
            </Text>
            <Text style={styles.instructionText}>
              Percentage: {percentage.toFixed(2)}%
            </Text>

            <Text style={styles.instructionText}>
              Grade: {result.grade}
            </Text>


            <Text style={styles.instructionText}>
              Result: {result.resultStatus}
            </Text>

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

              <Text style={styles.principalLabel}>
                Principal
              </Text>

              <Text style={styles.tCellText}>
                ({principal?.name || "-"})
              </Text>

            </View>

            <View style={styles.schoolContactArea}>
              <DividerTitle text={SCHOOL_DETAILS.name} />

              <Text style={styles.contactText}>
                {SCHOOL_DETAILS.address}
              </Text>

              <Text style={styles.contactText}>
                {SCHOOL_DETAILS.website}
              </Text>

              <Text style={styles.contactText}>
                {SCHOOL_DETAILS.email} | {SCHOOL_DETAILS.contact}
              </Text>

            </View>

          </View>

        </View>
      </View>

    </Page>
  );
};

/* =====================================================
   MULTI-STUDENT DOCUMENT GENERATOR
===================================================== */
export const generateReportCards = ({ results, principal }) => {
  return (
    <Document>
      {results.map((result) => (
        <ResultReportPdf
          key={result._id || result.registrationNo}
          result={result}
          principal={principal}
        />
      ))}
    </Document>
  );
};

export default ResultReportPdf;

/* ================= HELPERS ================= */

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