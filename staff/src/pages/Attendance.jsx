import { useCallback, useEffect, useState } from "react";
import { QrCode, Loader2 } from "lucide-react";

import { apis } from "../services/api";
import { useAppContext } from "../context/Context";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import Loader from "../components/common/Loader";

import CalendarCard from "../components/attendance/CalendarCard";
import AttendanceHistory from "../components/attendance/AttendanceHistory";
import ScannerModal from "../components/modals/ScannerModal";

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

  const getTodayISTString = () => {
    return new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
  };

  const isTodayAttendanceMarked = history.some((att) => {
    if (!att.date) return false;
    return att.date.split("T")[0] === getTodayISTString();
  });

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {loading && <Loader fullScreen={true} size="medium" />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border">
        <div className="mb-4 flex justify-end border-b border-border pb-6">
          <Button
            type="button"
            variant={isTodayAttendanceMarked ? "outline" : "accent"}
            size="lg"
            disabled={marking || isTodayAttendanceMarked}
            onClick={() => setShowScanner(true)}
            icon={marking ? undefined : QrCode}
            className="w-full sm:w-auto px-6 h-14 shrink-0"
          >
            {marking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isTodayAttendanceMarked ? (
              "Verified for Today"
            ) : (
              "Scan QR"
            )}
          </Button>
        </div>
      </div>

      {/* Flattened Alert Status Banner */}
      {isTodayAttendanceMarked && (
        <div className="mb-6 p-4 rounded-2xl border bg-success/5 border-success/20 text-success text-sm font-bold flex items-center space-x-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Attendance has been marked for today.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Interactive Month-by-Month Matrix */}
        <div className="lg:col-span-2">
          <CalendarCard
            history={history}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </div>

        {/* Chronological List Sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <AttendanceHistory history={history} />
        </div>
      </div>

      {/* Web Standard Modular Camera QR Overlay Frame Component */}
      <ScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={markAttendance}
        isMarking={marking}
      />

      {/* System Popup Notification Alert */}
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
