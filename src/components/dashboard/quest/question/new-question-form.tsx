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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FilePlus as FilePlusIcon } from "@phosphor-icons/react/dist/ssr/FilePlus";
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import CardHeader from "@mui/material/CardHeader";
import { IconButton } from '@mui/material';
import Stack from "@mui/material/Stack";
import {logger} from "@/lib/default-logger";
import apiService from "@/api/api-service";
import {AxiosError} from "axios";
import {authClient} from "@/lib/auth/client";
import Typography from "@mui/material/Typography";

interface Answer {
  text: string;
  is_correct: boolean;
}

interface Question {
  number: number;
  text: string;
  max_score: number;
  answers: Answer[];
  from_quest: number;
}

interface NewQuestionFormProps {
  onCreateSuccess: () => void;
  onCancelCreate: () => void;
  questId: string;
}

export function NewQuestionForm({ questId, onCreateSuccess, onCancelCreate }: NewQuestionFormProps): React.JSX.Element {
  const [questions, setQuestions] = useState<Question[]>([
    {
      number: 1,
      text: '',
      max_score: 1,
      answers: [{ text: '', is_correct: false }],
      from_quest: questId as unknown as number,
    },
  ]);
  const [formValid, setFormValid] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const handleQuestionChange = (index: number, field: string, value: string | number): void => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex: number, aIndex: number, field: string, value: string | boolean): void => {
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
        max_score: 1,
        answers: [{ text: '', is_correct: false }],
        from_quest: questId as unknown as number,
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

  const handleSubmit = async (): Promise<void> => {
    logger.debug('Questions to be created:', questions);
    if (questions.length === 0 || questions.some(q => q.answers.length === 0)) {
      setFormValid(false);
      return;
    }
    setFormValid(true);
    try {
      const response = await apiService.post(`/api/Question/bulk-create/`, questions);
      if (response.status === 201) {
        logger.debug('Questions bulk-created:', response.data);
        onCreateSuccess();
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.debug('Error creating questions:', error);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setOpenDialog(true);
  };

  const handleDialogClose = (): void => {
    setOpenDialog(false);
  };

  const handleDialogConfirm = async (): Promise<void> => {
    setOpenDialog(false);
    await handleSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {questions.map((question, qIndex) => (
        <Card key={qIndex} sx={{ mb: 2 }}>
          <CardHeader
            title={`Question ${question.number.toString()}`}
            action={
              <Button startIcon={<TrashIcon/>} onClick={() => { deleteQuestion(qIndex); }} color="error">
                {`Delete Question ${question.number.toString()}`}
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
                  defaultValue={question.max_score}
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
                      label={`Answer ${String(aIndex + 1)}`}
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
                <Button startIcon={<PlusIcon/>} onClick={() => { addAnswer(qIndex); }}>Add additional Answer</Button>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      ))}

      {!formValid &&
        <Alert severity="error" sx={{mb: 2}}>There must be at least one question and one answer option.</Alert>
      }

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button startIcon={<PlusIcon/>} onClick={addQuestion} >
          Add additional Question
        </Button>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<XCircleIcon />} onClick={onCancelCreate} color="error">
            Cancel
          </Button>
          <Button startIcon={<FilePlusIcon />} type="submit" variant="contained">
            Create Questions
          </Button>
        </Stack>
      </CardActions>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Submission"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to create these questions for this quest?
          </DialogContentText>
          <DialogContentText id="alert-dialog-description" sx={{pb:1}}>
            These questions
            <Typography fontWeight={600} display='inline'> cannot be edited </Typography>
            or
            <Typography fontWeight={600} display='inline'> deleted </Typography>
            once they are created for this quest.
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="body2">*Note: To edit these questions, the quest will have to be deleted and recreated.</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="error" startIcon={<XCircleIcon />} >
            Cancel
          </Button>
          <Button onClick={handleDialogConfirm} color="primary" variant="contained" startIcon={<CheckCircleIcon />}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
