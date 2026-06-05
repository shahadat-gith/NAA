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
import ForgotPasswordDrawer from "../components/login/ForgotPasswordDrawer";
import { cleanPhoneNumber } from "../services/utils";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

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
          setErrorMsg("Could not set up your secure session. Please try again.");
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
    <div className="w-full min-h-screen px-4 py-8 flex flex-col justify-center max-w-md mx-auto bg-background animate-fade-in">
      
      {/* Container Box Wrapper */}
      <div className="bg-card border border-border rounded-2xl shadow-xl shadow-black/[0.02] overflow-hidden">
        
        {/* ================= MOBILE-FIRST BRAND HEADER ================= */}
        <div className="flex flex-col items-center pt-6 pb-4 px-4 text-center border-b border-border/40 select-none">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-2.5 shadow-inner bg-background border border-border/80 shadow-primary/5">
            <img
              src="/logo.png"
              alt="Nashib Ali Academy Logo"
              className="w-10 h-10 object-contain drop-shadow-xs"
            />
          </div>

          <h1 className="text-xl font-black tracking-tight text-text-primary">
            Nashib Ali Academy
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest mt-0.5 text-primary">
            Staff Portal
          </p>
        </div>

        {/* ================= INTERACTIVE INPUT FORM LAYOUT ================= */}
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          
          {/* Field: Phone Input Box */}
          <div className="space-y-1">
            <div className="flex items-center border rounded-xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all duration-200 border-border/80 bg-background">
              <div className="shrink-0 text-text-secondary/60">
                <IoCallOutline size={16} />
              </div>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Contact Number"
                disabled={loading}
                className="w-full py-2.5 ml-2.5 bg-transparent text-sm outline-none font-bold text-text-primary placeholder:text-text-secondary/40"
              />
            </div>
          </div>

          {/* Field: Password Input Box */}
          <div className="space-y-1">
            <div className="flex items-center border rounded-xl px-3.5 py-1 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all duration-200 border-border/80 bg-background">
              <div className="shrink-0 text-text-secondary/60">
                <IoLockClosedOutline size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={loading}
                className="w-full py-2.5 ml-2.5 bg-transparent text-sm outline-none font-bold text-text-primary placeholder:text-text-secondary/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-text-secondary/60 hover:text-text-primary transition-colors shrink-0 border-none bg-transparent cursor-pointer outline-none"
              >
                {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
              </button>
            </div>
          </div>

          {/* Auxiliary Account Help Links */}
          <div className="flex justify-end pt-0.5">
            <button
              type="button"
              onClick={() => setIsModalVisible(true)}
              className="text-xs font-bold transition-colors bg-transparent border-none outline-none text-text-secondary hover:text-primary cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Primary Form Submission Capsule */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="accent"
              size="lg"
              fullWidth={true}
              loading={loading}
              className="rounded-xl font-black tracking-wide text-xs uppercase"
            >
              Sign In
            </Button>
          </div>

        </form>
      </div>

      {/* Forgot Password Overhaul Overlay sheet Context */}
      <ForgotPasswordDrawer
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />

      {/* Interceptor System Popup Context Overlay notifications */}
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