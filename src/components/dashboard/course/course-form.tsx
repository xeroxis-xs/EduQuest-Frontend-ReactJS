'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
// import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
// import type {AxiosResponse} from "axios";
import type { Course } from "@/types/course";
import apiService from "@/api/api-service";
import {authClient} from "@/lib/auth/client";
import {logger} from "@/lib/default-logger";

// const roles = [
//   { value: 'student', label: 'Student' },
//   { value: 'instructor', label: 'Instructor' },
//   { value: 'admin', label: 'Admin' },
// ] as const;

export function CourseForm(): React.JSX.Element {
  const [name, setName] = React.useState('');
  const [code, setCode] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [status, setStatus] = React.useState('');
  // const [term, setTerm] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const newCourse: Partial<Course> = {
      name,
      code,
      description,
      status
      // term
    };

    try {
      await apiService.post('/api/Course/', newCourse);
      logger.debug('User added successfully');
    } catch (error: unknown) {
      await authClient.signInWithMsal();
      logger.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Add new user to the database" title="New User" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Name</InputLabel>
                <OutlinedInput defaultValue="" label="Name" name="email" onChange={e => { setName(e.target.value); }} />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Code</InputLabel>
                <OutlinedInput defaultValue="" label="Code" name="code" onChange={e => { setCode(e.target.value); }} />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Description</InputLabel>
                <OutlinedInput defaultValue="" label="Description" name="description" onChange={e => { setDescription(e.target.value); }} />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <OutlinedInput defaultValue="" label="Status" name="status" onChange={e => { setStatus(e.target.value); }} />
              </FormControl>
            </Grid>
            {/*<Grid md={3} xs={6}>*/}
            {/*  <FormControl fullWidth required>*/}
            {/*    <InputLabel>Term ID</InputLabel>*/}
            {/*    <OutlinedInput defaultValue="" label="Term" name="term" onChange={e => { setTerm(e.target.value); }} />*/}
            {/*  </FormControl>*/}
            {/*</Grid>*/}

            {/*<Grid md={3} xs={6}>*/}
            {/*  <FormControl fullWidth>*/}
            {/*    <InputLabel>Role</InputLabel>*/}
            {/*    <Select defaultValue="New York" label="State" name="state" variant="outlined">*/}
            {/*      {roles.map((option) => (*/}
            {/*        <MenuItem key={option.value} value={option.value}>*/}
            {/*          {option.label}*/}
            {/*        </MenuItem>*/}
            {/*      ))}*/}
            {/*    </Select>*/}
            {/*  </FormControl>*/}
            {/*</Grid>*/}
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Add</Button>
        </CardActions>
      </Card>
    </form>
  );
}
