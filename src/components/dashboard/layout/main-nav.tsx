'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import {List as ListIcon} from '@phosphor-icons/react/dist/ssr/List';
import {UserAvatar, type UserAvatarProps} from '@/components/auth/user-avatar';
import {usePopover} from '@/hooks/use-popover';
import {useUser} from '@/hooks/use-user';
import {getUserPhotoAvatar} from "@/app/msal/msal-graph";
import {logger} from '@/lib/default-logger';
import {MobileNav} from './mobile-nav';
import {UserPopover} from './user-popover';
import { LinearProgressForLevel, } from "@/components/dashboard/misc/linear-progress-with-label";

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const userPopover = usePopover<HTMLDivElement>();
  const [userPhoto, setUserPhoto] = React.useState<string | null>(null);
  const [showUserInitials, setShowUserInitials] = React.useState(false);
  const [userAvatarProps, setUserAvatarProps] = React.useState<UserAvatarProps>({
    name: '?',
  });
  const { user, eduquestUser } = useUser();


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

  function onImgError() : void  {
    setShowUserInitials(true);
  }

  function formatName(name: string | undefined): string {
    if (!name) return '';

    // Remove the starting and ending #
    return name.replace(/^#|#$/g, '')
  }

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >


          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>

          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            {eduquestUser ?
              <LinearProgressForLevel
                sx={{ width: '200px' }}
                value={eduquestUser.total_points % 100}
                level={`Level ${Math.floor(eduquestUser.total_points / 100) + 1}`}
                absValue={Math.round(eduquestUser.total_points * 100) / 100}
              />
              : null}



            {
              showUserInitials ?
                <Box
                  onClick={userPopover.handleOpen}
                  ref={userPopover.anchorRef}
                  sx={{cursor: 'pointer'}}
                >
                  <UserAvatar {...userAvatarProps}/>
                </Box>
                 : userPhoto &&
                <Avatar
                  onClick={userPopover.handleOpen}
                  onError={onImgError}
                  ref={userPopover.anchorRef}
                  src={userPhoto ?? ''}
                  sx={{ cursor: 'pointer' }}
                />
            }

          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
