"use client";

import React, { useState } from "react";
import { Box, Button, Typography, IconButton, Drawer } from "@mui/material";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = ["Home", "Properties", "Features", "FAQ", "Pricing"];

  const NavLinks = ({ isMobile = false }) => (
    <Box 
      sx={{ 
        display: "flex", 
        gap: 3,
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "center" : "inherit",
      }}
    >
      {navItems.map((item) => (
        <Link key={item} href={`/${item.toLowerCase()}`} passHref>
          <Typography
            variant="body1"
            color="white"
            sx={{
              cursor: "pointer",
              "&:hover": { color: "#1D4ED8" },
              fontSize: isMobile ? "1.1rem" : "inherit",
              py: isMobile ? 1 : 0,
            }}
          >
            {item}
          </Typography>
        </Link>
      ))}
    </Box>
  );

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "black",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: { xs: "12px 16px", md: "16px 32px" },
          maxWidth: "1440px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Mobile Menu Icon */}
        <IconButton
          onClick={() => setIsMobileMenuOpen(true)}
          sx={{
            color: "white",
            display: { xs: "flex", md: "none" },
            padding: "8px",
          }}
        >
          <Menu />
        </IconButton>

        {/* Desktop Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, flex: 1 }}>
          <NavLinks />
        </Box>

        {/* Centered Logo Section */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2,
            position: { xs: "absolute", md: "static" },
            left: "50%",
            transform: { xs: "translateX(-50%)", md: "none" },
          }}
        >
          <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
          <Typography 
            variant="h6" 
            color="white" 
            fontWeight="bold"
            sx={{
              display: { xs: "none", sm: "block" }
            }}
          >
            PropertyAI
          </Typography>
        </Box>

        {/* Call-to-Action Button */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1D4ED8",
              "&:hover": { backgroundColor: "#174BAC" },
              textTransform: "none",
              display: { xs: "none", sm: "flex" },
              whiteSpace: "nowrap",
            }}
          >
            Try for free
          </Button>
        </Box>

        {/* Mobile Menu Drawer */}
        <Drawer
          anchor="left"
          open={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          PaperProps={{
            sx: {
              width: "100%",
              maxWidth: "300px",
              backgroundColor: "black",
              padding: "24px",
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Close Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
              <IconButton 
                onClick={() => setIsMobileMenuOpen(false)}
                sx={{ color: "white" }}
              >
                <X />
              </IconButton>
            </Box>

            {/* Mobile Navigation Links */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <NavLinks isMobile />
            </Box>

            {/* Mobile CTA Button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1D4ED8",
                "&:hover": { backgroundColor: "#174BAC" },
                textTransform: "none",
                mt: 4,
              }}
            >
              Try for free
            </Button>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}