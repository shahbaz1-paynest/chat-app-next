"use client";

import React, { ChangeEvent } from "react";
import { Box, Typography, InputBase } from "@mui/material";

interface FilterProps {
  filters: {
    where: string;
    price: string;
    bedsBath: string;
    propertyType: string;
    furnishing: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      where: string;
      price: string;
      bedsBath: string;
      propertyType: string;
      furnishing: string;
    }>
  >;
}

const filterDefinitions = [
  { label: "Where", placeholder: "Address, City or Zip", key: "where" },
  { label: "Price", placeholder: "Add price", key: "price" },
  { label: "Beds & Bath", placeholder: "Add bed & bath", key: "bedsBath" },
  { label: "Property Type", placeholder: "Property", key: "propertyType" },
  { label: "Furnishing", placeholder: "Furnishing", key: "furnishing" },
];

export default function SearchFilters({ filters, setFilters }: FilterProps) {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: e.target.value,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {filterDefinitions.map(({ label, placeholder, key }) => (
        <Box
          key={key}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="500"
            mb={0.5}
          >
            {label}
          </Typography>
          <InputBase
            placeholder={placeholder}
            value={filters[key as keyof typeof filters]}
            onChange={(e) => handleInputChange(e as ChangeEvent<HTMLInputElement>, key)}
            sx={{
              width: 150,
              padding: "4px 8px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              fontSize: "0.9rem",
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
