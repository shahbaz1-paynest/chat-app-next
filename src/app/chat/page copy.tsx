"use client";

import React, { useState } from "react";
import { Box, Typography, IconButton, InputBase, Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";
import MessageBubble from "@/components/shared/Message";
import Sidebar from "@/components/layout/Sidebar";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { text: "Both Personal Use And Potential For Investment Growth - Targeting At Least 6% ROI.", isSender: true },
    {
      text: `Thanks for sharing all the details! I'll focus on:
      1: Studio apartments within 500K–650K AED.
      2: Family-friendly communities with kindergartens nearby.
      3: Modern units with smart home and amenities like parks, retail stores, and public transport.
      4: 15 minutes away from Dubai Marina by car.
      
      If anything else comes to mind, feel free to let me know.
      On average, it takes 15–21 days to find a great match!
      Would you like regular updates as I find matching properties?`,
      isSender: false,
    },
    { text: "Yes, Please!", isSender: true },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const properties = [
    {
      title: "Downtown Dubai, Dubai",
      price: "48k, 412 sq.ft",
      location: "Dubai, UAE",
      annualRent: "65k",
      maintenance: "5.4k",
      timeToRent: "12 Days",
      capitalGain: "8%",
      image: "/dash.png",
    },
    {
      title: "Modern Studio, JVC",
      price: "53k, 73.07 sq.ft",
      location: "JVC, Dubai",
      annualRent: "80k",
      maintenance: "6.2k",
      timeToRent: "11%",
      capitalGain: "11%",
      image: "/dash.png",
    },
    {
      title: "Golden Dream Tower 1, JVC",
      price: "48k, 412 sq.ft",
      location: "JVC, Dubai",
      annualRent: "54k",
      maintenance: "5.1k",
      timeToRent: "6%",
      capitalGain: "6%",
      image: "/dash.png",
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, isSender: true }]);
      setNewMessage("");
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F9FAFB',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#FFF',
          height: '72px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            sx={{ 
              color: '#000',
              '&:hover': { backgroundColor: '#F3F4F6' }
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
            Tranquil Studio Apartments
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: '#1D4ED8',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#1e40af' },
            boxShadow: 'none',
            fontSize: '0.875rem',
            padding: '6px 16px',
          }}
        >
          Share
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Chat Area */}
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F9FAFB',
          }}
        >
          {/* Messages Container */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
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
            {messages.map((message, index) => (
              <MessageBubble key={index} text={message.text} isSender={message.isSender} />
            ))}
          </Box>

          {/* Input Section */}
          <Box
            sx={{
              padding: '16px 24px',
              borderTop: '1px solid #E5E7EB',
              backgroundColor: '#FFF',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <InputBase
                placeholder="Ask PropertyAI anything..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                sx={{
                  backgroundColor: '#1D4ED8',
                  color: '#FFF',
                  '&:hover': { backgroundColor: '#1e40af' },
                  padding: '8px',
                }}
              >
                <SendIcon sx={{ fontSize: '1.25rem' }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Sidebar */}
        <Sidebar properties={properties} />
      </Box>
    </Box>
  );
}
