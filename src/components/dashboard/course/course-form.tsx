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
import { FilePlus as FilePlusIcon } from '@phosphor-icons/react/dist/ssr/FilePlus';
import type {Image} from "@/types/image";
import {CardMedia} from "@mui/material";
import Chip from "@mui/material/Chip";

interface CourseFormProps {
  onFormSubmitSuccess: () => void;
}

export function CourseForm({ onFormSubmitSuccess }: CourseFormProps): React.JSX.Element {
  const courseCodeRef = React.useRef<HTMLInputElement>(null);
  const courseNameRef = React.useRef<HTMLInputElement>(null);
  const courseDescriptionRef = React.useRef<HTMLInputElement>(null);
  const courseStatusRef = React.useRef<HTMLInputElement>(null);
  const courseTypeRef = React.useRef<HTMLInputElement>(null);
  const courseTermIdRef = React.useRef<HTMLInputElement>(null);
  const courseImageIdRef = React.useRef<HTMLInputElement>(null);
  const [images, setImages] = React.useState<Image[]>();
  const [terms, setTerms] = React.useState<Term[]>();
  const [selectedTerm, setSelectedTerm] = React.useState<Term | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<Image | null>(null);
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

  const getImages = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Image[]> = await apiService.get<Image[]>(`/api/Image/`);
      const data: Image[] = response.data;
      setImages(data);
      logger.debug('images', data);
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

  const handleImageChange = (event: SelectChangeEvent<number>) => {
    const imageId = Number(event.target.value); // Convert the value to a number
    const image = images?.find(i => i.id === imageId);
    if (image) {
      setSelectedImage({
        id: image.id,
        name: image.name,
        filename: image.filename
      });
    }
  };

  const handleTermChange = (event: SelectChangeEvent<number>) => {
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
      type: courseTypeRef.current?.value,
      term: selectedTerm || terms?.[0],
      image: selectedImage || images?.[0]
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
      await getImages();
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
                <InputLabel>Course Name</InputLabel>
                <OutlinedInput defaultValue="" label="Name" name="name" inputRef={courseNameRef} />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Course Code</InputLabel>
                <OutlinedInput defaultValue="" label="Code" name="code" inputRef={courseCodeRef} />
              </FormControl>
            </Grid>

            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Course Type</InputLabel>
                <Select defaultValue="Eduquest" label="Quest Type" inputRef={courseTypeRef} name="type">
                  <MenuItem value="Eduquest"><Chip variant="outlined" label="Eduquest" color="primary" size={"small"}/></MenuItem>
                  <MenuItem value="Private"><Chip variant="outlined" label="Private" color="default" size={"small"}/></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Course Status</InputLabel>
                <Select defaultValue="Active" label="Quest Status" inputRef={courseStatusRef} name="type">
                  <MenuItem value="Active"><Chip variant="outlined" label="Active" color="success" size={"small"}/></MenuItem>
                  <MenuItem value="Inactive"><Chip variant="outlined" label="Inactive" color="default" size={"small"}/></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Course Description</InputLabel>
                <OutlinedInput defaultValue="" label="Description" name="description" inputRef={courseDescriptionRef}/>
              </FormControl>
            </Grid>

          </Grid>

          <Typography sx={{my:3}} variant="h6">Thumbnail</Typography>
          {images ?
            <Grid container spacing={3} >
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Thumbnail ID</InputLabel>
                  <Select defaultValue={images[0]?.id} onChange={handleImageChange} inputRef={courseImageIdRef}
                          label="Image ID" variant="outlined" type="number">
                    {images.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.id} - {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>
              <Grid md={3} xs={6}>
                <Typography variant="subtitle2">Thumbnail Name</Typography>
                <Typography variant="body2">{selectedImage?.name || images[0].name}</Typography>
              </Grid>
              <Grid md={3} xs={6}>
                <Typography variant="subtitle2">Thumbnail Filename</Typography>
                <Typography variant="body2">{selectedImage?.filename || images[0].filename}</Typography>
              </Grid>
              <Grid xs={12}>
                <Typography variant="subtitle2">Thumbnail Preview</Typography>
                <CardMedia
                  component="img"
                  alt={selectedImage?.name || images[0].name}
                  image={`/assets/${selectedImage?.filename || images[0].filename}`}
                  sx={{ height: 160, objectFit: 'contain', p: 4, mt:1, backgroundColor: '#fafafa' }}
                />
              </Grid>
            </Grid> : null}

          <Divider sx={{my:3}}/>

          <Typography sx={{my:3}} variant="h6">Term</Typography>

          {terms ?
            <Grid container spacing={3} >
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Term ID</InputLabel>
                  <Select defaultValue={terms[0].id} onChange={handleTermChange} inputRef={courseTermIdRef} label="Term ID" variant="outlined" type="number">
                    {terms.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.id} - AY{option.academic_year.start_year}-{option.academic_year.end_year} {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>
              <Grid md={4} xs={12}>
                <Typography variant="subtitle2">Term Name</Typography>
                <Typography variant="body2">{selectedTerm?.name || terms[0]?.name }</Typography>
              </Grid>
              <Grid md={4} xs={12}>
                <Typography variant="subtitle2">Term Code</Typography>
                <Typography variant="body2">{selectedTerm?.start_date || terms[0]?.start_date}</Typography>
              </Grid>
              <Grid md={4} xs={12}>
                <Typography variant="subtitle2">Term End Date</Typography>
                <Typography variant="body2">{selectedTerm?.end_date || terms[0]?.end_date}</Typography>
              </Grid>
              <Grid md={4} xs={12}>
                <Typography variant="subtitle2">Academic Year ID</Typography>
                <Typography variant="body2">{selectedTerm?.academic_year.id || terms[0]?.academic_year.id}</Typography>
              </Grid>
              <Grid md={4} xs={12}>
                <Typography variant="subtitle2">Start Year</Typography>
                <Typography variant="body2">{selectedTerm?.academic_year.start_year || terms[0]?.academic_year.start_year}</Typography>
              </Grid>
              <Grid md={4} xs={12}>
                <Typography variant="subtitle2">End Year</Typography>
                <Typography variant="body2">{selectedTerm?.academic_year.end_year || terms[0]?.academic_year.end_year}</Typography>
              </Grid>
            </Grid> : null}

        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button endIcon={<FilePlusIcon fontSize="var(--icon-fontSize-md)"/>} type="submit" variant="contained">Add</Button>
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
