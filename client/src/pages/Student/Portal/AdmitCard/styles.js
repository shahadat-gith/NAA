export const stylesObj = {
  /* ================= PAGE CONTAINER SETTINGS ================= */
  page: {
    padding: 20,
    fontFamily: 'Times-Roman',
    backgroundColor: '#ffffff'
  },
  
  /* ================= INSTITUTIONAL DOUBLE BORDERS ================= */
  outerBorder: {
    border: '2px solid #000000',
    padding: 6,
    height: '100%'
  },
  innerBorder: {
    border: '1px solid #000000',
    padding: 24,
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },

  /* ================= HEADER SEGMENT ELEMENT MAPS ================= */
  header: {
    alignItems: 'center',
    marginBottom: 12
  },
  logo: {
    width: 54,
    height: 54,
    marginBottom: 6
  },
  schoolName: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#000000',
    margin: 0
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 4
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#000000'
  },
  lineShort: {
    width: 45,
    height: 1,
    backgroundColor: '#000000'
  },
  examName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#000000',
    letterSpacing: 0.5
  },
  admitTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginVertical: 6,
    letterSpacing: 2.5,
    color: '#000000'
  },
  sessionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    gap: 8
  },
  sessionText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000'
  },

  /* ================= STUDENT DEMOGRAPHICS DATA ROW ================= */
  studentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 16
  },
  studentInfo: {
    width: '75%',
    display: 'flex',
    flexDirection: 'column',
    gap: 5
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    width: 120
  },
  value: {
    fontSize: 10,
    color: '#000000'
  },
  photoFrame: {
    width: 90,
    height: 110,
    border: '1px solid #000000',
    backgroundColor: '#f8fafc'
  },
  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },

  /* ================= GRID DATA MATRIX MAPPINGS ================= */
  tableHeaderBox: {
    border: '1px solid #000000',
    padding: 5,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#000000'
  },
  table: {
    width: '100%',
    borderLeft: '1px solid #000000',
    borderRight: '1px solid #000000',
    borderBottom: '1px solid #000000'
  },
  tRow: {
    flexDirection: 'row',
    width: '100%'
  },
  tHeadBg: {
    backgroundColor: '#f8fafc'
  },
  tHeaderColDate: {
    width: '34%',
    padding: '6px 4px',
    borderRight: '1px solid #000000',
    borderBottom: '1px solid #000000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tHeaderCol: {
    width: '33%',
    padding: '6px 4px',
    borderRight: '1px solid #000000',
    borderBottom: '1px solid #000000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tHeaderColLast: {
    width: '33%',
    padding: '6px 4px',
    borderBottom: '1px solid #000000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tHeaderText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tHeaderTimeSub: {
    fontSize: 8.5,
    color: '#000000',
    textAlign: 'center',
    marginTop: 1
  },
  tCellColDate: {
    width: '34%',
    padding: '6px 4px',
    borderRight: '1px solid #000000',
    borderBottom: '1px solid #000000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tCellCol: {
    width: '33%',
    padding: '6px 4px',
    borderRight: '1px solid #000000',
    borderBottom: '1px solid #000000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tCellColLast: {
    width: '33%',
    padding: '6px 4px',
    borderBottom: '1px solid #000000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tCellText: {
    fontSize: 10,
    color: '#000000',
    textAlign: 'center'
  },
  tCellSubject: {
    fontWeight: 'bold'
  },
  emptyTableText: {
    width: '100%',
    textAlign: 'center',
    padding: 10,
    fontSize: 10,
    color: '#000000'
  },

  /* ================= TRANSCRIPT CANDIDATE RULES ================= */
  instructionSection: {
    marginTop: 16,
    padding: '10px 14px',
    border: '1px dashed #000000',
    borderRadius: 2,
    backgroundColor: '#fafafa'
  },
  instructionTitle: {
    fontSize: 10.5,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
    color: '#000000'
  },
  instructionItem: {
    marginBottom: 4
  },
  instructionText: {
    fontSize: 9,
    color: '#1e293b',
    lineHeight: 1.4
  },

  /* ================= SIGNALS & FOOTER METADATA ================= */
  footerLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
    paddingTop: 15
  },
  signatureArea: {
    alignItems: 'center',
    width: '35%'
  },
  signatureImgFrame: {
    height: 35,
    justifyContent: 'flex-end',
    marginBottom: 2
  },
  signatureImg: {
    width: 90,
    objectFit: 'contain'
  },
  signLine: {
    width: '100%',
    borderBottom: '1px solid #000000',
    marginBottom: 4
  },
  principalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000000',
    textAlign: 'center'
  },
  principalName: {
    fontSize: 9,
    color: '#000000',
    textAlign: 'center',
    marginTop: 1
  },
  schoolContactArea: {
    width: '58%',
    alignItems: 'center'
  },
  dividerFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4
  },
  footerSchoolName: {
    fontSize: 9,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#000000',
    letterSpacing: 0.5
  },
  contactText: {
    fontSize: 8,
    color: '#000000',
    marginTop: 2,
    textAlign: 'center'
  }
};