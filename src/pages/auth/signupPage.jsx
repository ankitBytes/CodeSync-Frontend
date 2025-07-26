import React from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const SignupPage = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f0f2f5"
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

        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          <TextField label="Email" fullWidth />
          {/* <TextField label="Password" type="password" fullWidth /> */}
          <Button variant="contained" fullWidth sx={{ mt: 1 }}>
            Login
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Button variant="outlined" fullWidth startIcon={<GoogleIcon />}>
          Sign up with Google
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <a href="/login">Log In</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignupPage;
