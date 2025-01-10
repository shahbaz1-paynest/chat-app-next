"use client";

import React, { useContext, useState } from "react";
import { Box, Typography, Button, InputBase } from "@mui/material";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import PromptContext from "@/context/promptContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const [alignment, setAlignment] = useState("buy");
  const [filters, setFilters] = useState({
    where: "",
    price: "",
    bedsBath: "",
    propertyType: "",
    furnishing: "",
  });
  const router = useRouter();
  const { setPreferences } = useContext(PromptContext);

  const handleInputChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    const { where, price, bedsBath, furnishing, propertyType } = filters;
    const prompt = `I want to ${alignment} a property of type ${propertyType} which is located at ${where}, with a price range of ${price}, my preference regarding beds and bath is ${bedsBath}, and if ${furnishing}, it would be great.`;
    setPreferences(prompt);
    router.push("/chat");
  };

  return (
    <Box
      sx={{
        overflow: "auto",
        backgroundColor: "#F9FAFB",
        height: "100vh",
      }}
    >
      {/* Navbar */}
      <Navbar />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          height: "calc(100vh - 72px)", // Full screen height minus navbar height
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            flex: 1,
            padding: { xs: "24px", sm: "32px", md: "64px" },
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h3"
            fontWeight="700"
            gutterBottom
            sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}
          >
            Hey, I'm an Opportunity Finder
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: "80%",
              marginBottom: 4,
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          >
            Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam
            nonumy eirmod tempor.
          </Typography>
          <Typography variant="h5" fontWeight="700" sx={{ marginBottom: 2 }}>
            What are you looking for today?
          </Typography>

          {/* Buy/Rent Toggle */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#F1F3F5",
              borderRadius: "30px",
              padding: "4px",
              maxWidth: "200px",
              marginBottom: 4,
            }}
          >
            <Box
              onClick={() => setAlignment("buy")}
              sx={{
                flex: 1,
                textAlign: "center",
                padding: "8px 16px",
                borderRadius: "30px",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                backgroundColor: alignment === "buy" ? "#000" : "transparent",
                color: alignment === "buy" ? "#FFF" : "#000",
                transition: "all 0.3s ease",
              }}
            >
              Buy
            </Box>
            <Box
              onClick={() => setAlignment("rent")}
              sx={{
                flex: 1,
                textAlign: "center",
                padding: "8px 16px",
                borderRadius: "30px",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                backgroundColor: alignment === "rent" ? "#000" : "transparent",
                color: alignment === "rent" ? "#FFF" : "#000",
                transition: "all 0.3s ease",
              }}
            >
              Rent
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 2 },
              backgroundColor: "#FFF",
              borderRadius: { xs: "16px", md: "100px" },
              padding: { xs: "20px", md: "16px 40px" },
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              marginBottom: 3,
              overflowX: { xs: "hidden", md: "visible" },
            }}
          >
            {[
              { label: "Where", placeholder: "Address, City or Zip", key: "where" },
              { label: "Price", placeholder: "Add price", key: "price" },
              { label: "Beds & Bath", placeholder: "Add bed & bath", key: "bedsBath" },
              { label: "Property Type", placeholder: "Property", key: "propertyType" },
              { label: "Furnishing", placeholder: "Furnishing", key: "furnishing" },
            ].map(({ label, placeholder, key }) => (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  width: { xs: "100%", md: "150px" },
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
                  onChange={(e: any) => handleInputChange(key, e.target.value)}
                  sx={{
                    width: "100%",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </Box>
            ))}
          </Box>

          <Button
            onClick={handleSearch}
            variant="contained"
            sx={{
              backgroundColor: "#1D4ED8",
              color: "#FFF",
              borderRadius: "50px",
              padding: "10px 30px",
              fontWeight: "600",
              textTransform: "capitalize",
              fontSize: "1rem",
              width: { xs: "100%", sm: "auto" },
              "&:hover": { backgroundColor: "#174BAC" },
            }}
          >
            Search
          </Button>
        </Box>

        <Box
          sx={{
            width: { md: "30%" },
            height: "100%", 
            position: "relative",
            display: { xs: "none", md: "block" },
          }}
        >
          <Image
            src="/dash.png"
            alt="Property Image"
            fill
            style={{
              borderRadius: "0px",
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
