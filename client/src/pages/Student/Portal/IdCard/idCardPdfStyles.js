import { StyleSheet, Font } from "@react-pdf/renderer";
import montserratRegular from "../../../../fonts/Montserrat/Montserrat-Regular.ttf";
import montserratMedium from "../../../../fonts/Montserrat/Montserrat-Medium.ttf";
import montserratSemiBold from "../../../../fonts/Montserrat/Montserrat-SemiBold.ttf";
import montserratBold from "../../../../fonts/Montserrat/Montserrat-Bold.ttf";
import dancingScriptBold from "../../../../fonts/DancingScript/DancingScript-Bold.ttf";

Font.register({
  family: "Montserrat",
  fonts: [
    { src: montserratRegular, fontWeight: 400 },
    { src: montserratMedium, fontWeight: 500 },
    { src: montserratSemiBold, fontWeight: 600 },
    { src: montserratBold, fontWeight: 700 },
    { src: montserratBold, fontWeight: 800 },
    { src: montserratBold, fontWeight: 900 },
  ],
});

Font.register({
  family: "Dancing Script",
  src: dancingScriptBold,
  fontWeight: 700,
});

/* ─── Palette ─── */
const C = {
  navyDeep:    "#1e3a8a",
  navy:        "#1a2d6b",
  blue:        "#2563c0",
  blueLight:   "#c8d4f0",
  white:       "#ffffff",
  textDark:    "#2d3748",
  textMid:     "#2c3e70",
  borderLight: "#edf2f7",
  borderFaint: "rgba(26,45,107,0.15)",
  bgLight:     "#f8fafc",
  colon:       "#a0aec0",
};

/*
 * Page is 486 × 306 pt.
 * All spacing/font sizes are tuned to fill this canvas closely,
 * matching the proportions of the HTML/CSS card (530 × 335 px).
 */
export const styles = StyleSheet.create({

  /* ── Page shell ── */
  page: {
    backgroundColor: C.white,
    fontFamily: "Montserrat",
  },

  card: {
    width: 486,
    height: 306,
    backgroundColor: C.white,
    flexDirection: "column",
    overflow: "hidden",
  },

  /* ══════════════════════════════════════
     FRONT — header dome
     Replicates clip-path:ellipse via large
     bottom border-radius + extra padding.
  ══════════════════════════════════════ */
  frontHeader: {
    backgroundColor: C.navyDeep,
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 34,       // Extra padding creates dome "belly"
    paddingHorizontal: 16,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 180,
  },

  frontLogo: {
    width: 38,
    height: 38,
    objectFit: "contain",
    marginBottom: 3,
  },

  frontTitle: {
    fontSize: 15,
    fontWeight: 900,
    color: C.white,
    letterSpacing: 0.5,
    lineHeight: 1.1,
  },

  frontTaglineRow: {
    flexDirection: "row",
    marginTop: 4,
    alignItems: "center",
  },

  frontTaglineWord: {
    fontSize: 6,
    fontWeight: 700,
    color: C.white,
    letterSpacing: 2,
  },

  frontTaglineSep: {
    fontSize: 6,
    fontWeight: 400,
    color: C.blueLight,
    marginHorizontal: 3,
  },

  /* ── Front body — pulled up into dome ── */
  frontBody: {
    flexDirection: "row",
    paddingHorizontal: 20,
    flexGrow: 1,
    alignItems: "center",
    marginTop: -16,   // Pulls body up into dome's extra padding
    gap: 16,
  },

  frontBodyLeft: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3.5,
    borderBottomWidth: 0.75,
    borderBottomColor: C.borderLight,
    borderBottomStyle: "solid",
  },

  detailRowLast: {
    borderBottomWidth: 0,
  },

  detailLabel: {
    width: 82,
    fontSize: 8.5,
    fontWeight: 700,
    color: C.navy,
  },

  detailColon: {
    width: 10,
    fontSize: 8.5,
    color: C.colon,
  },

  detailValue: {
    flex: 1,
    fontSize: 8.5,
    fontWeight: 600,
    color: C.textDark,
  },

  /* RIGHT: photo + name banner */
  frontBodyRight: {
    width: 110,
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    flexShrink: 0,
  },

  photoFrame: {
    width: 76,
    height: 94,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: C.navy,
    borderStyle: "solid",
    backgroundColor: C.bgLight,
  },

  photoImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  nameBanner: {
    width: "100%",
    backgroundColor: C.navyDeep,
    paddingVertical: 4,
    paddingHorizontal: 4,
    alignItems: "center",
    borderRadius: 3,
  },

  nameBannerText: {
    color: C.white,
    fontSize: 8,
    fontWeight: 900,
    letterSpacing: 0.5,
  },

  /* ══════════════════════════════════════
     BACK — header dome (shallower)
  ══════════════════════════════════════ */
  backHeader: {
    backgroundColor: C.navyDeep,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 28,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 180,
  },

  backMiniLogo: {
    width: 36,
    height: 36,
    objectFit: "contain",
  },

  /* ── Back content ── */
  backContentStack: {
    flexDirection: "column",
    paddingHorizontal: 20,
    gap: 8,
    flexGrow: 1,
    marginTop: -12,
  },

  backSection: {
    flexDirection: "column",
    gap: 5,
  },

  /* Section header divider row */
  sectionDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  sectionLine: {
    flex: 1,
    height: 0.75,
    backgroundColor: C.borderFaint,
  },

  sectionBadge: {
    backgroundColor: C.navy,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 3,
  },

  sectionBadgeText: {
    color: C.white,
    fontSize: 6.5,
    fontWeight: 800,
    letterSpacing: 0.6,
  },

  /* T&C two-column grid */
  tcGrid: {
    flexDirection: "row",
    gap: 14,
  },

  tcCol: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },

  tcItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
  },

  bulletPoint: {
    width: 4,
    height: 4,
    backgroundColor: C.navy,
    borderRadius: 1,
    marginTop: 2.5,
    flexShrink: 0,
  },

  tcText: {
    flex: 1,
    fontSize: 7,
    color: C.textMid,
    lineHeight: 1.35,
  },

  /* Contact two-column grid + QR */
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  contactInfoBlock: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },

  contactCol: {
    flex: 1,
    flexDirection: "column",
    gap: 5,
  },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  contactIcon: {
    fontSize: 7.5,
    color: C.navy,
    flexShrink: 0,
    width: 10,
  },

  contactText: {
    fontSize: 7,
    color: C.textMid,
    fontWeight: 600,
    flex: 1,
  },

  qrCodeBox: {
    width: 48,
    height: 48,
    borderWidth: 0.75,
    borderColor: C.borderFaint,
    borderStyle: "solid",
    borderRadius: 4,
    padding: 3,
    backgroundColor: C.white,
    flexShrink: 0,
  },

  qrCodeImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  /* ── Back footer ── */
  backFooter: {
    backgroundColor: C.navyDeep,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "column",
    marginTop: "auto",
  },

  footerNote: {
    fontFamily: "Dancing Script",
    fontSize: 11,
    color: C.blueLight,
    lineHeight: 1,
  },

  footerInstitution: {
    fontSize: 9.5,
    fontWeight: 900,
    color: C.white,
    letterSpacing: 1.5,
    marginTop: 1,
  },
});