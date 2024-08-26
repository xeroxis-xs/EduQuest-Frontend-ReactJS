"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import apiService from "@/api/api-service";
import microService from "@/api/micro-service";
import {authClient} from "@/lib/auth/client";
import {logger} from "@/lib/default-logger";
import Typography from "@mui/material/Typography";
import {AxiosError} from "axios";
import type {AxiosResponse} from "axios";
import Select, { type SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import type { Course } from "@/types/course";
import type { Quest } from "@/types/quest";
import { useUser } from "@/hooks/use-user";
import { MagicWand as MagicWandIcon } from '@phosphor-icons/react/dist/ssr/MagicWand';
import {TextField} from "@mui/material";
import type {Image} from "@/types/image";
import Chip from "@mui/material/Chip";
import type { Document } from "@/types/document";
import type { GeneratedQuestion } from "@/types/generated-question";
import type { GeneratedQuestions } from "@/types/generated-questions";
import type { EduquestUser } from "@/types/eduquest-user";
import LinearProgress, { type LinearProgressProps, linearProgressClasses } from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';


interface CourseFormProps {
  onFormSubmitSuccess: () => void;
}

interface NewQuestType {
  type: string | undefined;
  name: string | undefined;
  description: string | undefined;
  status: string | undefined;
  max_attempts: number | undefined;
  from_course: Course | undefined;
  organiser: EduquestUser | null;
  image: Image | undefined;
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? 'primary' : 'primary',
  },
}));


function LinearProgressWithLabel(props: LinearProgressProps & { value: number, status: string }): React.JSX.Element {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {props.status}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`${Math.round(props.value).toString()}%`}
          </Typography>
        </Box>

        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
}

