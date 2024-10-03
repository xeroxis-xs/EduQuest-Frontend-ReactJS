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
import {logger} from "@/lib/default-logger";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { FilePlus as FilePlusIcon } from '@phosphor-icons/react/dist/ssr/FilePlus';
import {TextField} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import {getAdminEduquestUsers} from "@/api/services/eduquest-user";
import {createCourseGroup} from "@/api/services/course-group";
import type {CourseGroupNewForm} from "@/types/course-group";
import type {EduquestUser, EduquestUserSummary} from "@/types/eduquest-user";

interface CourseGroupFormProps {
  onFormSubmitSuccess: () => void;
  courseId: string;
}

export function CourseNewGroupForm({ onFormSubmitSuccess, courseId }: CourseGroupFormProps): React.JSX.Element {
  const courseGroupNameRef = React.useRef<HTMLInputElement>(null);
  const courseGroupInstructorIdRef = React.useRef<HTMLInputElement>(null);
  const courseGroupSessionDayRef = React.useRef<HTMLInputElement>(null);
  const courseGroupSessionTimeRef = React.useRef<HTMLInputElement>(null);
  const [instructors, setInstructors] = React.useState<EduquestUser[]>();
  const [isInstructorsLoading, setIsInstructorsLoading] = React.useState<boolean>(true);
  const [selectedInstructor, setSelectedInstructor] = React.useState<EduquestUserSummary | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchInstructors = async (): Promise<void> => {
    try {
      const response = await getAdminEduquestUsers();
      setIsInstructorsLoading(false);
      setInstructors(response);
    } catch (error: unknown) {
      logger.error('Failed to fetch instructors', error);
    }
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (
      selectedInstructor &&
      courseGroupNameRef.current &&
      courseGroupInstructorIdRef.current &&
      courseGroupSessionDayRef.current &&
      courseGroupSessionTimeRef.current
    ) {
      const newCourseGroup: CourseGroupNewForm = {
        name: courseGroupNameRef.current.value,
        instructor_id: selectedInstructor.id,
        session_day: courseGroupSessionDayRef.current.value, // Ensure this matches the interface
        session_time: courseGroupSessionTimeRef.current.value,
        course_id: courseId as unknown as number
      };
      try {
        await createCourseGroup(newCourseGroup);
        onFormSubmitSuccess();
        setSubmitStatus({type: 'success', message: 'Course Group created successfully'});
      } catch (error: unknown) {
        logger.error('Failed to create Course Group', error);
        setSubmitStatus({ type: 'error', message: 'Failed to create Course Group' });
      }
    } else {
      logger.error('One or more form fields are missing.');
      setSubmitStatus({ type: 'error', message: 'All fields are required.' });
    }
  }

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchInstructors();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);

  // Pre-select the first instructor
  React.useEffect(() => {
    if (instructors && instructors.length > 0) {
      setSelectedInstructor(instructors[0]);
    }
  }, [instructors]);

  return (
    <form onSubmit={handleSubmit}>
      <Card sx={{ marginBottom: 2}}>
        <CardHeader subheader={`Add new group to Course ID: ${courseId}`} title="New Group" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="group-name">Group Name</FormLabel>
                <TextField
                  id="group-name" // Ensure this matches htmlFor
                  inputRef={courseGroupNameRef}
                  placeholder="The name of the group. E.g. 'SCSI'"
                  variant='outlined'
                  size='small'
                  required
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="group-session-day">Group Session Day</FormLabel>
                <Select
                  id="group-session-day"
                  defaultValue="Monday"
                  inputRef={courseGroupSessionDayRef}
                  name="group-session-day"
                  size="small"
                  required
                >
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="Tuesday">Tuesday</MenuItem>
                  <MenuItem value="Wednesday">Wednesday</MenuItem>
                  <MenuItem value="Thursday">Thursday</MenuItem>
                  <MenuItem value="Friday">Friday</MenuItem>
                  <MenuItem value="Saturday">Saturday</MenuItem>
                  <MenuItem value="Sunday">Sunday</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="group-session-time">Group Session Time</FormLabel>
                <TextField
                  id="group-session-time"
                  inputRef={courseGroupSessionTimeRef}
                  placeholder="The time of the group session"
                  defaultValue="09:00 AM - 10:00 AM"
                  variant='outlined'
                  size='small'
                  required
                />
              </FormControl>
            </Grid>
          {isInstructorsLoading ? <Skeleton variant="rectangular" height={50}/>
            : instructors ?
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <FormLabel htmlFor="instructor-id">Instructor</FormLabel>
                  <Select
                    id="instructor-id"
                    defaultValue={instructors[0]?.username}
                    inputRef={courseGroupInstructorIdRef}
                    label="Instructor ID"
                    variant="outlined"
                    type="number"
                    size="small"
                    required
                  >
                    {instructors.map((option) => (
                      <MenuItem key={option.id} value={option.username}>
                        {option.id} - {option.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> : null}

          </Grid>
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
