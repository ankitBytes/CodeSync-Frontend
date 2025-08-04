import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setEmail, clearEmail } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#fff"
      paddingTop={"3rem"}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: 350,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Welcome To CodeSync
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Create an account to get started
        </Typography>

        {otpVerified ? (
          <BasicDetails />
        ) : otpSent ? (
          <EnterOTP setOtpVerified={setOtpVerified} />
        ) : (
          <>
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <EnterEmail setOtpSent={setOtpSent} />
            </Box>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Button variant="outlined" fullWidth startIcon={<GoogleIcon />}>
              Sign up with Google
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Already have an account? <a href="/login">Log In</a>
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

const EnterEmail = ({ setOtpSent }) => {
  const [email, setEmailValue] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleSignup = async () => {
    if (!email) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/sendOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // needed if using cookies/session
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      dispatch(setEmail(email)); // store email in Redux
      alert("OTP sent to your email.");
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      // alert("Failed to send OTP. Please try again.");
      setError(error.message);
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      <Typography variant="h6" fontWeight="bold">
        {error ? "Error" : ""}
      </Typography>
      <TextField
        label="Email"
        fullWidth
        required
        onChange={(e) => setEmailValue(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        onClick={handleSignup}
      >
        Sign Up
      </Button>
    </Box>
  );
};

const EnterOTP = ({ setOtpVerified }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const email = useSelector((state) => state.user.email);
  const dispatch = useDispatch();

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < otp.length - 1) {
      document.querySelector(`input[name="otp-${index + 1}"]`)?.focus();
    }
  };

  const handleSubmitOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      alert("Please enter a 6-digit OTP.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // needed for cookies
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      // const signUpResponse = await fetch("http://localhost:3000/auth/signup", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   credentials: "include", // needed for cookies
      //   body: JSON.stringify({ email, password: data.password }), // assuming password is returned in data
      // })

      alert("OTP verified successfully!");
      setOtpVerified(true);
    } catch (error) {
      console.log("Error verifying OTP:", error.message);
      dispatch(clearEmail());
      setOtp(["", "", "", "", "", ""]); // reset OTP input
      alert("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <Box>
      <Box gap={1} display="flex" justifyContent="center">
        {otp.map((digit, index) => (
          <TextField
            key={index}
            name={`otp-${index}`}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            inputProps={{
              maxLength: 1,
              inputMode: "numeric",
              style: { textAlign: "center" },
            }}
            sx={{ width: 40 }}
          />
        ))}
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmitOtp}
      >
        Verify OTP
      </Button>
    </Box>
  );
};

const BasicDetails = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    
  }
  return (
    <Box gap={2} display={"flex"} flexDirection={"column"} paddingTop={"2rem"}>
      <TextField
        label="Enter Password"
        type="password"
        fullWidth
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Re-enter Password"
        type="password"
        fullWidth
        required
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        // onClick={handleSignup}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default SignupPage;
