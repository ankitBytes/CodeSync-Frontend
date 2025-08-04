import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/logo/logo.png";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function NavBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigateMenu = (e, menu) => {
    e.preventDefault();
    navigate(`/${menu}`);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/logout", {
        method: "GET",
        credentials: "include", // 👈 Required for cookies/session
      });

      if (!res.ok) {
        throw new Error(`Logout failed with status ${res.status}`);
      }

      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log("Logout error: ", error.message);
    }
  };

  return (
    <AppBar position="static" sx={{ boxShadow: "none" }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ justifyContent: "space-between", paperShadow: "none" }}
        >
          {/* Logo - always on the left */}
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{
              width: "150px",
              height: "80px",
              display: "flex",
              alignItems: "center",
            }}
          />

          {/* Profile Avatar - always on the right */}
          <Box sx={{ flexGrow: 0 }}>
            {currentUser ? (
              <>
                <Tooltip title={currentUser?.displayName?.split(" ")[0] || ""}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Profile" src={currentUser?.image}>
                      {currentUser?.displayName?.charAt(0) || "U"}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={
                        setting == logout
                          ? (e) => handleNavigateMenu(e, setting)
                          : () => handleLogout()
                      }
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                sx={{
                  padding: "0.5rem 2rem",
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
