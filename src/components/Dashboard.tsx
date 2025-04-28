import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveMessage, getUserConversations } from '../services/chatService';
import { processAudioMessage, processTextMessage, generateAIResponse } from '../services/messageProcessingService';
import EmotionalAssessment from './EmotionalAssessment';
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
  Fab,
  Stack,
  Link,
  CircularProgress
} from '@mui/material';
import { ExitToApp as LogoutIcon, Mic as MicIcon, Stop as StopIcon, VolumeUp as VolumeUpIcon } from '@mui/icons-material';
import { synthesizeSpeech } from '../services/googleCloudTTS';

interface Message {
  id?: string;
  message: string;
  isUser: boolean;
  timestamp: any;
  language?: string;
  emotionalAnalysis?: {
    severity: number;
    primaryEmotion: string;
    recommendation: string;
    requiresProfessionalHelp: boolean;
  };
}

const Dashboard: React.FC = () => {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<Message[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [showAssessment, setShowAssessment] = useState(true);
  const [emotionalSeverity, setEmotionalSeverity] = useState<number>(0);
  const audioChunks = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  useEffect(() => {
    console.log('Dashboard mounted, currentUser:', currentUser);
    if (!currentUser) {
      console.log('No current user, redirecting to login');
      navigate('/login');
      return;
    }
    loadConversations();
  }, [currentUser, navigate]);

  useEffect(() => {
    // Load voices when component mounts
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
      setVoicesLoaded(true);
    };

    if (window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

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
      await saveMessage(currentUser.uid, processedMessage.text, true, processedMessage.detectedLanguage, processedMessage.emotionalAnalysis);
      
      // Generate and save AI response
      const aiResponse = await generateAIResponse(
        processedMessage.text, 
        processedMessage.detectedLanguage,
        processedMessage.emotionalAnalysis
      );
      await saveMessage(currentUser.uid, aiResponse, false, processedMessage.detectedLanguage, processedMessage.emotionalAnalysis);
      
      // If we have a detected language, speak the response
      if (processedMessage.detectedLanguage && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.lang = processedMessage.detectedLanguage;
        const voice = getBestVoice(processedMessage.detectedLanguage);
        if (voice) {
          console.log('Using voice:', voice.name);
          utterance.voice = voice;
        }
        window.speechSynthesis.speak(utterance);
      }
      
      // Reload conversations
      await loadConversations();
    } catch (error) {
      console.error('Error processing audio message:', error);
      setError('Failed to process audio message. Please try again.');
    }
  };

  const handleEmotionalAssessment = async (feeling: string) => {
    if (!currentUser) return;
    
    setShowAssessment(false);
    let initialSeverity = 0;
    let userMessage = '';
    let messageId = '';
    
    switch(feeling) {
      case 'good':
        userMessage = "I am feeling great today!";
        initialSeverity = 1;
        break;
      case 'ok':
        userMessage = "I am feeling okay";
        initialSeverity = 3;
        break;
      case 'stressed':
        userMessage = "I am feeling stressed";
        initialSeverity = 5;
        break;
    }

    try {
      setError('');
      console.log('Processing emotional assessment for:', userMessage);
      
      // First, try to save the user's initial message
      messageId = await saveMessage(
        currentUser.uid, 
        userMessage, 
        true, 
        'en', // Default to English for initial message
        {
          severity: initialSeverity,
          primaryEmotion: feeling,
          requiresProfessionalHelp: false,
          recommendation: ''
        }
      );

      // Then process the message
      const processedMessage = await processTextMessage(userMessage);
      console.log('Processed message:', processedMessage);
      
      // Generate AI response based on the user's feeling
      console.log('Generating AI response...');
      const aiResponse = await generateAIResponse(
        processedMessage.text,
        processedMessage.detectedLanguage,
        processedMessage.emotionalAnalysis
      );
      console.log('AI response generated:', aiResponse);
      
      // Save the coach's response
      await saveMessage(
        currentUser.uid, 
        aiResponse, 
        false, 
        processedMessage.detectedLanguage,
        {
          severity: initialSeverity,
          primaryEmotion: feeling,
          requiresProfessionalHelp: feeling === 'stressed',
          recommendation: aiResponse
        }
      );
      
      setEmotionalSeverity(processedMessage.emotionalAnalysis.severity);
      await loadConversations();
    } catch (error) {
      console.error('Error in emotional assessment:', error);
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          setError('System configuration error. Please contact support.');
        } else {
          setError(error.message || 'Failed to process your response. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      // Only load conversations if we successfully saved the initial message
      if (messageId) {
        await loadConversations();
      }
    }
  };

  const analyzeEmotionalSeverity = (message: string): number => {
    const stressIndicators = [
      'suicide', 'kill myself', 'end it all', 'give up', 'can\'t take it',
      'hopeless', 'worthless', 'severe', 'extreme', 'unbearable',
      'desperate', 'crisis', 'emergency', 'panic', 'anxiety attack'
    ];
    
    const moderateIndicators = [
      'stressed', 'anxious', 'worried', 'overwhelmed', 'struggling',
      'depressed', 'sad', 'frustrated', 'tired', 'exhausted'
    ];

    const lowMessage = message.toLowerCase();
    let severity = emotionalSeverity;

    if (stressIndicators.some(indicator => lowMessage.includes(indicator))) {
      severity = Math.max(severity, 8);
    } else if (moderateIndicators.some(indicator => lowMessage.includes(indicator))) {
      severity = Math.max(severity, 5);
    }

    return severity;
  };

  const playAudioResponse = async (text: string, language: string) => {
    try {
      setIsPlaying(true);
      
      // Use Google Cloud TTS
      const audioContent = await synthesizeSpeech(text, language);
      const audioBlob = new Blob([audioContent], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing audio response:', error);
      setError('Failed to play audio response. Please try again.');
    } finally {
      setIsPlaying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;

    try {
      setError('');
      const processedMessage = await processTextMessage(message);
      
      // Save user message with emotional analysis
      await saveMessage(
        currentUser.uid, 
        message, 
        true, 
        processedMessage.detectedLanguage,
        processedMessage.emotionalAnalysis
      );
      
      // Update emotional severity
      setEmotionalSeverity(processedMessage.emotionalAnalysis.severity);

      // Generate appropriate response
      const aiResponse = await generateAIResponse(
        processedMessage.text, 
        processedMessage.detectedLanguage,
        processedMessage.emotionalAnalysis
      );
      
      // Save AI response with emotional analysis
      await saveMessage(
        currentUser.uid, 
        aiResponse, 
        false, 
        processedMessage.detectedLanguage,
        processedMessage.emotionalAnalysis
      );
      
      // If professional help is recommended, provide the booking link
      if (processedMessage.emotionalAnalysis.requiresProfessionalHelp) {
        await saveMessage(
          currentUser.uid, 
          "You can book an appointment with our counselors here: https://book-appointment.niya.app/",
          false,
          processedMessage.detectedLanguage,
          {
            severity: processedMessage.emotionalAnalysis.severity,
            primaryEmotion: processedMessage.emotionalAnalysis.primaryEmotion,
            requiresProfessionalHelp: true,
            recommendation: "Professional help recommended"
          }
        );
      }

      // Replace the existing speech synthesis with the new function
      if (processedMessage.detectedLanguage) {
        await playAudioResponse(aiResponse, processedMessage.detectedLanguage);
      }
      
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

  const getBestVoice = (lang: string) => {
    if (!voicesLoaded) {
      console.log('Voices not yet loaded');
      return null;
    }
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    
    // Try to find an exact match for Tamil
    let voice = voices.find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    
    // If no exact match, try to find any Indian voice as fallback
    if (!voice && lang === 'ta') {
      voice = voices.find(v => v.lang.includes('IN') || v.name.includes('Indian'));
    }
    
    return voice;
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

  if (showAssessment) {
    return <EmotionalAssessment onAssessmentComplete={handleEmotionalAssessment} />;
  }

  return (
    <Stack sx={{ height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NIYA Coach
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ flexGrow: 1, py: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Chat with NIYA
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {emotionalSeverity >= 7 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            I notice you're experiencing significant distress. While I'm here to support you, speaking with a professional counselor could be really helpful.{' '}
            <Link href="https://book-appointment.niya.app/" target="_blank" rel="noopener noreferrer">
              Book an appointment here
            </Link>
          </Alert>
        )}

        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            height: '60vh', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {isLoading ? (
            <Typography align="center">Loading conversations...</Typography>
          ) : conversations.length === 0 ? (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary'
              }}
            >
              <Typography variant="h6" align="center" gutterBottom>
                No conversations yet
              </Typography>
              <Typography align="center">
                Start chatting with NIYA to begin your journey
              </Typography>
            </Box>
          ) : (
            <List>
              {conversations.map((msg, index) => (
                <ListItem
                  key={msg.id || index}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                    p: 1,
                    alignItems: 'flex-start'
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: msg.isUser ? '#e3f2fd' : '#f5f5f5',
                      position: 'relative'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          {msg.message}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="caption">
                            {new Date(msg.timestamp.seconds * 1000).toLocaleString()}
                          </Typography>
                          {msg.language && (
                            <Typography
                              variant="caption"
                              sx={{
                                textTransform: 'uppercase',
                                color: 'text.secondary'
                              }}
                            >
                              • {msg.language}
                            </Typography>
                          )}
                        </Stack>
                      }
                    />
                    {!msg.isUser && !msg.message.includes('https://') && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (msg.message && msg.language) {
                            playAudioResponse(msg.message, msg.language);
                          }
                        }}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          bottom: 8,
                          opacity: 0.6,
                          '&:hover': {
                            opacity: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                        title="Listen to response"
                      >
                        {isPlaying ? (
                          <StopIcon fontSize="small" />
                        ) : (
                          <VolumeUpIcon fontSize="small" />
                        )}
                      </IconButton>
                    )}
                  </Paper>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          )}
        </Paper>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            display: 'flex',
            gap: 1
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message in any language..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isRecording || isPlaying}
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!message.trim() || isRecording || isPlaying}
            title="Send message"
          >
            {isRecording || isPlaying ? <CircularProgress size={24} /> : 'Send'}
          </Button>
          <Fab
            color={isRecording ? 'secondary' : 'primary'}
            size="small"
            onClick={isRecording ? stopRecording : startRecording}
            title={isRecording ? "Stop Recording" : "Start Recording"}
          >
            {isRecording ? <StopIcon /> : <MicIcon />}
          </Fab>
        </Box>
      </Container>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </Stack>
  );
};

export default Dashboard; 