import { useState } from "react";
import { 
  IoMailOutline, 
  IoKeypadOutline, 
  IoLockClosedOutline, 
  IoShieldCheckmarkOutline, 
  IoEyeOutline, 
  IoEyeOffOutline,
  IoCloseOutline
} from "react-icons/io5";

import { apis } from "../../services/api";
import Button from "../common/Button";

const ForgotPasswordModal = ({ visible, onClose }) => {
  const [step, setStep] = useState("send-otp");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleDismiss = () => {
    setStep("send-otp");
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setFeedback({ type: "", message: "" });
    onClose();
  };

  const validateEmail = (inputEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };

  const handleFormSubmission = async (e) => {
    if (e) e.preventDefault();
    setFeedback({ type: "", message: "" });
    const targetEmail = email.trim().toLowerCase();

    if (step === "send-otp") {
      if (!targetEmail) {
        setFeedback({ type: "error", message: "Please provide your email address." });
        return;
      }
      if (!validateEmail(targetEmail)) {
        setFeedback({ type: "error", message: "Please enter a valid email address." });
        return;
      }
    }

    if (step === "verify-otp") {
      if (!otp.trim() || otp.length !== 6) {
        setFeedback({ type: "error", message: "Please input the complete 6-digit verification code." });
        return;
      }
    }

    if (step === "reset-password") {
      if (!newPassword.trim() || !confirmPassword.trim()) {
        setFeedback({ type: "error", message: "Please fill all fields." });
        return;
      }
      if (newPassword.length < 6) {
        setFeedback({ type: "error", message: "Passwords must be at least 6 characters." });
        return;
      }
      if (newPassword !== confirmPassword) {
        setFeedback({ type: "error", message: "Your new password entries do not match." });
        return;
      }
    }

    setLoading(true);

    try {
      let data;

      if (step === "send-otp") {
        data = await apis.sendForgotOtp(targetEmail);
      } else if (step === "verify-otp") {
        data = await apis.verifyForgotOtp(targetEmail, otp.trim());
      } else if (step === "reset-password") {
        data = await apis.resetPassword(targetEmail, newPassword);
      }

      if (data?.success) {
        const backendMessage = data.message || "Action processed successfully.";

        if (step === "send-otp") {
          setFeedback({ type: "success", message: backendMessage });
          setStep("verify-otp");
        } else if (step === "verify-otp") {
          setFeedback({ type: "success", message: backendMessage });
          setStep("reset-password");
        } else if (step === "reset-password") {
          alert(backendMessage);
          handleDismiss();
        }
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.response?.data?.message || error.message || "An unexpected error occurred. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 animate-fade-in">
      <div 
        className="fixed inset-0 -z-10" 
        onClick={loading ? undefined : handleDismiss} 
      />

      <div className="w-full sm:max-w-md rounded-t-[32px] sm:rounded-2xl p-6 border bg-card border-border transition-all duration-300 overflow-y-auto max-h-[90vh] sm:max-h-[85vh] shadow-2xl">
        <div className="flex sm:hidden w-12 h-1.5 rounded-full self-center mb-6 bg-gray-300 mx-auto" />
        
        <div className="hidden sm:flex justify-end mb-2">
          <button 
            type="button"
            onClick={handleDismiss}
            disabled={loading}
            className="p-1 rounded-full hover:bg-text-primary/5 border-none bg-transparent cursor-pointer transition-colors text-text-secondary hover:text-text-primary outline-none"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2 tracking-tight text-text-primary">
            {step === "send-otp" && "Forgot Password"}
            {step === "verify-otp" && "Verify Security Code"}
            {step === "reset-password" && "Reset Password"}
          </h3>

          <p className="text-sm leading-relaxed whitespace-pre-line px-2 text-text-secondary">
            {step === "send-otp" && "Input your email address to get a password reset code."}
            {step === "verify-otp" && `Type the 6-digit verification code sent directly to your active inbox at: \n${email.trim().toLowerCase()}`}
            {step === "reset-password" && "Add a strong and secure password."}
          </p>
        </div>

        <form onSubmit={handleFormSubmission} className="space-y-5">
          {feedback.message && (
            <div className={`p-4 rounded-2xl border text-sm font-semibold transition-colors duration-200 text-center ${
              feedback.type === "error" 
                ? "bg-danger/10 border-danger text-danger" 
                : "bg-success/10 border-success text-success"
            }`}>
              {feedback.message}
            </div>
          )}

          {step === "send-otp" && (
            <div className="flex flex-col">
              <div className="flex items-center border rounded-2xl px-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200 border-border bg-background">
                <IoMailOutline size={20} className="text-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Registered Email Address"
                  autoCapitalize="none"
                  autoComplete="off"
                  disabled={loading}
                  className="flex-1 py-4 ml-3 text-sm bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/50"
                />
              </div>
            </div>
          )}

          {step === "verify-otp" && (
            <div className="flex flex-col">
              <div className="flex items-center border rounded-2xl px-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200 border-border bg-background">
                <IoKeypadOutline size={20} className="text-text-secondary" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-Digit OTP"
                  maxLength={6}
                  disabled={loading}
                  className="flex-1 py-4 ml-3 text-sm font-bold text-center tracking-[6px] bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/50"
                />
              </div>
            </div>
          )}

          {step === "reset-password" && (
            <div className="space-y-4">
              <div className="flex items-center border rounded-2xl px-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200 border-border bg-background">
                <IoLockClosedOutline size={20} className="text-text-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Secure Password"
                  autoCapitalize="none"
                  disabled={loading}
                  className="flex-1 py-4 ml-3 text-sm bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 flex items-center justify-center border-none bg-transparent cursor-pointer text-text-secondary hover:text-text-primary outline-none"
                >
                  {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </button>
              </div>

              <div className="flex items-center border rounded-2xl px-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200 border-border bg-background">
                <IoShieldCheckmarkOutline size={20} className="text-text-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  autoCapitalize="none"
                  disabled={loading}
                  className="flex-1 py-4 ml-3 text-sm bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/50"
                />
              </div>
            </div>
          )}

          {/* Action Execution Button - Submits based on current process layout step */}
          <Button
            type="submit"
            variant="accent"
            size="lg"
            fullWidth
            loading={loading}
          >
            {step === "send-otp" && "Send Verification Code"}
            {step === "verify-otp" && "Verify OTP"}
            {step === "reset-password" && "Commit New Password"}
          </Button>

          {/* Cancellation Secondary Button Trigger */}
          <Button
            type="button"
            variant="outline"
            size="md"
            fullWidth
            disabled={loading}
            onClick={handleDismiss}
          >
            Cancel and Close
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;