import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveMessage, getUserConversations } from '../services/chatService';
import { processAudioMessage, processTextMessage, generateAIResponse } from '../services/messageProcessingService';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Fab
} from '@mui/material';
import { ExitToApp as LogoutIcon, Mic as MicIcon, Stop as StopIcon } from '@mui/icons-material';

interface Message {
  message: string;
  isUser: boolean;
  timestamp: any;
}

const Dashboard: React.FC = () => {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<Message[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    console.log('Dashboard mounted, currentUser:', currentUser);
    if (!currentUser) {
      console.log('No current user, redirecting to login');
      navigate('/login');
      return;
    }
    loadConversations();
  }, [currentUser, navigate]);

  const loadConversations = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      console.log('Loading conversations for user:', currentUser.uid);
      const userConversations = await getUserConversations(currentUser.uid);
      console.log('Loaded conversations:', userConversations);
      setConversations(userConversations);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        audioChunks.current = [];
        await handleAudioMessage(audioBlob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      const tracks = mediaRecorder.stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleAudioMessage = async (audioBlob: Blob) => {
    if (!currentUser) return;

    try {
      setError('');
      const processedMessage = await processAudioMessage(audioBlob);
      
      // Save user's message
      await saveMessage(currentUser.uid, processedMessage.text, true);
      
      // Generate and save AI response
      const aiResponse = await generateAIResponse(processedMessage.text, processedMessage.detectedLanguage);
      await saveMessage(currentUser.uid, aiResponse, false);
      
      // Reload conversations
      await loadConversations();
    } catch (error) {
      console.error('Error processing audio message:', error);
      setError('Failed to process audio message. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;

    try {
      setError('');
      const processedMessage = await processTextMessage(message);
      
      // Save user message
      await saveMessage(currentUser.uid, message, true);
      
      // Generate and save AI response
      const aiResponse = await generateAIResponse(processedMessage.text, processedMessage.detectedLanguage);
      await saveMessage(currentUser.uid, aiResponse, false);
      
      // Reload conversations
      await loadConversations();
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NIYA Coach
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
          <List sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
            {conversations.map((conv, index) => (
              <ListItem key={index} sx={{ 
                justifyContent: conv.isUser ? 'flex-end' : 'flex-start',
                mb: 1
              }}>
                <Paper elevation={1} sx={{ 
                  p: 2, 
                  maxWidth: '70%',
                  backgroundColor: conv.isUser ? '#e3f2fd' : '#f5f5f5'
                }}>
                  <ListItemText 
                    primary={conv.message}
                    secondary={new Date(conv.timestamp.seconds * 1000).toLocaleString()}
                  />
                </Paper>
              </ListItem>
            ))}
          </List>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message in any language..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" variant="contained" disabled={!message.trim() || isRecording}>
              Send
            </Button>
            <Fab
              color={isRecording ? 'secondary' : 'primary'}
              size="small"
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <StopIcon /> : <MicIcon />}
            </Fab>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Dashboard; 