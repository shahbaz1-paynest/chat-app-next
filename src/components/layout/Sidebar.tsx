"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import PropertyCard from "@/components/shared/PropertyCard";

interface SidebarProps {
  properties: {
    title: string;
    price: string;
    location: string;
    annualRent: string;
    maintenance: string;
    timeToRent: string;
    capitalGain: string;
    image: string;
  }[];
}

export default function Sidebar({ properties }: SidebarProps) {
  return (
    <Box
      sx={{
        width: '550px',
        backgroundColor: '#fff',
        borderLeft: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          padding: '24px',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '16px'
          }}
        >
          Summary
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '16px' }}>
          <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Real Estate for Rent
          </Typography>
          <Typography sx={{ color: '#6B7280' }}>•</Typography>
          <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Dubai
          </Typography>
          <Typography sx={{ color: '#6B7280' }}>•</Typography>
          <Typography sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Downtown Dubai
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {['Downtown', 'DIFC', 'Marina'].map((tag) => (
            <Box
              key={tag}
              sx={{
                backgroundColor: '#EFF6FF',
                color: '#3B82F6',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '0.875rem',
              }}
            >
              {tag}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Properties Section */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '16px'
          }}
        >
          Top Properties
        </Typography>

        {properties.map((property, index) => (
          <PropertyCard
            key={index}
            {...property}
          />
        ))}
      </Box>
    </Box>
  );
}