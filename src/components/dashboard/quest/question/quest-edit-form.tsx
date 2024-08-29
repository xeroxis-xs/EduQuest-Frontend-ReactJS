"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';
import apiService from "@/api/api-service";
import {AxiosError, type AxiosResponse} from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import type { Quest } from '@/types/quest';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, {type SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import {CardMedia} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import {Trash as TrashIcon} from "@phosphor-icons/react/dist/ssr/Trash";
import {FloppyDisk as FloppyDiskIcon} from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import {paths} from "@/paths";
import {useRouter} from "next/navigation";
import {useUser} from "@/hooks/use-user";
import type {Course} from "@/types/course";
import type {Image} from "@/types/image";

interface QuestEditFormProps {
  quest: Quest
  courses: Course[]
  setSubmitStatus: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error'; message: string } | null>>;
  toggleForm: () => void;
  onUpdateSuccess: () => void;
  onStatusChange: (status: string) => void;
}



export default function QuestEditForm( {quest, courses, toggleForm, setSubmitStatus, onUpdateSuccess, onStatusChange} : QuestEditFormProps ): React.JSX.Element {
  const router = useRouter();
  const { eduquestUser } = useUser();
  const [images, setImages] = React.useState<Image[]>();
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<Image | null>(null);
  const [status, setStatus] = React.useState(quest.status);

  const questTypeRef = React.useRef<HTMLInputElement>(null);
  const questNameRef = React.useRef<HTMLInputElement>(null);
  const questDescriptionRef = React.useRef<HTMLInputElement>(null);
  const questMaxAttemptsRef = React.useRef<HTMLInputElement>(null);
  const questStatusRef = React.useRef<HTMLInputElement>(null);
  const questExpirationDateRef = React.useRef<HTMLInputElement>(null);
  const questCourseIdRef = React.useRef<HTMLInputElement>(null);
  const questImageIdRef = React.useRef<HTMLInputElement>(null);


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
      }
      logger.error('Failed to fetch data', error);
    }
  };

  const handleCourseChange = (event: SelectChangeEvent<number>): void => {
    // Since the value is now explicitly a number, ensure that the state and logic that depend on this value are correctly typed and implemented.
    const courseId = Number(event.target.value); // Convert the value to a number
    const newCourse = courses?.find(c => c.id === courseId);
    if (newCourse) {
      setSelectedCourse({
        id: newCourse.id,
        name: newCourse.name,
        code: newCourse.code,
        group: newCourse.group,
        description: newCourse.description,
        status: newCourse.status,
        type: newCourse.type,
        term: newCourse.term,
        enrolled_users: newCourse.enrolled_users,
        image: newCourse.image,
      });
    }
  };

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

  const handleQuestSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const updatedQuest = {
      type: questTypeRef.current?.value,
      name: questNameRef.current?.value,
      description: questDescriptionRef.current?.value,
      status: questStatusRef.current?.value,
      expiration_date: questExpirationDateRef.current?.value
        ? new Date(questExpirationDateRef.current.value).toISOString()
        : null,
      max_attempts: questMaxAttemptsRef.current?.value,
      from_course: selectedCourse || quest?.from_course,
      image: selectedImage || quest?.image
    };

    try {
      const response: AxiosResponse<Quest> = await apiService.patch(`/api/Quest/${quest.id.toString()}/`, updatedQuest);
      logger.debug('Update Success:', response.data);
      setSubmitStatus({ type: 'success', message: 'Update Successful' });
      toggleForm();
      onUpdateSuccess();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        logger.error('Submit Error:', error);
        setSubmitStatus({type: 'error', message: 'Update Failed. Please try again.'});
      }
    }

  };

  const handleDeleteQuest = async (): Promise<void> => {
    try {
      await apiService.delete(`/api/Quest/${quest.id.toString()}`);
      router.push(paths.dashboard.quest.all as string);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
        logger.error('Failed to delete the quest', error);
        setSubmitStatus({type: 'error', message: 'Delete Failed. Please try again.'});
      }
    }
  };

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getImages();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <form onSubmit={handleQuestSubmit}>
      {quest ?
        <Card>
          <CardHeader
            title="Edit Quest Details"
            subheader={`ID: ${quest.id.toString()}`}
            action={
              eduquestUser?.is_staff ?
                <Stack direction="row" spacing={2} sx={{alignItems: 'center'}}>

                  {/*<Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>*/}

                  {/*  <IOSSwitch*/}
                  {/*    checked={quest.status === 'Active'}*/}
                  {/*    onClick={() => onStatusChange(quest.status === 'Active' ? 'Expired' : 'Active')}*/}
                  {/*  />*/}
                  {/*  <Typography variant="overline" color="text.secondary">*/}
                  {/*    {quest.status === 'Active' ? 'Active' : 'Expired'}*/}
                  {/*  </Typography>*/}
                  {/*</Stack>*/}

                  {/*<Button startIcon={<CalendarXIcon fontSize="var(--icon-fontSize-md)"/>} onClick={onStatusChange}*/}
                  {/*        color="error">Expires Quest</Button>*/}
                  <Button startIcon={<XCircleIcon fontSize="var(--icon-fontSize-md)"/>} color="error"
                          onClick={toggleForm}>
                    Cancel
                  </Button>
                </Stack> : null
            }
          />
          <Divider/>

          <CardContent>


            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Quest Name</InputLabel>
                  <OutlinedInput defaultValue={quest.name} label="Quest Name" inputRef={questNameRef} name="name"/>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Quest Type</InputLabel>
                  <Select defaultValue={quest.type ?? ""} label="Quest Type" inputRef={questTypeRef} name="type">
                    <MenuItem value="Eduquest MCQ"><Chip variant="outlined" label="Eduquest MCQ" color="primary"
                                                         size="small"/></MenuItem>
                    <MenuItem value="Private"><Chip variant="outlined" label="Private" color="secondary" size="small"/></MenuItem>
                    <MenuItem value="Kahoot!"><Chip variant="outlined" label="Kahoot!" color="violet"
                                                    size="small"/></MenuItem>
                    <MenuItem value="Wooclap"><Chip variant="outlined" label="Wooclap" color="neon"
                                                    size="small"/></MenuItem>
                  </Select>

                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Quest Status</InputLabel>
                  <Select value={quest.status ?? ""} label="Quest Status" inputRef={questStatusRef} name="status">
                    <MenuItem value="Active">
                      <Chip variant="outlined" label="Active" color="success" size="small"/>
                    </MenuItem>
                    <MenuItem value="Expired">
                      <Chip variant="outlined" label="Expired" color="secondary" size="small"/>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Quest Maximum Attempts</InputLabel>
                  <OutlinedInput defaultValue={quest.max_attempts} label="Quest Maximum Attempts"
                                 inputRef={questMaxAttemptsRef} name="max_attempts" type="number"/>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel shrink>Quest Expiry Date</InputLabel>
                  <OutlinedInput
                    label="Quest Expiry Date"
                    defaultValue={quest.expiration_date ? new Date(quest.expiration_date).toISOString().slice(0, 16) : ''}
                    inputRef={questExpirationDateRef}
                    name="Quest Expiry Date"
                    type="datetime-local"
                  />
                </FormControl>
              </Grid>
              <Grid xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Quest Description</InputLabel>
                  <OutlinedInput defaultValue={quest.description} label="Quest Description"
                                 inputRef={questDescriptionRef} name="description"/>
                </FormControl>
              </Grid>

            </Grid>

            <Divider sx={{my: 4}}/>

            <Typography sx={{my: 3}} variant="h6">Course</Typography>
            {courses ?
              <Grid container spacing={3}>
                <Grid md={6} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Course ID</InputLabel>
                    <Select defaultValue={quest.from_course.id ?? ""} onChange={handleCourseChange}
                            inputRef={questCourseIdRef}
                            label="Course ID" variant="outlined" type="number">
                      {courses.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.id} - {option.code} {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid md={6} xs={12} sx={{display: {xs: 'none', md: 'block'}}}/>
                <Grid md={6} xs={6}>
                  <Typography variant="overline" color="text.secondary">Course Name</Typography>
                  <Typography variant="body2">{selectedCourse?.name || quest.from_course.name}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Code</Typography>
                  <Typography variant="body2">{selectedCourse?.code || quest.from_course.code}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Group</Typography>
                  <Typography variant="body2">{selectedCourse?.group || quest.from_course.group}</Typography>
                </Grid>
                <Grid xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Description</Typography>
                  <Typography
                    variant="body2">{selectedCourse?.description || quest.from_course.description}</Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Year / Term</Typography>
                  <Typography variant="body2">
                    AY {selectedCourse?.term.academic_year.start_year || quest.from_course.term.academic_year.start_year}-{selectedCourse?.term.academic_year.end_year || quest.from_course.term.academic_year.end_year}
                    / {selectedCourse?.term.name || quest.from_course.term.name}
                  </Typography>
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography variant="overline" color="text.secondary">Course Duration</Typography>
                  <Typography variant="body2">
                    From {selectedCourse?.term.start_date || quest.from_course.term.start_date} to {selectedCourse?.term.end_date || quest.from_course.term.end_date}
                  </Typography>
                </Grid>
              </Grid> : null}

            <Divider sx={{my: 4}}/>

            <Typography sx={{my: 3}} variant="h6">Thumbnail</Typography>

            {images ?
              <Grid container spacing={3}>
                <Grid md={6} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Thumbnail ID</InputLabel>
                    <Select defaultValue={quest.image.id ?? ""} onChange={handleImageChange} inputRef={questImageIdRef}
                            label="Thumbnail ID" variant="outlined" type="number">
                      {images.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.id} - {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid md={9} xs={12} sx={{display: {xs: 'none', md: 'block'}}}/>
                <Grid md={6} xs={6}>
                  <Typography variant="overline" color="text.secondary">Thumbnail Name</Typography>
                  <Typography variant="body2">{selectedImage?.name || quest.image.name}</Typography>
                </Grid>
                <Grid md={6} xs={6}>
                  <Typography variant="overline" color="text.secondary">Thumbnail Filename</Typography>
                  <Typography variant="body2">{selectedImage?.filename || quest.image.filename}</Typography>
                </Grid>
                <Grid xs={12}>
                  <Typography variant="overline" color="text.secondary">Thumbnail Preview</Typography>
                  <CardMedia
                    component="img"
                    alt={selectedImage?.name || quest.image.name}
                    image={`/assets/${selectedImage?.filename || quest.image.filename}`}
                    sx={{height: 160, objectFit: 'contain', p: 4, mt: 1, backgroundColor: '#fafafa'}}/>
                </Grid>
              </Grid> : null}

          </CardContent>

          <CardActions sx={{justifyContent: 'space-between'}}>
            <Button startIcon={<TrashIcon/>} color="error" onClick={handleDeleteQuest}>Delete Quest</Button>
            <Button startIcon={<FloppyDiskIcon/>} type="submit" variant="contained">Update Quest</Button>
          </CardActions>
        </Card>
       : null }

    </form>
  );
}
