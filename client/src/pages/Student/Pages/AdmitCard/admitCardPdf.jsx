import { stylesObj } from './styles';
import { formatDate } from '../../../../Utils/utility';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const SCHOOL_DETAILS = {
  name: "NASHIB ALI ACADEMY",
  address: "South Building, Silchar, Assam - 788002",
  contact: "+91-9876543210",
  email: "nashibaliacademy@gmail.com",
  website: "www.nashibaliacademy.com",
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
                <Text style={styles.examName}>Annual Examination</Text>
                <View style={styles.line} />
              </View>

              <Text style={styles.admitTitle}>ADMIT CARD</Text>

              <View style={styles.dividerRow}>
                <View style={{ flex: 1 }} />
                <View style={styles.lineShort} />
                <Text style={styles.sessionText}>SESSION: 2025 - 2026</Text>
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

            {/* Exam Table Section */}
            <View style={styles.tableHeaderBox}><Text>Exam Details</Text></View>
            <View style={styles.table}>
              <View style={styles.tRow}>
                <View style={styles.tHeaderCol}><Text style={styles.tHeaderText}>DATE</Text></View>
                <View style={styles.tHeaderCol}><Text style={styles.tHeaderText}>MORNING</Text></View>
                <View style={styles.tHeaderCol}><Text style={styles.tHeaderText}>AFTERNOON</Text></View>
              </View>
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

export default AdmitCardPdf;