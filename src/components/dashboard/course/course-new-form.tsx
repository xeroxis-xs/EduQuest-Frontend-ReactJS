"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
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
import {CardMedia, TextField} from "@mui/material";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import {useTheme} from "@mui/material/styles";

interface CourseFormProps {
  onFormSubmitSuccess: () => void;
}

export function CourseNewForm({ onFormSubmitSuccess }: CourseFormProps): React.JSX.Element {
  const theme = useTheme();
  const courseCodeRef = React.useRef<HTMLInputElement>(null);
  const courseNameRef = React.useRef<HTMLInputElement>(null);
  const courseGroupRef = React.useRef<HTMLInputElement>(null);
  const courseDescriptionRef = React.useRef<HTMLInputElement>(null);
  const courseStatusRef = React.useRef<HTMLInputElement>(null);
  const courseTypeRef = React.useRef<HTMLInputElement>(null);
  const courseTermIdRef = React.useRef<HTMLInputElement>(null);
  const courseImageIdRef = React.useRef<HTMLInputElement>(null);
  const [images, setImages] = React.useState<Image[]>();
  const [terms, setTerms] = React.useState<Term[]>();
  const [isTermsLoading, setIsTermsLoading] = React.useState<boolean>(true);
  const [isImagesLoading, setIsImagesLoading] = React.useState<boolean>(true);
  const [selectedTerm, setSelectedTerm] = React.useState<Term | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<Image | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getTerms = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Term[]> = await apiService.get<Term[]>(`/api/Term/`);
      const data: Term[] = response.data;
      const filteredData = data.filter((term) => term.name !== 'Private Term' && term.academic_year.start_year !== 0);
      setTerms(filteredData);
      logger.debug('Filtered Terms', filteredData);
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
    } finally {
      setIsTermsLoading(false);
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
    } finally {
      setIsImagesLoading(false);
    }
  }

  const handleImageChange = (event: SelectChangeEvent<number>): void => {
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

  const handleTermChange = (event: SelectChangeEvent<number>): void => {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const newCourse = {
      code: courseCodeRef.current?.value,
      name: courseNameRef.current?.value,
      group: courseGroupRef.current?.value,
      description: courseDescriptionRef.current?.value,
      status: courseStatusRef.current?.value,
      type: courseTypeRef.current?.value,
      term: selectedTerm || terms?.[0],
      image: selectedImage || images?.[0]
    };

    try {
      const response: AxiosResponse<Course> = await apiService.post(`/api/Course/`, newCourse);
      onFormSubmitSuccess();
      logger.debug('New Course has been created successfully:', response.data);
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

  React.useEffect(() => {
    if (terms && terms.length > 0) {
      setSelectedTerm(terms[0]);
    }
  }, [terms]);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Add new course to the system" title="New Course" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="course name">Course Name</FormLabel>
                <TextField
                  inputRef={courseNameRef}
                  placeholder="The title of the course"
                  variant='outlined'
                  size='small'
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="course code">Course Code</FormLabel>
                <TextField
                  inputRef={courseCodeRef}
                  placeholder="The code of the course"
                  variant='outlined'
                  size='small'
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="course group">Course Group</FormLabel>
                <TextField
                  inputRef={courseGroupRef}
                  placeholder="The student group / session of the course"
                  variant='outlined'
                  size='small'
                />
              </FormControl>
            </Grid>

            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="course type">Course Type</FormLabel>
                <Select defaultValue="Public" size='small' label="Course Type" inputRef={courseTypeRef} name="type">
                  <MenuItem value="Public"><Chip variant="outlined" label="Public" color="primary" size="small"/></MenuItem>
                  <MenuItem value="Private"><Chip variant="outlined" label="Private" color="secondary" size="small"/></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="course status">Course Status</FormLabel>
                <Select defaultValue="Active" size='small' label="Course Status" inputRef={courseStatusRef} name="type">
                  <MenuItem value="Active"><Chip variant="outlined" label="Active" color="success" size="small"/></MenuItem>
                  <MenuItem value="Expired"><Chip variant="outlined" label="Expired" color="secondary" size="small"/></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="course description">Course Description</FormLabel>
                <TextField
                  inputRef={courseDescriptionRef}
                  placeholder="The description of the course"
                  variant='outlined'
                  multiline
                  size="medium"
                  rows={3}
                />
              </FormControl>
            </Grid>

          </Grid>

          <Divider sx={{my:3}}/>

          <Typography sx={{my:3}} variant="h6">Thumbnail</Typography>

          {isImagesLoading ? <Skeleton variant="rectangular" height={50}/>
            : images ?
            <Grid container spacing={3} >
              <Grid container md={6} xs={12} alignItems="flex-start">
                <Grid xs={12}>
                  <FormControl required>
                    <FormLabel htmlFor="thumbnail id">Thumbnail ID</FormLabel>
                    <Select defaultValue={images[0]?.id} onChange={handleImageChange} inputRef={courseImageIdRef}
                            label="Thumbnail ID" variant="outlined" type="number" size="small">
                      {images.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.id} - {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Thumbnail Name</Typography>
                  <Typography variant="body2">{selectedImage?.name || images[0].name}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Thumbnail Filename</Typography>
                  <Typography variant="body2">{selectedImage?.filename || images[0].filename}</Typography>
                </Grid>
              </Grid>

              <Grid md={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Thumbnail Preview</Typography>
                <CardMedia
                  component="img"
                  alt={selectedImage?.name || images[0].name}
                  image={`/assets/${selectedImage?.filename || images[0].filename}`}
                  sx={{ backgroundColor: theme.palette.background.level1, border: `1px solid ${theme.palette.neutral[200]}`, borderRadius: '8px' }}
                />
              </Grid>
            </Grid> : null}

          <Divider sx={{my:3}}/>

          <Typography sx={{my:3}} variant="h6">Term</Typography>
          {isTermsLoading ? <Skeleton variant="rectangular" height={50}/>
          : terms ?
            <Grid container spacing={3} >
              <Grid md={6} xs={12}>
                <FormControl required>
                  <FormLabel htmlFor="term id">Term ID</FormLabel>
                  <Select
                    defaultValue={terms[0].id}
                    onChange={handleTermChange}
                    inputRef={courseTermIdRef}
                    label="Term ID"
                    variant="outlined"
                    type="number"
                    size="small"
                  >
                    {terms.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.id} - AY{option.academic_year.start_year}-{option.academic_year.end_year} {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12} sx={{ display: { xs: 'none', md: 'block' } }}/>
              <Grid md={3} xs={6}>
                <Typography variant="overline" color="text.secondary">Term Name</Typography>
                <Typography variant="body2">{selectedTerm?.name || terms?.[0]?.name}</Typography>
              </Grid>
              <Grid md={3} xs={6}>
                <Typography variant="overline" color="text.secondary">Term Start Date</Typography>
                <Typography variant="body2">{selectedTerm?.start_date ?? null}</Typography>
              </Grid>
              <Grid md={3} xs={6}>
                <Typography variant="overline" color="text.secondary">Term End Date</Typography>
                <Typography variant="body2">{selectedTerm?.end_date ?? null}</Typography>
              </Grid>
              <Grid md={3} xs={6}>
                <Typography variant="overline" color="text.secondary">Academic Year ID</Typography>
                <Typography variant="body2">{selectedTerm?.academic_year.id || terms?.[0]?.academic_year.id}</Typography>
              </Grid>
              <Grid md={3} xs={6}>
                <Typography variant="overline" color="text.secondary">Start Year</Typography>
                <Typography variant="body2">{selectedTerm?.academic_year.start_year ?? null}</Typography>
              </Grid>
              <Grid md={3} xs={6}>
                <Typography variant="overline" color="text.secondary">End Year</Typography>
                <Typography variant="body2">{selectedTerm?.academic_year.end_year ?? null}</Typography>
              </Grid>
            </Grid> : null}

        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button startIcon={<FilePlusIcon fontSize="var(--icon-fontSize-md)"/>} type="submit" variant="contained">Add</Button>
        </CardActions>

      </Card>
      {submitStatus ?
        <Alert severity={submitStatus.type} sx={{ marginTop: 2 }}>
          {submitStatus.message}
        </Alert> : null}

    </form>
  );
}
