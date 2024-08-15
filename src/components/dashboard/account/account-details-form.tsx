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
import { useUser } from '@/hooks/use-user';
import {UserAvatar, UserAvatarProps} from "@/components/auth/user-avatar";
import {getUserPhotoAvatar} from "@/app/msal/msal-graph";
import {logger} from "@/lib/default-logger";
import Avatar from "@mui/material/Avatar";
import {FloppyDisk as FloppyDiskIcon} from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import Typography from "@mui/material/Typography";
import type {AxiosResponse} from "axios";
import type {Course} from "@/types/course";
import apiService from "@/api/api-service";

export function AccountDetailsForm(): React.JSX.Element {
  const { eduquestUser } = useUser();
  const { user } = useUser();
  const nicknameRef = React.useRef<HTMLInputElement>(null);
  const [userPhoto, setUserPhoto] = React.useState<string | null>(null);
  const [showUserInitials, setShowUserInitials] = React.useState(false);
  const [userAvatarProps, setUserAvatarProps] = React.useState<UserAvatarProps>({
    name: '?',
  });

  function onImgError() : void  {
    setShowUserInitials(true);
  }
  function formatName(name: string | undefined): string {
    if (!name) return '';
    // Remove the starting and ending #
    return name.replace(/^#|#$/g, '')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedNickname = {
      nickname: nicknameRef.current?.value
    };

    if (eduquestUser) {
      try {
        const response: AxiosResponse<Course> = await apiService.patch(`/api/EduquestUser/${eduquestUser.email.toString()}/`, updatedNickname);
        logger.debug('Update Success:', response.data);
        window.location.reload();
        // setSubmitStatus({ type: 'success', message: 'Update Successful' });
        // await getCourse();
        // setShowForm(false)
      } catch (error) {
        logger.error('Submit Error:', error);
        // setSubmitStatus({ type: 'error', message: 'Update Failed. Please try again.' });

      }
    }


  };

  React.useEffect(() => {
    if (user) {
      type AvatarResponse = Blob | string;

      void getUserPhotoAvatar().then((response: AvatarResponse) => {
        logger.debug("getUserPhotoAvatar", response);
        if (response instanceof Blob) {
          const url = URL.createObjectURL(response);
          setUserPhoto(url);
        } else {
          setUserPhoto(response);
          setShowUserInitials(false);
        }
      });
      setShowUserInitials(false);
      setUserAvatarProps({
        name: formatName(user.name),
        bgColor: 'var(--mui-palette-neutral-900)',
        textColor: "white",
      });
      // console.log(user);
    }
  }, []) //intentionally left the dependency blank.

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Update nickname"
          title="Profile"
          avatar={
            showUserInitials ?
              <UserAvatar size={'48px'} {...userAvatarProps}/>
              : userPhoto &&
              <Avatar
                onError={onImgError}
                src={userPhoto ?? ''}
                sx={{width: 48, height: 48}}
              />
          }
        />

        <Divider/>
        {eduquestUser ? (
          <CardContent>
            <Grid container spacing={3}>
              <Grid sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Nickname</InputLabel>
                  <OutlinedInput defaultValue={eduquestUser.nickname} inputRef={nicknameRef} label="Nickname" name="nickname"/>
                </FormControl>
              </Grid>
              <Grid sm={6} xs={12} sx={{display: {xs: 'none', sm: 'block'}}}>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">First Name</Typography>
                <Typography variant="body2">{eduquestUser.first_name} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Last Name</Typography>
                <Typography variant="body2">{eduquestUser.last_name} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Username</Typography>
                <Typography variant="body2">{eduquestUser.username} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Email address</Typography>
                <Typography variant="body2">{eduquestUser.email} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Last login</Typography>
                <Typography variant="body2">
                  {new Date(eduquestUser.last_login).toLocaleDateString("en-SG", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
                </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Updated at</Typography>
                <Typography variant="body2">
                  {new Date(eduquestUser.updated_at).toLocaleDateString("en-SG", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
                </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Is superuser</Typography>
                <Typography variant="body2">{eduquestUser.is_superuser ? "Yes" : "No"} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Is active</Typography>
                <Typography variant="body2">{eduquestUser.is_active ? "Yes" : "No"} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Is staff</Typography>
                <Typography variant="body2">{eduquestUser.is_staff ? "Yes" : "No"} </Typography>
              </Grid>

            </Grid>
          </CardContent>
        ) : null}

        <Divider/>
        <CardActions sx={{justifyContent: 'flex-end'}}>
          <Button startIcon={<FloppyDiskIcon/>} type="submit" variant="contained">Update</Button>
        </CardActions>
      </Card>
    </form>
  );
}
