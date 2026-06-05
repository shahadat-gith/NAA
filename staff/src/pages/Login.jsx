import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoCallOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";

import { apis } from "../services/api";
import { useAppContext } from "../context/Context";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import { cleanPhoneNumber } from "../services/utils";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert"; // Imported your new renamed component

const Login = () => {
  const navigate = useNavigate();
  const { staff, setStaff } = useAppContext();

  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (staff) {
      navigate("/", { replace: true });
    }
  }, [staff, navigate]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    const cleanContact = cleanPhoneNumber(contact);

    if (!cleanContact || cleanContact.length < 10) {
      setErrorMsg("Please enter a valid 10-digit contact number.");
      return;
    }

    if (!password.trim()) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const data = await apis.login(cleanContact, password);

      if (data?.success) {
        const token = data.token;
        const staffProfileData = data.staff;

        if (!token || !staffProfileData) {
          setErrorMsg(
            "Could not set up your secure session. Please try again.",
          );
          return;
        }

        localStorage.setItem("staff-token", token);
        setStaff(staffProfileData);
      } else {
        setErrorMsg(data?.message || "Incorrect contact number or password.");
      }
    } catch (error) {
      setErrorMsg(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-3xl shadow-2xl shadow-black/5 border bg-card border-border overflow-hidden transition-all duration-300">
          {/* Header Section */}
          <div className="flex flex-col items-center pt-4 pb-4 sm:pt-5 sm:pb-5 px-4 sm:px-8 text-center border-b border-border">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-2 sm:mb-3 shadow-inner bg-card border border-border shadow-primary/5">
              <img
                src="/logo.png"
                alt="Nashib Ali Academy"
                className="w-11 h-11 sm:w-16 sm:h-16 object-contain drop-shadow-sm"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-text-primary transition-all duration-200">
              Nashib Ali Academy
            </h1>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[2px] sm:tracking-[3px] mt-1 sm:mt-1.5 text-primary transition-all duration-200">
              STAFF PORTAL
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-6">
            {/* Contact Input */}
            <div className="space-y-2">
              <div className="flex items-center border rounded-2xl px-3 sm:px-5 py-1 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200 min-w-0 border-border bg-background">
                <div className="flex-shrink-0 flex items-center justify-center text-text-secondary">
                  <IoCallOutline size={20} />
                </div>
                <input
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Contact Number"
                  disabled={loading}
                  className="flex-1 min-w-0 py-2 ml-2 sm:ml-3 bg-transparent text-sm sm:text-base outline-none font-medium text-text-primary placeholder:text-text-secondary/50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center border rounded-2xl px-3 sm:px-5 py-1 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200 min-w-0 border-border bg-background">
                <div className="flex-shrink-0 flex items-center justify-center text-text-secondary">
                  <IoLockClosedOutline size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  disabled={loading}
                  className="flex-1 min-w-0 py-2 ml-2 sm:ml-3 bg-transparent text-sm sm:text-base outline-none font-medium text-text-primary placeholder:text-text-secondary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 sm:p-2 text-text-secondary hover:text-text-primary transition-colors flex-shrink-0 border-none bg-transparent cursor-pointer outline-none"
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalVisible(true)}
                className="text-sm font-medium hover:underline transition-all cursor-pointer bg-transparent border-none outline-none text-text-secondary hover:text-text-primary"
              >
                Forgot Password?
              </button>
            </div>

            {/* Form Submission Button */}
            <Button
              type="submit"
              variant="accent"
              size="lg"
              fullWidth={true}
              loading={loading}
            >
              SIGN IN
            </Button>
          </form>
        </div>
      </div>

      {/* Forgot Password Configuration Overlay Modal */}
      <ForgotPasswordModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />

      {/* Converted React Native Pop-Up Alert Modal Equivalent */}
      <Alert
        visible={!!errorMsg}
        title="Login Error"
        message={errorMsg}
        variant="danger"
        onClose={() => setErrorMsg("")}
        buttons={[
          {
            text: "Try Again",
            variant: "accent",
            onClick: () => setErrorMsg(""),
          },
        ]}
      />
    </div>
  );
};

export default Login;