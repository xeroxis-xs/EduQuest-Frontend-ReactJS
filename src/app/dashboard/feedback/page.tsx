import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack>
          <Typography variant="h4">Feedback</Typography>
        </Stack>
      </Stack>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSdgCny3HLRptSokCimNY5zvNwOU8wPiYS9fnKRfUOPk79npgQ/viewform?embedded=true"
        width="640"
        height="1200"
        title="Feedback Form"
        style={{ border: 0 }}
      >
        Loading…
      </iframe>
    </Stack>
  );
}
