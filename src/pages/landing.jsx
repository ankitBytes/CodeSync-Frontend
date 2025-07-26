import React, { useMemo, useState } from "react";
import { Typography, Container, Box } from "@mui/material";
import NavBar from "../components/navbar";
import HeroSection from "../components/landingPage/heroSection";

const LandingPage = ({ mode, setMode }) => {
  return (
    <Box>
      <HeroSection />
    </Box>
  );
};

export default LandingPage;
