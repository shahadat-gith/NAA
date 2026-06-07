import { useCallback, useEffect, useState, useMemo } from "react";
import { apis } from "../services/api";
import { useAppContext } from "../context/Context";
import Alert from "../components/common/Alert";
import Loader from "../components/common/Loader";

import { Logs } from "../components/attendance/Logs";
import { SummaryTile } from "../components/attendance/SummaryTile";
import { Calendar } from "../components/attendance/Calendar";
import { Header } from "../components/attendance/Header";
import ScannerModal from "../components/modals/ScannerModal";
import AnimatedScreen from "../components/common/AnimatedScreen";

const Attendance = () => {
  const { staff } = useAppContext();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info",
  });

  const fetchMonthlyAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apis.getAttendanceHistory(
        selectedMonth + 1,
        selectedYear,
      );
      if (data?.success) {
        setHistory(data.attendance || []);
      }
    } catch (err) {
      setHistory([]);
      setAlertConfig({
        visible: true,
        title: "Sync Error",
        message:
          err?.response?.data?.message ||
          err.message ||
          "Could not retrieve logs.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchMonthlyAttendance();
  }, [fetchMonthlyAttendance]);

  const markAttendance = async (qrToken) => {
    setMarking(true);
    try {
      const data = await apis.markAttendance(qrToken, "Staff", "Present");
      if (data?.success) {
        setShowScanner(false);
        setHistory(data.attendance || []);
        setAlertConfig({
          visible: true,
          title: "Success",
          message: "Attendance recorded successfully.",
          variant: "success",
        });
      }
    } catch (err) {
      setShowScanner(false);
      setAlertConfig({
        visible: true,
        title: "Marking Failed",
        message:
          err?.response?.data?.message ||
          err.message ||
          "Verification rejected.",
        variant: "danger",
      });
    } finally {
      setMarking(false);
    }
  };

  const isTodayAttendanceMarked = useMemo(() => {
    const todayIST = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    return history.some(
      (att) => att.date && att.date.split("T")[0] === todayIST,
    );
  }, [history]);

  const analyticsSummary = useMemo(() => {
    if (!history.length) return { present: 0, leave: 0, absent: 0, rate: 0 };
    let [present, leave, absent] = [0, 0, 0];

    history.forEach((log) => {
      const status = log.status?.toLowerCase();
      if (status === "present") present++;
      else if (status === "leave" || status === "on leave") leave++;
      else if (status === "absent") absent++;
    });

    const totalTracked = present + leave + absent;
    return {
      present,
      leave,
      absent,
      rate: totalTracked > 0 ? Math.round((present / totalTracked) * 100) : 0,
    };
  }, [history]);

  return (
    <main className="w-full px-4 py-6 space-y-6 max-w-md mx-auto animate-fade-in">
      {loading && <Loader fullScreen={true} size="medium" />}

      {/* Modern, micro-gradient action header */}
      <Header
        isTodayAttendanceMarked={isTodayAttendanceMarked}
        marking={marking}
        onScanTrigger={() => setShowScanner(true)}
      />

      <div className="space-y-6">
        {/* FIXED POSITIONING: Analytics summary rows are rendered immediately at the top */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary/50 block mb-3 px-0.5 select-none">
            Monthly Analytics Summary
          </span>
          <div className="grid grid-cols-4 gap-2">
            <SummaryTile
              title="Present"
              value={analyticsSummary.present}
              textColor="text-success"
            />
            <SummaryTile
              title="Leave"
              value={analyticsSummary.leave}
              textColor="text-amber-500"
            />
            <SummaryTile
              title="Absent"
              value={analyticsSummary.absent}
              textColor="text-danger"
            />
            <SummaryTile
              title="Rate"
              value={`${analyticsSummary.rate}%`}
              textColor="text-text-primary"
            />
          </div>
        </div>

        {/* Autonomous Interactive Calendar Sub-Component */}
        <Calendar
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          history={history}
        />

        {/* Chronological List History Stream Log */}
        <Logs logs={history} />
      </div>

      {/* Camera Scanning Overlay Device Sheet */}
      <ScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={markAttendance}
        isMarking={marking}
      />

      {/* Shared Interceptor Custom Global Notification System */}
      <Alert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        buttons={[
          {
            text: "Okay",
            variant: "accent",
            onClick: () =>
              setAlertConfig((prev) => ({ ...prev, visible: false })),
          },
        ]}
      />
    </main>
  );
};

export default Attendance;