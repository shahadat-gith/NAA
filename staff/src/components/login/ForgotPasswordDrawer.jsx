import { useState, useEffect } from "react";
import {
  IoMailOutline,
  IoKeypadOutline,
  IoLockClosedOutline,
  IoShieldCheckmarkOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoCloseOutline,
} from "react-icons/io5";

import { apis } from "../../services/api";
import Button from "../common/Button";
import { useDrawerAnimation } from "../../hooks/useDrawerAnimation";

const ForgotPasswordDrawer = ({ visible, onClose }) => {
  const [step, setStep] = useState("send-otp");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Connect your centralized hardware animation hooks orchestrator
  const { render, animate } = useDrawerAnimation(visible, 300);

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
        setFeedback({
          type: "error",
          message: "Please provide your email address.",
        });
        return;
      }
      if (!validateEmail(targetEmail)) {
        setFeedback({
          type: "error",
          message: "Please enter a valid email address.",
        });
        return;
      }
    }

    if (step === "verify-otp") {
      if (!otp.trim() || otp.length !== 6) {
        setFeedback({
          type: "error",
          message: "Please input the complete 6-digit verification code.",
        });
        return;
      }
    }

    if (step === "reset-password") {
      if (!newPassword.trim() || !confirmPassword.trim()) {
        setFeedback({ type: "error", message: "Please fill all fields." });
        return;
      }
      if (newPassword.length < 6) {
        setFeedback({
          type: "error",
          message: "Passwords must be at least 6 characters.",
        });
        return;
      }
      if (newPassword !== confirmPassword) {
        setFeedback({
          type: "error",
          message: "Your new password entries do not match.",
        });
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
        message:
          error?.response?.data?.message ||
          error.message ||
          "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!render) return null;

  return (
    /* Fade Transition Mask Backdrop Layer */
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end transition-opacity duration-300 ease-out ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 -z-10"
        onClick={loading ? undefined : handleDismiss}
      />

      <div
        className={`w-full h-auto bg-card border-t border-border rounded-t-4xl flex flex-col shadow-2xl transition-transform duration-300 transform will-change-transform ease-[cubic-bezier(0.32,0.94,0.6,1)] ${
          animate ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Mobile Pull Indicator Drag Bar Notch */}
        <div className="w-10 h-1 bg-border/80 rounded-full mx-auto my-3.5 shrink-0" />

        {/* Header Block Row Area */}
        <div className="px-5 pb-3 flex items-center justify-between border-b border-border/40 shrink-0">
          <div className="min-w-0">
            <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">
              {step === "send-otp" && "Forgot Password"}
              {step === "verify-otp" && "Verify Security Code"}
              {step === "reset-password" && "Reset Password"}
            </h3>
            <p className="mt-0.5 text-[11px] font-medium text-text-secondary leading-tight max-w-70">
              {step === "send-otp" &&
                "Input your email address to get a password reset code."}
              {step === "verify-otp" &&
                `Type code sent directly to active inbox at: ${email.trim().toLowerCase()}`}
              {step === "reset-password" &&
                "Add a strong and secure password replacement standard."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            disabled={loading}
            className="p-1.5 rounded-lg border border-border bg-background text-text-secondary active:scale-90 transition-transform cursor-pointer outline-none shrink-0"
          >
            <IoCloseOutline size={14} />
          </button>
        </div>

        {/* Modular Workflow Form Canvas Container */}
        <form
          onSubmit={handleFormSubmission}
          className="flex-1 flex flex-col justify-between overflow-hidden"
        >
          {/* Main Core Scroll Box Field Wrapper */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">
            {/* Dynamic Interactive Feedback Status Block Banner */}
            {feedback.message && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-bold transition-colors duration-200 text-center select-none ${
                  feedback.type === "error"
                    ? "bg-danger/10 border-danger/20 text-danger"
                    : "bg-success/10 border-success/20 text-success"
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Render Context Step 1: Mail Query box */}
            {step === "send-otp" && (
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest px-0.5">
                  Email Address
                </label>
                <div className="flex items-center border rounded-xl px-3 py-1 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all duration-200 border-border/80 bg-background">
                  <IoMailOutline
                    size={16}
                    className="text-text-secondary/60 shrink-0"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Registered Email Address"
                    autoCapitalize="none"
                    autoComplete="off"
                    disabled={loading}
                    className="w-full py-2.5 ml-2.5 text-sm bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/40 font-bold"
                  />
                </div>
              </div>
            )}

            {/* Render Context Step 2: OTP Counter box */}
            {step === "verify-otp" && (
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest px-0.5 text-center">
                  Verification Code
                </label>
                <div className="flex items-center border rounded-xl px-4 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all duration-200 border-border/80 bg-background max-w-[200px] mx-auto w-full">
                  <IoKeypadOutline
                    size={16}
                    className="text-text-secondary/60 shrink-0"
                  />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="------"
                    maxLength={6}
                    disabled={loading}
                    className="w-full py-2.5 text-sm font-black text-center tracking-[6px] bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/30"
                  />
                </div>
              </div>
            )}

            {/* Render Context Step 3: Password Replace Matrix Row blocks */}
            {step === "reset-password" && (
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest px-0.5">
                    New Password
                  </label>
                  <div className="flex items-center border rounded-xl px-3 py-1 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all duration-200 border-border/80 bg-background">
                    <IoLockClosedOutline
                      size={16}
                      className="text-text-secondary/60 shrink-0"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      autoCapitalize="none"
                      disabled={loading}
                      className="w-full py-2.5 ml-2.5 text-sm bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/40 font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-text-secondary/60 hover:text-text-primary border-none bg-transparent cursor-pointer outline-none shrink-0"
                    >
                      {showPassword ? (
                        <IoEyeOffOutline size={16} />
                      ) : (
                        <IoEyeOutline size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest px-0.5">
                    Confirm New Password
                  </label>
                  <div className="flex items-center border rounded-xl px-3 py-1 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all duration-200 border-border/80 bg-background">
                    <IoShieldCheckmarkOutline
                      size={16}
                      className="text-text-secondary/60 shrink-0"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      autoCapitalize="none"
                      disabled={loading}
                      className="w-full py-2.5 ml-2.5 text-sm bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/40 font-bold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Actions Footer Panel Row */}
          <div className="p-5 border-t border-border/60 bg-background/50 flex items-center gap-3 shrink-0">
            <button
              type="button"
              disabled={loading}
              onClick={handleDismiss}
              className="flex-1 py-3 text-xs font-bold border border-border text-text-secondary rounded-xl active:scale-98 transition-transform bg-card cursor-pointer outline-none"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="accent"
              loading={loading}
              className="flex-1 rounded-xl font-black text-xs uppercase h-11 tracking-wider"
            >
              {step === "send-otp" && "Get Code"}
              {step === "verify-otp" && "Verify"}
              {step === "reset-password" && "Commit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordDrawer;
