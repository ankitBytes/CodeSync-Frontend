import React, { useMemo, useState, useEffect } from "react";
import {
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Box,
} from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { Routes, Route, Outlet } from "react-router-dom";
import NavBar from "./components/navbar.jsx";
import LandingPage from "./pages/landing";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signupPage";
import Profile from "./pages/user/profile.jsx";
import ProfileUpdate from "./pages/user/updateProfile.jsx";
import { useDispatch } from "react-redux";
import {
  loginSuccess,
  logout,
  setCurrentUserData,
} from "./redux/userSlice.js";
import Loader from "./components/loader";
import { useSelector } from "react-redux";
import "./utils/httpClient";
import { apiUrl } from "./utils/api";
import GlobalSnackbar from "./components/GlobalSnackbar";

function App() {
  const [mode, setMode] = useState("light"); // toggleable
  const dispatch = useDispatch();
  const isGlobalLoading = useSelector((state) => state.loading.pendingRequests > 0);
  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );

  const [currentUser, setCurrentUser] = useState(null);
  const [_, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(apiUrl("/auth/me"), {
          headers: authHeaders,
          credentials: "include",
        });

        if (res.ok) {
          const user = await res.json();
          const authUser = user?.user ?? user;
          dispatch(loginSuccess(authUser));
          setCurrentUser(authUser);

          // ✅ Fetch profile only after auth success
          await fetchProfileData(authUser?.id);
        } else {
          dispatch(logout());
          setLoading(false); // 👈 End loading even if not authenticated
        }
      } catch (err) {
        dispatch(logout());
        setLoading(false);
        console.error("Error checking authentication:", err);
      }
    };

    const fetchProfileData = async (userId) => {
      try {
        const token = localStorage.getItem("token");
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(
          apiUrl(`/user/profile/${userId}`),
          {
            headers: authHeaders,
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          dispatch(setCurrentUserData(data.profile));
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false); // 👈 End loading once done
      }
    };

    checkAuth();
  }, [dispatch]);

  // Remove page-blocking gate; use global overlay instead

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isGlobalLoading && <Loader />}
      <GlobalSnackbar />
      <Routes>
        {/* ✅ NavBar only renders AFTER loading is done */}
        <Route path="/" element={<RootLayout />}>
          <Route
            index
            element={<LandingPage mode={mode} setMode={setMode} />}
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route
            path="/profile/update/:id"
            element={currentUser ? <ProfileUpdate /> : <LoginPage />}
          />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

const RootLayout = () => {
  return (
    <>
      <NavBar /> {/* 👈 This won't flash during loading anymore */}
      <Outlet />
    </>
  );
};

export default App;
