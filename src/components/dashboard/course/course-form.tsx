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
import type { Course } from "@/types/course";
import apiService from "@/api/api-service";
import {authClient} from "@/lib/auth/client";
import {logger} from "@/lib/default-logger";
import Typography from "@mui/material/Typography";
import {AxiosError} from "axios";
import type {AxiosResponse} from "axios";
import type {Term} from "@/types/term";
import Select, { type SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";

interface CourseFormProps {
  onFormSubmitSuccess: () => void;
}

export function CourseForm({ onFormSubmitSuccess }: CourseFormProps): React.JSX.Element {
  const courseCodeRef = React.useRef<HTMLInputElement>(null);
  const courseNameRef = React.useRef<HTMLInputElement>(null);
  const courseDescriptionRef = React.useRef<HTMLInputElement>(null);
  const courseStatusRef = React.useRef<HTMLInputElement>(null);
  const courseTermIdRef = React.useRef<HTMLInputElement>(null);
  const [terms, setTerms] = React.useState<Term[]>();
  const [selectedTerm, setSelectedTerm] = React.useState<Term | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getTerms = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Term[]> = await apiService.get<Term[]>(`/api/Term/`);
      const data: Term[] = response.data;
      setTerms(data);
      logger.debug('terms', data);
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

  const handleTermChange = (event: SelectChangeEvent<number>) => {
    // Since the value is now explicitly a number, ensure that the state and logic that depend on this value are correctly typed and implemented.
    const termId = Number(event.target.value); // Convert the value to a number
    const term = terms?.find(t => t.id === termId);
    if (term) {
      setSelectedTerm({
        id: term.id,
        name: term.name,
        start_date: term.start_date,
        end_date: term.end_date,
        academic_year: {
          id: term.academic_year.id,
          start_year: term.academic_year.start_year,
          end_year: term.academic_year.end_year
        }
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newCourse = {
      code: courseCodeRef.current?.value,
      name: courseNameRef.current?.value,
      description: courseDescriptionRef.current?.value,
      status: courseStatusRef.current?.value,
      term: selectedTerm || terms?.[0]
    };

    try {
      const response: AxiosResponse<Course> = await apiService.post(`/api/Course/`, newCourse);
      onFormSubmitSuccess();
      logger.debug('Create Success:', response.data);
      setSubmitStatus({type: 'success', message: 'Create Successful'});
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
    }

  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getTerms();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Add new course to the database" title="New Course" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Name</InputLabel>
                <OutlinedInput defaultValue="" label="Name" name="name" inputRef={courseNameRef} />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Code</InputLabel>
                <OutlinedInput defaultValue="" label="Code" name="code" inputRef={courseCodeRef} />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Description</InputLabel>
                <OutlinedInput defaultValue="" label="Description" name="description" inputRef={courseDescriptionRef}/>
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <OutlinedInput defaultValue="" label="Status" name="status" inputRef={courseStatusRef} />
              </FormControl>
            </Grid>

          </Grid>
          <Typography sx={{my:3}} variant="h6">Term</Typography>
          {terms && (

            <Grid container spacing={3}>

              <Grid md={3} xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Term ID</InputLabel>
                  <Select defaultValue={terms[0].id} onChange={handleTermChange} inputRef={courseTermIdRef} label="Term ID" variant="outlined" type="number">
                    {terms.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={3} xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Term Name</InputLabel>
                  <OutlinedInput value={selectedTerm?.name || terms[0].name} label="Term Name" disabled/>
                </FormControl>
              </Grid>
              <Grid md={3} xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Term Start Date</InputLabel>
                  <OutlinedInput value={selectedTerm?.start_date || terms[0].start_date}  label="Term Start Date" type="date" disabled/>
                </FormControl>
              </Grid>
              <Grid md={3} xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Term End Date</InputLabel>
                  <OutlinedInput value={selectedTerm?.end_date || terms[0].end_date}  label="Term End Date" type="date" disabled/>
                </FormControl>
              </Grid>
              <Grid xs={4}>
                <FormControl fullWidth required>
                  <InputLabel>Academic Year ID</InputLabel>
                  <OutlinedInput value={selectedTerm?.academic_year.id || terms[0].academic_year.id}  label="Term End Date" type="number" disabled/>
                </FormControl>
              </Grid>
              <Grid xs={4}>
                <FormControl fullWidth required>
                  <InputLabel>Start Year</InputLabel>
                  <OutlinedInput value={selectedTerm?.academic_year.start_year || terms[0].academic_year.start_year} label="Term End Date" type="number" disabled/>
                </FormControl>
              </Grid>
              <Grid xs={4}>
                <FormControl fullWidth required>
                  <InputLabel>End Year</InputLabel>
                  <OutlinedInput value={selectedTerm?.academic_year.end_year || terms[0].academic_year.end_year}  label="Term End Date" type="number" disabled/>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Add</Button>
        </CardActions>

      </Card>
      {submitStatus && (
        <Alert severity={submitStatus.type} sx={{ marginTop: 2 }}>
          {submitStatus.message}
        </Alert>
      )}

    </form>
  );
}