export function GenerateQuestForm({onFormSubmitSuccess}: CourseFormProps): React.JSX.Element {
  const { eduquestUser} = useUser();
  const questTypeRef = React.useRef<HTMLInputElement>(null);
  const questNameRef = React.useRef<HTMLInputElement>(null);
  const questDescriptionRef = React.useRef<HTMLInputElement>(null);
  const questStatusRef = React.useRef<HTMLInputElement>(null);
  const questCourseIdRef = React.useRef<HTMLInputElement>(null);
  const questMaxAttemptsRef = React.useRef<HTMLInputElement>(null);
  const numQuestionsRef = React.useRef<HTMLInputElement>(null);
  const difficultyRef = React.useRef<HTMLInputElement>(null);
  const [courses, setCourses] = React.useState<Course[]>();
  const [documents, setDocuments] = React.useState<Document[]>();
  const [images, setImages] = React.useState<Image[]>();
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [progressStatus, setProgressStatus] = React.useState<string>(''); // New state for progress status message
  const [showProgress, setShowProgress] = React.useState(false); // State to control progress bar visibility

  const getImages = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Image[]> = await apiService.get<Image[]>(`/api/Image/`);
      const data: Image[] = response.data;
      const filteredData = data.filter(image => image.name === 'Private Quest');
      setImages(filteredData);
      logger.debug('Private Quest Image', filteredData);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        else {
          logger.error('Code: ', error.response?.status);
          logger.error('Message: ', error.response?.data);
        }
      }
      logger.error('Failed to fetch data', error);
    }
  };

  const getCourses = async (): Promise<void> => {
    if (eduquestUser) {
      try {
        const response: AxiosResponse<Course[]> = await apiService.get<Course[]>(`/api/Course/`);
        const data: Course[] = response.data;
        const filteredData = data.filter(course => course.code === `PRIVATE ${eduquestUser?.id.toString()}`);
        setCourses(filteredData);
        logger.debug('My Private Course', filteredData);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            await authClient.signInWithMsal();
          }
          else {
            logger.error('Code: ', error.response?.status);
            logger.error('Message: ', error.response?.data);
          }
        }
        logger.error('Failed to fetch data', error);
      }
    }
  };

  const handleDocumentChange = (event: SelectChangeEvent<number>): void => {
    const documentId = Number(event.target.value);
    const document = documents?.find(d => d.id === documentId);
    if (document) {
      setSelectedDocument({
        id: document.id,
        name: document.name,
        file: document.file,
        size: document.size,
        uploaded_at: document.uploaded_at,
        uploaded_by: document.uploaded_by
      });
    }
  };
  const getMyDocuments = async (): Promise<void> => {
    if (eduquestUser) {
      try {
        const response: AxiosResponse<Document[]> = await apiService.get<Document[]>(`/api/Document/by-user/${eduquestUser?.id.toString()}/`);
        const data: Document[] = response.data;
        setDocuments(data);
        logger.debug('Documents', data);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            await authClient.signInWithMsal();
          }
        }
        logger.error('Failed to fetch data', error);
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitStatus(null); // Reset submit status
    setProgress(10); // Initial progress
    setProgressStatus('Creating a new Quest'); // Initial progress status
    setShowProgress(true); // Show progress bar

    const newQuest: NewQuestType = {
      type: questTypeRef.current?.value,
      name: questNameRef.current?.value,
      description: questDescriptionRef.current?.value,
      status: questStatusRef.current?.value,
      max_attempts: Number(questMaxAttemptsRef.current?.value),
      from_course: courses?.[0],
      organiser: eduquestUser,
      image: images?.[0]
    };

    const filename = selectedDocument?.file || documents?.[0].file;
    const createdQuestId = await createQuest(newQuest);

    if (createdQuestId) {
      setProgress(40); // Progress after quest creation
      setProgressStatus('Generating Questions from Document'); // Progress status after quest creation
      logger.debug('Calling generateQuestions');
      const generatedQuestions = await generateQuestions(
        filename?.split('/').pop() || '',
        Number(numQuestionsRef.current?.value),
        difficultyRef.current?.value || ''
      );

      if (generatedQuestions === null) {
        logger.debug('Generated questions is null');
        setSubmitStatus({ type: 'error', message: 'Generate Failed. Please try again.' });
        setProgressStatus('Generation failed'); // Progress status on failure
      } else if (Array.isArray(generatedQuestions)) {
        setProgress(70); // Progress after questions generation
        setProgressStatus('Importing Questions generated'); // Progress status after questions generation
        logger.debug('Generated questions is an array');
        await bulkCreateQuestions(generatedQuestions, createdQuestId);
        setProgress(100); // Final progress
        setProgressStatus('Completed'); // Final progress status
      } else {
        logger.debug('Generated questions is not an array:', generatedQuestions);
        setSubmitStatus({ type: 'error', message: 'Generate Failed. Please try again.' });
        setProgressStatus('Generation failed'); // Progress status on failure
      }
    } else {
      setSubmitStatus({ type: 'error', message: 'Quest creation failed. Please try again.' });
      setProgressStatus('Quest creation failed'); // Progress status on failure
    }

    setShowProgress(false); // Hide progress bar after submission
  };


  const createQuest = async (newQuest: NewQuestType): Promise<number | null> => {
    try {
      const response: AxiosResponse<Quest> = await apiService.post(`/api/Quest/`, newQuest);
      const createdQuest: Quest = response.data;
      logger.debug('Quest Create Success:', createdQuest);
      return createdQuest.id;
    }
    catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        else {
          logger.error('Code: ', error.response?.status);
          logger.error('Message: ', error.response?.data);
        }
      }
      setSubmitStatus({ type: 'error', message: 'Create Failed. Please try again.' });
      return null;
    }
  }

  const generateQuestions = async (filename: string, numQuestions: number, difficulty: string): Promise<GeneratedQuestion[] | null> => {
    try {
      logger.debug('Entering generateQuestions');
      const response: AxiosResponse<GeneratedQuestions> = await microService.post(`/generate_questions_from_document`, {
        document_id: filename,
        num_questions: numQuestions,
        difficulty
      });
      logger.debug('Generate Questions Success:', response.data.questions);
      return response.data.questions;
    } catch (error: unknown) {
      logger.error('Error in generateQuestions:', error);
      setSubmitStatus({ type: 'error', message: 'Generate Failed. Please try again.' });
      return null; // Explicitly return null on error
    } finally {
      logger.debug('Exiting generateQuestions');
    }
  };


  const bulkCreateQuestions = async (generatedQuestions: GeneratedQuestion[], createdQuestId: number): Promise<void> => {
    try {
      const updatedQuestions = generatedQuestions.map(question => ({
        ...question,
        max_score: 10,
        from_quest: createdQuestId
      }));
      await apiService.post(`/api/Question/bulk-create/`, updatedQuestions);
      setSubmitStatus({ type: 'success', message: 'Questions Created Successfully' });
      onFormSubmitSuccess();
    }
    catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        } else {
          logger.error('Code: ', error.response?.status);
          logger.error('Message: ', error.response?.data);
        }
      }
      setSubmitStatus({type: 'error', message: 'Questions Create Failed. Please try again.'});
    }
  }

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getImages();
      await getCourses();
      await getMyDocuments();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Generate Quest from the uploaded document through GPT model: GPT 3.5 Turbo 16K"
          title="Generate Quest"
          avatar={
            <Avatar
              variant="square"
              src="/assets/ChatGPT.svg"
              sx={{ width: 42, height: 42 }}
            />
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Quest Name</InputLabel>
                <OutlinedInput defaultValue="My Private Quest" label="Quest Name" inputRef={questNameRef} />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Quest Type</InputLabel>
                <Select defaultValue="Private" label="Quest Type" inputRef={questTypeRef} disabled>
                  <MenuItem value="Private"><Chip variant="outlined" label="Private" color="secondary" size="small"/></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Quest Status</InputLabel>
                <Select defaultValue="Active" label="Quest Status" inputRef={questStatusRef} disabled>
                  <MenuItem value="Active"><Chip variant="outlined" label="Active" color="success" size="small"/></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth required>
                <TextField
                  defaultValue="Private quest for my own learning."
                  label="Quest Description"
                  inputRef={questDescriptionRef}
                  name="description"
                  multiline
                  required
                  rows={4}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Max Attempts</InputLabel>
                <OutlinedInput
                  defaultValue="1"
                  label="Max Attempts"
                  type="number"
                  inputRef={questMaxAttemptsRef}
                  inputProps={{ min: 1 }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Number of Questions</InputLabel>
                <OutlinedInput
                  defaultValue="3"
                  label="Number of Questions"
                  type="number"
                  inputRef={numQuestionsRef}
                  inputProps={{ min: 1 }}
                />
              </FormControl>
            </Grid>
            <Grid md={4} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Difficulty</InputLabel>
                <Select defaultValue="Easy" label="Difficulty" inputRef={difficultyRef} >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Difficult">Difficult</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Typography sx={{my:3}} variant="h6">Document Source</Typography>
          {documents ?
            <Grid container spacing={3} >
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="document-label">Document ID</InputLabel>
                  <Select
                    labelId="document-label"
                    id="document"
                    defaultValue={documents[0]?.id}
                    onChange={handleDocumentChange}
                    inputRef={questCourseIdRef}
                    variant="outlined"
                    type="number"
                    label="Document ID"
                  >
                    {documents.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.id} - {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>
              <Grid md={3} xs={6}>
                <Typography variant="overline" color="text.secondary">Filename</Typography>
                <Typography variant="body2">{selectedDocument?.name || documents[0].name}</Typography>
              </Grid>
              <Grid md={3} xs={6}>
                <Typography variant="overline" color="text.secondary"> Size</Typography>
                <Typography variant="body2">{selectedDocument?.size || documents[0].size} MB</Typography>
              </Grid>
              <Grid md={3} xs={6}>
                <Typography variant="overline" color="text.secondary">Uploaded At</Typography>
                <Typography variant="body2"> {new Date(selectedDocument?.uploaded_at || documents[0].uploaded_at).toLocaleDateString("en-SG", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}</Typography>
              </Grid>
              <Grid md={3} xs={6}>
                <Typography variant="overline" color="text.secondary">Source</Typography>
                <Typography variant="body2">
                  <a href={selectedDocument?.file || documents[0].file} target="_blank" rel="noopener noreferrer">
                    Source
                  </a>
                </Typography>
              </Grid>
            </Grid> : null}

          {showProgress ?
            <Box sx={{ width: '100%', mt: 5 }}>
              <LinearProgressWithLabel value={progress} status={progressStatus} />
            </Box> : null}
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button startIcon={<MagicWandIcon fontSize="var(--icon-fontSize-md)"/>} type="submit" variant="contained">Generate</Button>
        </CardActions>

      </Card>
      {submitStatus ?
        <Alert severity={submitStatus.type} sx={{ marginTop: 2 }}>
          {submitStatus.message}
        </Alert> : null}
    </form>
  );
}
