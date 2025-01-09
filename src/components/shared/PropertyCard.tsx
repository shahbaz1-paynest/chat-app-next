"use client";

import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import Image from "next/image";
import { DollarSign, Calendar, TrendingUp, Building2 } from "lucide-react";

interface PropertyCardProps {
  title: string;
  price: string;
  location: string;
  annualRent: string;
  maintenance: string;
  timeToRent: string;
  capitalGain: string;
  image: string;
}

export default function PropertyCard({
  title,
  price,
  location,
  annualRent,
  maintenance,
  timeToRent,
  capitalGain,
  image,
}: PropertyCardProps) {
  const MetricBox = ({ 
    icon: Icon, 
    label, 
    value 
  }: { 
    icon: React.ElementType, 
    label: string, 
    value: string 
  }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        flexDirection: "column",
        minWidth: "60px", // Reduced from 80px
        paddingBottom:"11px"
      }}
    >
      <Icon className="w-4 h-4 text-gray-500" />
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ 
          fontSize: "0.7rem", // Slightly smaller font
          textAlign: "center",
          whiteSpace: "nowrap"
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="body2" 
        fontWeight="600"
        sx={{ 
          fontSize: "0.8rem", // Slightly smaller font
          color: "#1f2937"
        }}
      >
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        padding: "12px", 
        borderRadius: "12px",
        backgroundColor: "#FFF",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
        gap: 1.5,
        marginBottom: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        width: "100%",
        maxWidth: "490px",
        "&:hover": {
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "110px",
          height: "110px",
          borderRadius: "10px",
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: "#f3f4f6",
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="100px"
          style={{ 
            objectFit: "cover",
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "Outfit",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "2px"
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#6b7280",
              fontSize: "0.8rem"
            }}
          >
            {location}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
            position: "relative",
            paddingTop: "6px",
          }}
        >
          <MetricBox icon={DollarSign} label="Annual Rent" value={annualRent} />
          <Divider orientation="vertical" flexItem />
          <MetricBox icon={Building2} label="Maintenance" value={maintenance} />
          <Divider orientation="vertical" flexItem />
          <MetricBox icon={Calendar} label="Time to Rent" value={timeToRent} />
          <Divider orientation="vertical" flexItem />
          <MetricBox icon={TrendingUp} label="Capital Gain" value={capitalGain} />
          
          <Box
            sx={{
              position: "absolute",
              bottom: "-20px",
              right: 0,
              backgroundColor: "#f8fafc",
              padding: "3px 10px",
              borderRadius: "6px", 
            }}
          >
            <Typography 
              sx={{ 
                color: "#1d4ed8",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              {price}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}