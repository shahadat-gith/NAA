export const stylesObj = {
    page: {
        padding: 15,
        fontFamily: 'Times-Roman',
        backgroundColor: '#ffffff'
    },
    outerBorder: {
        border: '3px solid #004632',       // Bold dark green
        padding: 4,
        height: '100%',
        background: '#ffffff',
        borderRadius: 6,
        boxShadow: '0 0 0 2px #d8e6df'     // Soft outer accent ring
    },

    innerBorder: {
        border: '1.5px solid #004632',     // Clean secondary border
        padding: 20,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        background: 'linear-gradient(to bottom, #ffffff, #f7fbf9)'
    },

  // Header Section 
  header: {
        alignItems: 'center',
        marginBottom: 8
    },
    logo: {
        width: 55,
        marginBottom: 5,
        borderRadius: 4
    },
    schoolName: {
        fontSize: 26,
        color: '#1a3a5a',
        marginBottom: 3
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 3
    },
    line: {
        flex: 1,
        height: 0.5,
        backgroundColor: '#999'
    },
    lineShort: {
        width: 50,
        height: 0.5,
        backgroundColor: '#999'
    },
    examName: {
        fontSize: 12,
        marginHorizontal: 10,
        color: '#333'
    },
    admitTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
        letterSpacing: 2
    },
    sessionText: {
        fontSize: 13,
        fontWeight: 'bold',
        marginHorizontal: 8
    },
    // Student Info Section
    studentSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10
    },
    studentInfo: {
        width: '75%'
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold',
        width: 100,
    },
    value: {
        fontSize: 13,
        textTransform: 'capitalize',
    },
    photoFrame: {
        width: 100,
        height: 115,
        border: '0.5pt solid #ccc',
        padding: 2
    },

    tableHeaderBox: {
        backgroundColor: '#1a3a32',
        color: '#ffffff',
        textAlign: 'center',
        padding: 5,
        fontSize: 13,
        fontWeight: 'bold'
    },
    table: {
        display: 'table',
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#1a3a32'
    },
    tRow: {
        flexDirection: 'row'
    },
    tHeaderCol: {
        width: '33.33%',
        backgroundColor: '#2d5a4c',
        padding: 6,
        borderRightWidth: 0.5,
        borderColor: '#1a3a32',
        textAlign: 'center'
    },
    tCellCol: {
        width: '33.33%',
        padding: 6,
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#1a3a32',
        textAlign: 'center'
    },
    tHeaderText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 'bold'
    },
    tCellText: {
        fontSize: 11
    },
    // Instructions
    instructionSection: {
        marginTop: 15
    },
    instructionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 4
    },
    instructionText: {
        fontSize: 11,
        marginBottom: 3
    },
    // Footer
    footerLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 'auto'
    },
    signatureArea: {
        alignItems: 'center',
        width: '40%'
    },
    signatureImg: {
        width: 110,
        height: 'auto',
        marginBottom: -5
    },
    principalLabel: {
        fontSize: 20,
        color: '#2e5a88',
        fontWeight: 'bold'
    },
    schoolContactArea: {
        width: '55%',
        textAlign: 'center'
    },
    contactText: {
        fontSize: 10,
        color: '#444',
        marginTop: 1
    },
};