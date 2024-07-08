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
import type {EduquestUser} from "@/types/eduquest-user";
import apiService from "@/api/api-service";
import {authClient} from "@/lib/auth/client";
import {logger} from "@/lib/default-logger";
import {AxiosError} from "axios";

// const roles = [
//   { value: 'student', label: 'Student' },
//   { value: 'instructor', label: 'Instructor' },
//   { value: 'admin', label: 'Admin' },
// ] as const;

export function EduquestUserForm(): React.JSX.Element {
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const newUser: Partial<EduquestUser> = {
      email,
      username,
      first_name: firstName,
      last_name: lastName,
    };

    try {
      await apiService.post('/api/EduquestUser/', newUser);
      logger.debug('User added successfully');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Error: ', error);
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
                <InputLabel>Email</InputLabel>
                <OutlinedInput defaultValue="" label="Email" name="email" onChange={e => { setEmail(e.target.value); }} />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Username</InputLabel>
                <OutlinedInput defaultValue="" label="Username" name="username" onChange={e => { setUsername(e.target.value); }} />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>First Name</InputLabel>
                <OutlinedInput defaultValue="" label="First Name" name="first_name" onChange={e => { setFirstName(e.target.value); }} />
              </FormControl>
            </Grid>
            <Grid md={3} xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Last Name</InputLabel>
                <OutlinedInput defaultValue="" label="Last Name" name="last_name" onChange={e => { setLastName(e.target.value); }} />
              </FormControl>
            </Grid>
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
