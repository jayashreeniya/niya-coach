import React from 'react';
import {
  Button,
  Typography,
  Stack,
  Paper,
  Box
} from '@mui/material';
import { SentimentSatisfied, SentimentNeutral, SentimentVeryDissatisfied } from '@mui/icons-material';

interface EmotionalAssessmentProps {
  onAssessmentComplete: (feeling: string) => void;
}

const EmotionalAssessment: React.FC<EmotionalAssessmentProps> = ({ onAssessmentComplete }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h5" textAlign="center">
          Welcome! I'm your NIYA Coach. How are you feeling today?
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', width: '100%' }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => onAssessmentComplete('good')}
            startIcon={<SentimentSatisfied />}
            sx={{ 
              minWidth: 120,
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
          >
            Good
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => onAssessmentComplete('ok')}
            startIcon={<SentimentNeutral />}
            sx={{ 
              minWidth: 120,
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
          >
            OK
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => onAssessmentComplete('stressed')}
            startIcon={<SentimentVeryDissatisfied />}
            sx={{ 
              minWidth: 120,
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
          >
            Stressed
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default EmotionalAssessment; 