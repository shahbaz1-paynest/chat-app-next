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

interface PropertyMetrics {
  annualRent: string;
  maintenance: string;
  timeToRent: string;
  capitalGain: string;
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
  const [sessionId, setSessionId] = useState<string>("");
  const { preferences } = useContext(PromptContext);
  const router = useRouter();

  const responseRef = useRef("");
  const socketRef = useRef<Socket | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const calculatePropertyMetrics = (price: string | undefined): PropertyMetrics => {
    if (!price) {
      return {
        annualRent: '0k',
        maintenance: '0k',
        timeToRent: '0 Days',
        capitalGain: '0%'
      };
    }

    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));

    if (isNaN(numericPrice)) {
      return {
        annualRent: '0k',
        maintenance: '0k',
        timeToRent: '0 Days',
        capitalGain: '0%'
      };
    }

    const annualRent = (numericPrice * 0.08).toFixed(0);
    const maintenance = (numericPrice * 0.01).toFixed(0);
    const timeToRent = Math.floor(Math.random() * (21 - 7) + 7);
    const capitalGain = ((Math.random() * (12 - 5) + 5)).toFixed(0);

    return {
      annualRent: `${(parseInt(annualRent) / 1000).toFixed(0)}k`,
      maintenance: `${(parseInt(maintenance) / 1000).toFixed(1)}k`,
      timeToRent: `${timeToRent} Days`,
      capitalGain: `${capitalGain}%`
    };
  };

  const transformProperty = (rawProperty: RawProperty): FormattedProperty => {
    const metrics = calculatePropertyMetrics(rawProperty.price);

    return {
      title: rawProperty.title?.length > 40 ?
        rawProperty.title.substring(0, 37) + '...' :
        rawProperty.title || '',
      price: rawProperty.price ?
        `${(parseInt(rawProperty.price) / 1000).toFixed(0)}k, ${rawProperty.area || 0} sq.ft` :
        '0k, 0 sq.ft',
      location: `${rawProperty.building_name || ''}, ${rawProperty.city_area_name || ''}`,
      image: '/dash.png',
      ...metrics
    };
  };

  const parseProperties = (data: string): RawProperty[] => {
    try {
      const jsonString = data.replace(/'/g, '"')
        .replace(/\\/g, '')
        .replace(/^["']|["']$/g, '');

      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error('Failed to parse property data:', e);
      return [];
    }
  };

  const initializeSession = async (socketId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ socket_id: socketId }),
      });
      console.log(response);


      if (!response.ok) {
        throw new Error('Failed to initialize session');
      }

      const data = await response.json();
      setSessionId(data.session_id);
    } catch (error: any) {
      console.log(error)
    }
  };

  const endSession = async () => {
    if (sessionId) {
      try {
        await fetch(`${baseUrl}/api/end`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        });
        console.log(sessionId);

      } catch (error: any) {
        // console.error('Error ending session:', error);
        console.log(error)
      }
    }
  };

  useEffect(() => {
    socketRef.current = io(baseUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
      if (socketRef.current) {
        initializeSession(socketRef.current.id || "");
      }
    });

    socketRef.current.on('suggestions', (data: string | RawProperty[]) => {
      let rawProperties: RawProperty[];

      if (typeof data === 'string') {
        rawProperties = parseProperties(data);
      } else {
        rawProperties = Array.isArray(data) ? data : [data];
      }

      if (rawProperties.length > 0) {
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
      }
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      endSession();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId]);

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

      setMessages(prev => [
        ...prev,
        { text: userMessage, isSender: true },
        { text: "", isSender: false }
      ]);

      const response = await fetch(`${baseUrl}/api/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          session_id: sessionId
        }),
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
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#F9FAFB',
      overflow: 'hidden'
    }}>
      <Box sx={{
        padding: { xs: '12px 16px', md: '16px 24px' },
        borderBottom: '1px solid #E5E7EB',
        backgroundColor: '#FFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: { xs: '64px', md: '72px' },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
          <IconButton
            sx={{
              color: '#000',
              '&:hover': { backgroundColor: '#F3F4F6' },
              padding: { xs: '6px', md: '8px' }
            }}
            onClick={() => router.push("/")}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
          </IconButton>
          <Typography variant="h6" sx={{
            fontWeight: 600,
            fontSize: { xs: '1.1rem', md: '1.25rem' }
          }}>
            Dubai Properties
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#1D4ED8',
            '&:hover': { backgroundColor: '#1e40af' },
            padding: { xs: '6px 12px', md: '8px 16px' },
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          Share
        </Button>
      </Box>

      <Box sx={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F9FAFB',
          height: { xs: 'calc(100vh - 64px)', md: 'auto' }
        }}>
          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            padding: { xs: '16px', md: '24px' },
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 'calc(100vh - 180px)', md: 'auto' }
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
            padding: { xs: '12px 16px', md: '16px 24px' },
            borderTop: '1px solid #E5E7EB',
            backgroundColor: '#FFF',
            position: { xs: 'fixed', md: 'relative' },
            bottom: { xs: 0, md: 'auto' },
            left: { xs: 0, md: 'auto' },
            right: { xs: 0, md: 'auto' },
            width: '100%'
          }}>
            <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 } }}>
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
                  padding: { xs: '8px 12px', md: '12px 16px' },
                  backgroundColor: '#F3F4F6',
                  borderRadius: '8px',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  minHeight: { xs: '40px', md: '48px' }
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim()}
                sx={{
                  backgroundColor: '#1D4ED8',
                  color: '#FFF',
                  width: { xs: '40px', md: '48px' },
                  height: { xs: '40px', md: '48px' },
                  minWidth: { xs: '40px', md: '48px' },
                  minHeight: { xs: '40px', md: '48px' },
                  flexShrink: 0,
                  '&:hover': { backgroundColor: '#1e40af' },
                  '&.Mui-disabled': {
                    backgroundColor: '#E5E7EB',
                    color: '#9CA3AF',
                    width: { xs: "40px", md: "50px" },
                    height: { xs: "40px", md: "50px" }
                  },
                }}
              >
                <SendIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box sx={{
          display: { xs: 'none', md: 'block' },
        }}>
          <Sidebar properties={properties} />
        </Box>
      </Box>
    </Box>
  );
}