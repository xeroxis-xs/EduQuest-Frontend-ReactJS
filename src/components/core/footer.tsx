import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { GithubLogo as GithubIcon } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { LinkedinLogo as LinkedInIcon } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import Stack from "@mui/material/Stack";

export function Footer(): React.JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
        pt: 3,
        pb: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e7e7e7',
        textAlign: 'center',
        flexShrink: 0,
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2024 EduQuest. All rights reserved.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          mt: 2,
          flexWrap: 'wrap',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <GithubIcon />
          <Link
            href="https://github.com/xeroxis-xs"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="inherit"
            variant="body2"
          >
            Github
          </Link>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <LinkedInIcon/>
          <Link
            href="https://www.linkedin.com/in/xisheng-/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="inherit"
            variant="body2"
          >
            LinkedIn
          </Link>
        </Stack>
      </Box>
    </Box>
  );
}
