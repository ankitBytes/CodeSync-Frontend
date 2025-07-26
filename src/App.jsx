import React, { useMemo, useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { Routes, Route, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/userSlice.js";
import { jwtDecode } from "jwt-decode";
import NavBar from "./components/navbar.jsx";
import LandingPage from "./pages/landing";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signupPage";

function App() {
  const [mode, setMode] = useState("light"); // toggleable
  const dispatch = useDispatch();
  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      const decodedToken = jwtDecode(token);
      dispatch(loginSuccess(decodedToken));
    } else {
      const savedToken = localStorage.getItem("authToken");
      if (savedToken) {
        const decodedUser = jwtDecode(savedToken);
        dispatch(loginSuccess(decodedUser));
      }
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route
            index
            element={<LandingPage mode={mode} setMode={setMode} />}
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

const RootLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default App;
