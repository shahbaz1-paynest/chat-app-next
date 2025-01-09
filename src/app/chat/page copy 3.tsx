"use client";

import React, { useState, useRef } from "react";
import { Box, Typography, IconButton, InputBase, Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";
import MessageBubble from "@/components/shared/Message";
import Sidebar from "@/components/layout/Sidebar";
import processMessageText from "@/utils/processMsg";

interface Message {
  text: string;
  isSender: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
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
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const responseRef = useRef("");


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

  // Function to extract content from API response chunks
  const extractContentFromChunk = (chunk: string): string | null => {
    const regex = /content='([^']+)'/g;
    const matches = [];
    let match;

    while ((match = regex.exec(chunk)) !== null) {
      matches.push(match[1]);
    }

    return matches.length > 0 ? matches.join("") : null;
  };

  // Handle streaming API response
  const handleStream = async (userMessage: string) => {
    try {
      setIsLoading(true);
      responseRef.current = "";

      // Add user message to chat
      setMessages(prev => [...prev, { text: userMessage, isSender: true }]);
      
      // Add empty AI message that will be updated
      setMessages(prev => [...prev, { text: "", isSender: false }]);

      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();

      // Process the stream
      while (true) {
        const { value, done } = await reader.read();
        
        if (done) break;
        
        if (value) {
          const chunk = decoder.decode(value);
          const content = extractContentFromChunk(chunk);

          if (content) {
            // Accumulate the response
            responseRef.current += content;
            
            // Process the accumulated text for formatting
            const formattedText = processMessageText(responseRef.current);
            
            // Update the last message with the processed text
            setMessages(prev => [
              ...prev.slice(0, -1),
              { text: formattedText, isSender: false }
            ]);
          }
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
      // Show error message
      setMessages(prev => [
        ...prev.slice(0, -1),
        { text: "Sorry, I encountered an error. Please try again.", isSender: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending new message
  const handleSendMessage = () => {
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage && !isLoading) {
      handleStream(trimmedMessage);
      setNewMessage("");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
          padding: '16px 24px',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Dubai Properties
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: '#1D4ED8',
            '&:hover': { backgroundColor: '#1e40af' },
          }}
        >
          Share
        </Button>
      </Box>

      {/* Chat Area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F9FAFB',
          }}
        >
          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                text={message.text}
                isSender={message.isSender}
              />
            ))}
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              padding: '16px 24px',
              borderTop: '1px solid #E5E7EB',
              backgroundColor: '#FFF',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <InputBase
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                sx={{
                  padding: '12px 16px',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim()}
                sx={{
                  backgroundColor: '#1D4ED8',
                  color: '#FFF',
                  '&:hover': { backgroundColor: '#1e40af' },
                  '&.Mui-disabled': {
                    backgroundColor: '#E5E7EB',
                    color: '#9CA3AF',
                  },
                }}
              >
                <SendIcon />
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