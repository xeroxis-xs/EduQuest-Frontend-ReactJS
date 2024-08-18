import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { PaperPlaneTilt as PaperPlaneTiltIcon } from '@phosphor-icons/react/dist/ssr/PaperPlaneTilt';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';
import CardHeader from "@mui/material/CardHeader";
import { IconButton } from '@mui/material';
import Stack from "@mui/material/Stack";
import type {Quest} from "@/types/quest";



interface Answer {
  text: string;
  is_correct: boolean;
}

interface Question {
  number: number;
  text: string;
  max_score: number;
  answers: Answer[];
}

interface NewQuestionFormProps {
  onCreateSuccess: () => void;
  onCancelCreate: () => void;
  quest: Quest;
}

export function NewQuestionForm({ quest, onCreateSuccess, onCancelCreate }: NewQuestionFormProps): React.JSX.Element {
  const [questions, setQuestions] = useState<Question[]>([
    {
      number: 1,
      text: '',
      max_score: 0,
      answers: [{ text: '', is_correct: false }],
    },
  ]);
  const [formValid, setFormValid] = useState(true);

  const handleQuestionChange = (index: number, field: string, value: any): void => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex: number, aIndex: number, field: string, value: any): void => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex] = { ...newQuestions[qIndex].answers[aIndex], [field]: value };
    setQuestions(newQuestions);
  };

  const addQuestion = (): void => {
    setQuestions([
      ...questions,
      {
        number: questions.length + 1,
        text: '',
        max_score: 0,
        answers: [{ text: '', is_correct: false }],
      },
    ]);
  };

  const addAnswer = (qIndex: number): void => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers.push({ text: '', is_correct: false });
    setQuestions(newQuestions);
  };

  const deleteQuestion = (qIndex: number): void => {
    const newQuestions = questions.filter((_, index) => index !== qIndex);
    setQuestions(newQuestions);
  };

  const deleteAnswer = (qIndex: number, aIndex: number): void => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, index) => index !== aIndex);
    setQuestions(newQuestions);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (questions.length === 0 || questions.some(q => q.answers.length === 0)) {
      setFormValid(false);
      return;
    }
    setFormValid(true);
    onCreateSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question, qIndex) => (
        <Card key={qIndex} sx={{ mb: 2 }}>
          <CardHeader
            title={`Question ${question.number.toString()}`}
            action={
              <Button startIcon={<TrashIcon/>} onClick={() => { deleteQuestion(qIndex); }} color="error">
                Delete Question
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid md={10} xs={8}>
                <TextField
                  fullWidth
                  label="Question Text"
                  size="small"
                  value={question.text}
                  onChange={(e) => { handleQuestionChange(qIndex, 'text', e.target.value); }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid md={2} xs={4}>
                <TextField
                  fullWidth
                  label="Score"
                  type="number"
                  defaultValue={1}
                  size="small"
                  onChange={(e) => { handleQuestionChange(qIndex, 'number', parseInt(e.target.value)); }}
                  sx={{ mb: 2 }}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
            {question.answers.map((answer, aIndex) => (
              <Grid md={6} xs={12} key={aIndex}>
                <Box sx={{ display: 'flex', alignItems: 'center'}}>

                  <TextField
                  fullWidth
                  size="small"
                  label={`Answer ${aIndex + 1}`}
                  value={answer.text}
                  onChange={(e) => { handleAnswerChange(qIndex, aIndex, 'text', e.target.value); }}
                  sx={{ mr: 2 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={answer.is_correct}
                      onChange={(e) => { handleAnswerChange(qIndex, aIndex, 'is_correct', e.target.checked); }}
                    />
                  }
                  label="Correct"
                  componentsProps={{ typography: { fontSize: 14 } }}
                  sx={{ mr: 1}}
                  // labelPlacement="bottom"

                />
                <IconButton aria-label="delete answer" onClick={() => { deleteAnswer(qIndex, aIndex); }} color="error" size="medium">
                  <TrashIcon height={20} width={20} />
                </IconButton>
                  </Box>
              </Grid>
            ))}
              <Grid md={6} xs={12}>
                <Button startIcon={<PlusIcon/>} onClick={() => { addAnswer(qIndex); }}>Add Answer</Button>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      ))}

      {!formValid && <Alert severity="error">There must be at least one question and one answer option.</Alert>}
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button startIcon={<PlusIcon/>} onClick={addQuestion} >
          Add Question
        </Button>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<XCircleIcon />} onClick={onCancelCreate}>
            Cancel
          </Button>
          <Button endIcon={<PaperPlaneTiltIcon />} type="submit" variant="contained">
            Create Questions
          </Button>
        </Stack>
      </CardActions>
    </form>
  );
}
