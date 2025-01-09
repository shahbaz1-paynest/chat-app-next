"use client";

import React from "react";
import { Button } from "@mui/material";

interface SearchButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function SearchButton({ onClick, disabled }: SearchButtonProps) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      sx={{
        backgroundColor: "#1D4ED8",
        color: "white",
        borderRadius: "50px",
        padding: "8px 32px",
        "&:hover": { backgroundColor: "#174BAC" },
        marginTop: "16px",
      }}
    >
      Search
    </Button>
  );
}
