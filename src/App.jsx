import React, { useMemo, useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { Routes, Route, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavBar from "./components/navbar.jsx";
import LandingPage from "./pages/landing";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signupPage";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./redux/userSlice.js";

function App() {
  const [mode, setMode] = useState("light"); // toggleable
  const dispatch = useDispatch();
  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const user = await res.json();
          dispatch(loginSuccess(user));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        dispatch(logout());
      }
    };

    checkAuth();
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
