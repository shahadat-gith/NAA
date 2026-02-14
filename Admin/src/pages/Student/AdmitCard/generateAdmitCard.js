import { stylesObj } from './styles';
import { formatDate } from '../../../utils/utility';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const SCHOOL_DETAILS = {
  name: "NASHIB ALI ACADEMY",
  logo: "/logo.png",
  address: "Mahachara, Kachumara, Barpeta, Assam - 781127",
  contact: "+91-60014-16724",
  email: "nashibaliacademy.offl@gmail.com",
  website: "www.nashibaliacademy.in",
};

const styles = StyleSheet.create(stylesObj);

const AdmitCardPdf = ({ student, admitCard, principal, examDetails }) => {
  const groupedExams = {};
  admitCard?.exams?.forEach((exam) => {
    const date = new Date(exam.date).toISOString().split('T')[0];
    if (!groupedExams[date]) groupedExams[date] = { morning: "X", afternoon: "X" };
    groupedExams[date][exam.shift.toLowerCase()] = exam.subject;
  });
  const dates = Object.keys(groupedExams).sort();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>

            {/* Header Section */}
            <View style={styles.header}>
              <Image style={styles.logo} src="/logo.png" />
              <Text style={styles.schoolName}>{SCHOOL_DETAILS.name}</Text>

              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.examName}>{examDetails?.examName}</Text>
                <View style={styles.line} />
              </View>

              <Text style={styles.admitTitle}>ADMIT CARD</Text>

              <View style={styles.dividerRow}>
                <View style={{ flex: 1 }} />
                <View style={styles.lineShort} />
                <Text style={styles.sessionText}>SESSION: {examDetails?.academicSession}</Text>
                <View style={styles.lineShort} />
                <View style={{ flex: 1 }} />
              </View>
            </View>

            {/* Student Info Section */}
            <View style={styles.studentSection}>
              <View style={styles.studentInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{student?.name || "Shehzin Hassan"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Father's Name:</Text>
                  <Text style={styles.value}>{student?.fatherName || "Mahmadul Hassan"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Mother's Name:</Text>
                  <Text style={styles.value}>{student?.motherName || "Shahanaz Khatun"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Class:</Text>
                  <Text style={styles.value}>{student?.class || "Nursery"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Medium:</Text>
                  <Text style={styles.value}>{student?.medium || "English"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Registration No:</Text>
                  <Text style={styles.value}>{student?.registrationNo || "N/A"}</Text>
                </View>
                {student.stream &&
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Stream:</Text>
                    <Text style={styles.value}>{student?.stream || "Arts"}</Text>
                  </View>
                }
              </View>
              <View style={styles.photoFrame}>
                <Image src={student.image.url || "/user.png"} style={{ width: '100%', height: '100%' }} />
              </View>
            </View>

            {/* ================= EXAM TABLE SECTION ================= */}
            <View style={styles.tableHeaderBox}>
              <Text>Exam Details</Text>
            </View>
            <View style={styles.table}>
              {/* Table Header with Times */}
              <View style={styles.tRow}>
                <View style={styles.tHeaderCol}>
                  <Text style={styles.tHeaderText}>DATE</Text>
                </View>
                <View style={styles.tHeaderCol}>
                  <Text style={styles.tHeaderText}>MORNING</Text>
                  <Text style={[styles.tHeaderText, { fontSize: 8, color: '#eee', marginTop: 2 }]}>
                    ({examDetails?.time?.morning || "9:00 AM - 12:00 PM"})
                  </Text>
                </View>
                <View style={styles.tHeaderCol}>
                  <Text style={styles.tHeaderText}>AFTERNOON</Text>
                  <Text style={[styles.tHeaderText, { fontSize: 8, color: '#eee', marginTop: 2 }]}>
                    ({examDetails?.time?.afternoon || "1:00 PM - 4:00 PM"})
                  </Text>
                </View>
              </View>

              {/* Table Body - Same as before */}
              {dates.map((d, i) => (
                <View style={styles.tRow} key={i}>
                  <View style={styles.tCellCol}><Text style={styles.tCellText}>{formatDate(d)}</Text></View>
                  <View style={styles.tCellCol}><Text style={styles.tCellText}>{groupedExams[d].morning}</Text></View>
                  <View style={styles.tCellCol}><Text style={styles.tCellText}>{groupedExams[d].afternoon}</Text></View>
                </View>
              ))}
            </View>

            {/* Instructions Section */}
            <View style={styles.instructionSection}>
              <Text style={styles.instructionTitle}>Instructions:</Text>
              <Text style={styles.instructionText}>• This admit card must be brought to the examination hall every day.</Text>
              <Text style={styles.instructionText}>• Students must reach 15 minutes prior to the exam time.</Text>
              <Text style={styles.instructionText}>• Maintain discipline and follow invigilator's instructions.</Text>
            </View>

            {/* Footer Section */}
            <View style={styles.footerLayout}>
              <View style={styles.signatureArea}>
                {principal?.signature?.url && <Image style={styles.signatureImg} src={principal.signature.url} />}
                <Text style={styles.principalLabel}>Principal</Text>
                <Text style={styles.tCellText}>({principal?.name || "Abdul Mozid Mondol"})</Text>
              </View>
              <View style={styles.schoolContactArea}>
                <View style={styles.dividerRow}>
                  <View style={styles.line} />
                  <Text style={{ fontSize: 9, fontWeight: 'bold', marginHorizontal: 8 }}>{SCHOOL_DETAILS.name}</Text>
                  <View style={styles.line} />
                </View>
                <Text style={styles.contactText}>{SCHOOL_DETAILS.address}</Text>
                <Text style={styles.contactText}>{SCHOOL_DETAILS.website}</Text>
                <Text style={styles.contactText}>{SCHOOL_DETAILS.email} | {SCHOOL_DETAILS.contact}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};


export const generateAdmitCards = ({ students, admitCard, examDetails, principal }) => {
  return (
    <Document>
      {students.map((student) => (
        <AdmitCardPdf
          key={student._id || student.registrationNo}
          student={student}
          admitCard={admitCard}
          examDetails={examDetails}
          principal={principal}
        />
      ))}
    </Document>
  );
};
