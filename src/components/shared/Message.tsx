"use client";

import React from "react";
import { Box } from "@mui/material";

interface MessageBubbleProps {
  text: string;
  isSender?: boolean;
}

export default function MessageBubble({ text, isSender }: MessageBubbleProps) {
  return (
    <Box
      sx={{
        alignSelf: isSender ? "flex-end" : "flex-start",
        maxWidth: "70%",
        padding: "12px 16px",
        borderRadius: "16px",
        backgroundColor: isSender ? "#F3F4F6" : "#1F2937",
        color: isSender ? "#000" : "#FFF",
        marginBottom: "12px",
        fontSize: "0.95rem",
        // Add styles for HTML elements
        "& strong": {
          fontWeight: 600,
        },
        "& ul": {
          listStyle: "disc",
          marginLeft: "20px",
          marginTop: "8px",
          marginBottom: "8px",
        },
        "& li": {
          marginBottom: "4px",
          "&:last-child": {
            marginBottom: 0,
          },
        },
      }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: text }}
        style={{
          whiteSpace: 'pre-wrap',
        }}
      />
    </Box>
  );
}