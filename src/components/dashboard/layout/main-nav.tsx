'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import {Bell as BellIcon} from '@phosphor-icons/react/dist/ssr/Bell';
import {List as ListIcon} from '@phosphor-icons/react/dist/ssr/List';
// import {MagnifyingGlass as MagnifyingGlassIcon} from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import {Users as UsersIcon} from '@phosphor-icons/react/dist/ssr/Users';
import {UserAvatar, type UserAvatarProps} from '@/components/auth/user-avatar';

import {usePopover} from '@/hooks/use-popover';
import {useUser} from '@/hooks/use-user';
import {getUserPhotoAvatar} from "@/app/msal/msal-graph";
// import {extractInitials} from '@/app/msal/user-helper';
import {logger} from '@/lib/default-logger';

import {MobileNav} from './mobile-nav';
import {UserPopover} from './user-popover';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);

  const userPopover = usePopover<HTMLDivElement>();
  const [userPhoto, setUserPhoto] = React.useState<string | null>(null);
  const [showUserInitials, setShowUserInitials] = React.useState(false);
  const [userAvatarProps, setUserAvatarProps] = React.useState<UserAvatarProps>({
    name: '?',
  });

  const { user } = useUser();


  React.useEffect(() => {
    if (user) {
      // const response = await getUserPhotoAvatar();
      // if (response instanceof Blob) {
      //   const url = URL.createObjectURL(response);
      //   setUserPhoto(url);
      // } else if (typeof response === "string") {
      //   setUserPhoto(response);
      //   setShowUserInitials(false);
      // } else {
      //   logger.error("Unsupported photo data type.");
      // }
      type AvatarResponse = Blob | string;

      void getUserPhotoAvatar().then((response: AvatarResponse) => {
        logger.debug("getUserPhotoAvatar", response);
        if (response instanceof Blob) {
          const url = URL.createObjectURL(response);
          setUserPhoto(url);
        } else if (typeof response === "string") {
          setUserPhoto(response);
          setShowUserInitials(false);
        } else {
          logger.error("Unsupported photo data type.");
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
            {/*<Tooltip title="Search">*/}
            {/*  <IconButton>*/}
            {/*    <MagnifyingGlassIcon />*/}
            {/*  </IconButton>*/}
            {/*</Tooltip>*/}
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            {/*<Tooltip title="Contacts">*/}
            {/*  <IconButton>*/}
            {/*    <UsersIcon />*/}
            {/*  </IconButton>*/}
            {/*</Tooltip>*/}
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
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
