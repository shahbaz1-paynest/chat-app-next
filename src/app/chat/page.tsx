"use client";

import React, { useState, useRef, useContext, useEffect } from "react";
import { Box, Typography, IconButton, InputBase, Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";
import MessageBubble from "@/components/shared/Message";
import Sidebar from "@/components/layout/Sidebar";
import processMessageText from "@/utils/processMsg";
import PromptContext from "@/context/promptContext";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

interface Message {
  text: string;
  isSender: boolean;
}

interface RawProperty {
  id: number;
  title: string;
  description: string;
  price: string;
  currency: string;
  beds: number;
  baths: number;
  area: string;
  type: string;
  purpose: string;
  furnishing: string;
  reference_no: string;
  frequency: string;
  location: string;
  completion: string;
  posted_on: string;
  url: string;
  handover_date: string;
  image_urls: string[];
  agent_name: string;
  agent_phone: string;
  building_name: string;
  city_area_name: string;
}

interface FormattedProperty {
  title: string;
  price: string;
  location: string;
  annualRent: string;
  maintenance: string;
  timeToRent: string;
  capitalGain: string;
  image: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `Hey There! I am here to help you!`,
      isSender: false,
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<FormattedProperty[]>([]);
  const { preferences } = useContext(PromptContext);
  const router = useRouter()
  
  const responseRef = useRef("");
  const socketRef = useRef<Socket | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const calculatePropertyMetrics = (price: string): {
    annualRent: string;
    maintenance: string;
    timeToRent: string;
    capitalGain: string;
  } => {
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
    
    const annualRent = (numericPrice * 0.08).toFixed(0);
    const maintenance = (numericPrice * 0.01).toFixed(0);
    const timeToRent = Math.floor(Math.random() * (21 - 7) + 7);
    const capitalGain = ((Math.random() * (12 - 5) + 5)).toFixed(0); 
    
    return {
      annualRent: `${(parseInt(annualRent)/1000).toFixed(0)}k`,
      maintenance: `${(parseInt(maintenance)/1000).toFixed(1)}k`,
      timeToRent: `${timeToRent} Days`,
      capitalGain: `${capitalGain}%`
    };
  };

  const transformProperty = (rawProperty: RawProperty): FormattedProperty => {
    const metrics = calculatePropertyMetrics(rawProperty.price);
    
    return {
      title: rawProperty.title.length > 40 ? 
        rawProperty.title.substring(0, 37) + '...' : 
        rawProperty.title,
      price: `${(parseInt(rawProperty.price)/1000).toFixed(0)}k, ${rawProperty.area} sq.ft`,
      location: `${rawProperty.building_name}, ${rawProperty.city_area_name}`,
      image: rawProperty.image_urls[0] || '/dash.png',
      ...metrics
    };
  };

  useEffect(() => {
    socketRef.current = io(baseUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketRef.current.on('suggestions', (rawProperties: RawProperty[]) => {
      const formattedProperties = rawProperties.map(transformProperty);
      setProperties(prevProperties => {
        const uniqueProperties = [...prevProperties];
        formattedProperties.forEach(newProp => {
          const existingIndex = uniqueProperties.findIndex(
            prop => prop.title === newProp.title && prop.location === newProp.location
          );
          if (existingIndex === -1) {
            uniqueProperties.push(newProp);
          }
        });
        return uniqueProperties;
      });
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const extractContentFromChunk = (chunk: string): string | null => {
    const regex = /content='([^']+)'/g;
    const matches = [];
    let match;

    while ((match = regex.exec(chunk)) !== null) {
      matches.push(match[1]);
    }

    return matches.length > 0 ? matches.join("") : null;
  };

  const handleStream = async (userMessage: string) => {
    try {
      setIsLoading(true);
      responseRef.current = "";

      setMessages(prev => [...prev, { text: userMessage, isSender: true }]);
      setMessages(prev => [...prev, { text: "", isSender: false }]);

      const response = await fetch(`${baseUrl}/api/chat/`, {
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

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        if (value) {
          const chunk = decoder.decode(value);
          const content = extractContentFromChunk(chunk);

          if (content) {
            responseRef.current += content;
            const formattedText = processMessageText(responseRef.current);
            setMessages(prev => [
              ...prev.slice(0, -1),
              { text: formattedText, isSender: false }
            ]);
          }
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { text: "Sorry, I encountered an error. Please try again.", isSender: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage && !isLoading) {
      handleStream(trimmedMessage);
      setNewMessage("");
    }
  };

  useEffect(() => {
    if (preferences) {
      setNewMessage(preferences);
      handleSendMessage();
    }
  }, [preferences]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB' }}>
      <Box sx={{
        padding: '16px 24px',
        borderBottom: '1px solid #E5E7EB',
        backgroundColor: '#FFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton sx={{ color: '#000', '&:hover': { backgroundColor: '#F3F4F6' } }}
          onClick={()=>{
            router.push("/")
          }}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Dubai Properties
          </Typography>
        </Box>
        <Button variant="contained" sx={{ 
          backgroundColor: '#1D4ED8',
          '&:hover': { backgroundColor: '#1e40af' },
        }}>
          Share
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F9FAFB',
        }}>
          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                text={message.text}
                isSender={message.isSender}
              />
            ))}
          </Box>

          <Box sx={{
            padding: '16px 24px',
            borderTop: '1px solid #E5E7EB',
            backgroundColor: '#FFF',
          }}>
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
                  minHeight: '48px',
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim()}
                sx={{
                  backgroundColor: '#1D4ED8',
                  color: '#FFF',
                  width: '48px',
                  height: '48px',
                  minWidth: '48px',
                  minHeight: '48px',
                  flexShrink: 0,
                  '&:hover': { backgroundColor: '#1e40af' },
                  '&.Mui-disabled': {
                    backgroundColor: '#E5E7EB',
                    color: '#9CA3AF',
                    width: "50px",
                    height: "50px"
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Sidebar properties={properties} />
      </Box>
    </Box>
  );
}