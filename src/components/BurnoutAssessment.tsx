import React, { useState } from 'react';
import {
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Stack,
  LinearProgress
} from '@mui/material';

interface BurnoutAssessmentProps {
  onComplete: (score: number, answers: number[]) => void;
  onCancel: () => void;
}

const questions = [
  "How often do you feel tired?",
  "How often do you feel physically exhausted?",
  "How often do you feel emotionally exhausted?",
  "How often do you think: 'I can't take it anymore'?",
  "How often do you feel worn out?",
  "How often do you feel weak and susceptible to illness?",
  "Do you feel worn out at the end of the working day?",
  "Are you exhausted in the morning at the thought of another day at work?",
  "Do you feel that every working hour is tiring for you?",
  "Do you have enough energy for family and friends during leisure time?"
];

const options = [
  { value: 1, label: "Never/Almost Never" },
  { value: 2, label: "Seldom" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Always/Almost Always" }
];

const BurnoutAssessment: React.FC<BurnoutAssessmentProps> = ({ onComplete, onCancel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);

  const handleNext = () => {
    if (currentAnswer === null) return;

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(null);
    } else {
      // Calculate score - questions 1-9 are positive scale, question 10 is reverse scale
      const score = newAnswers.slice(0, 9).reduce((acc, val) => acc + val, 0) +
        (6 - newAnswers[9]); // Reverse score for last question
      onComplete(score, newAnswers);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h5" gutterBottom>
          Burnout Assessment
        </Typography>

        <Typography variant="body1" gutterBottom>
          Question {currentQuestion + 1} of {questions.length}
        </Typography>

        <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />

        <Typography variant="h6">
          {questions[currentQuestion]}
        </Typography>

        <RadioGroup
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(Number(e.target.value))}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={onCancel}
            color="secondary"
          >
            Skip Assessment
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={currentAnswer === null}
          >
            {currentQuestion < questions.length - 1 ? 'Next' : 'Complete'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default BurnoutAssessment; 