import React from "react";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import { styles } from "./idCardPdfStyles";
import capitalizeWords from "../../../../Utils/utility"

const IdCardPdf = ({ student, logoUrl, userPlaceholderUrl, qrCodeUrl }) => {
  const SCHOOL_DETAILS = {
    name: "NASHIB ALI ACADEMY",
    address: "Barpeta, Assam - 781127",
    contact: "+91-60014-16724",
    email: "nashibaliacademy.offl@gmail.com",
    website: "www.nashibaliacademy.edu.in",
  };

  const details = [
    { label: "Father's Name", value: capitalizeWords(student?.fatherName) },
    { label: "Phone No", value: student?.phone || "N/A" },
    { label: "Class", value: capitalizeWords(student?.class) },
    { label: "Medium", value: capitalizeWords(student?.medium) },
    ...(student?.stream
      ? [{ label: "Stream", value: capitalizeWords(student.stream) }]
      : []),
    { label: "Student ID", value: student?.registrationNo || "N/A" },
  ];

  const TC_ITEMS = [
    "This ID card is the property of Nashib Ali Academy.",
    "This card is non-transferable and must be carried at all times.",
    "The card must be produced on demand by any authorized person.",
    "If lost or found, please inform the school office immediately.",
  ];

  const ContactItem = ({ text }) => (
    <View style={styles.contactItem}>
      <Text style={styles.contactText}>{text}</Text>
    </View>
  );

  /* ══════════════════════════════════
     FRONT CARD
  ══════════════════════════════════ */
  const FrontCard = () => (
    <View style={styles.card}>

      {/* Blue dome header */}
      <View style={styles.frontHeader}>
        <Image src={logoUrl} style={styles.frontLogo} />
        <Text style={styles.frontTitle}>{SCHOOL_DETAILS.name}</Text>
        <View style={styles.frontTaglineRow}>
          <Text style={styles.frontTaglineWord}>KNOWLEDGE</Text>
          <Text style={styles.frontTaglineSep}> | </Text>
          <Text style={styles.frontTaglineWord}>DISCIPLINE</Text>
          <Text style={styles.frontTaglineSep}> | </Text>
          <Text style={styles.frontTaglineWord}>SUCCESS</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.frontBody}>

        {/* LEFT: details */}
        <View style={styles.frontBodyLeft}>
          {details.map(({ label, value }, i) => (
            <View
              key={label}
              style={[
                styles.detailRow,
                i === details.length - 1 ? styles.detailRowLast : {},
              ]}
            >
              <Text style={styles.detailLabel}>{label}</Text>
              <Text style={styles.detailColon}>:</Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* RIGHT: photo + name */}
        <View style={styles.frontBodyRight}>
          <View style={styles.photoFrame}>
            <Image
              src={student?.image?.url || userPlaceholderUrl}
              style={styles.photoImg}
            />
          </View>
          <View style={styles.nameBanner}>
            <Text style={styles.nameBannerText} numberOfLines={1}>
              {(student?.name || "Student Name").toUpperCase()}
            </Text>
          </View>
        </View>

      </View>
    </View>
  );

  /* ══════════════════════════════════
     BACK CARD
  ══════════════════════════════════ */
  const BackCard = () => (
    <View style={styles.card}>

      {/* Blue dome header */}
      <View style={styles.backHeader}>
        <Image src={logoUrl} style={styles.backMiniLogo} />
      </View>

      {/* Content */}
      <View style={styles.backContentStack}>

        {/* T&C section */}
        <View style={styles.backSection}>
          <View style={styles.sectionDividerRow}>
            <View style={styles.sectionLine} />
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>TERMS & CONDITIONS</Text>
            </View>
            <View style={styles.sectionLine} />
          </View>

          {/* Explicit 2-col layout: left col items 0,2 / right col items 1,3 */}
          <View style={styles.tcGrid}>
            <View style={styles.tcCol}>
              {[TC_ITEMS[0], TC_ITEMS[2]].map((text, i) => (
                <View key={i} style={styles.tcItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.tcText}>{text}</Text>
                </View>
              ))}
            </View>
            <View style={styles.tcCol}>
              {[TC_ITEMS[1], TC_ITEMS[3]].map((text, i) => (
                <View key={i} style={styles.tcItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.tcText}>{text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Contact section */}
        <View style={styles.backSection}>
          <View style={styles.sectionDividerRow}>
            <View style={styles.sectionLine} />
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>CONTACT US</Text>
            </View>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.contactContainer}>
            {/* 2-col contact */}
            <View style={styles.contactInfoBlock}>
              <View style={styles.contactCol}>
                <ContactItem text={SCHOOL_DETAILS.contact} />
                <ContactItem text={SCHOOL_DETAILS.address} />
              </View>
              <View style={styles.contactCol}>
                <ContactItem text={SCHOOL_DETAILS.email} />
                <ContactItem text={SCHOOL_DETAILS.website} />
              </View>
            </View>

            {/* QR code */}
            <View style={styles.qrCodeBox}>
              <Image src={qrCodeUrl} style={styles.qrCodeImg} />
            </View>
          </View>
        </View>

      </View>

      {/* Footer */}
      <View style={styles.backFooter}>
        <Text style={styles.footerNote}>Thank you for being a part of</Text>
        <Text style={styles.footerInstitution}>{SCHOOL_DETAILS.name}</Text>
      </View>

    </View>
  );

  /*
   * Standard CR80 ID card: 85.6 × 54 mm
   * At 96 dpi in points (1pt = 1/72 inch):
   *   85.6mm = 3.37in = 242.6pt  → we use 243
   *   54mm   = 2.126in = 153.1pt → we use 153
   *
   * BUT react-pdf renders at 72dpi so text looks tiny at true card size.
   * We use 2× scale (486 × 306 pt) so it looks good on screen & print.
   * The PDF viewer will display at whatever zoom fits the window.
   */
  return (
    <Document>
      <Page size={[486, 306]} style={styles.page}>
        <FrontCard />
      </Page>
      <Page size={[486, 306]} style={styles.page}>
        <BackCard />
      </Page>
    </Document>
  );
};

export default IdCardPdf;