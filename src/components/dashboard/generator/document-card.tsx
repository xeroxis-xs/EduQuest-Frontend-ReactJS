import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import {CardMedia, Alert} from "@mui/material";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import apiService from "@/api/api-service";
import {logger} from "@/lib/default-logger";
import {AxiosError} from "axios";
import {authClient} from "@/lib/auth/client";
import {useUser} from "@/hooks/use-user";
import type { Document } from "@/types/document";
import Stack from "@mui/material/Stack";
import {CloudArrowUp as CloudArrowUpIcon} from "@phosphor-icons/react/dist/ssr/CloudArrowUp";
import { FileDashed as FileDashedIcon } from "@phosphor-icons/react/dist/ssr/FileDashed";
import FormControl from "@mui/material/FormControl";
import {styled} from "@mui/material/styles";


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface DocumentCardProps {
  documents: Document[];
  handleDeleteSuccess: (success: boolean) => void;
  handleSubmitSuccess: (success: boolean) => void;
}

export function DocumentCard({ documents = [], handleDeleteSuccess, handleSubmitSuccess }: DocumentCardProps): React.JSX.Element {
  const { eduquestUser } = useUser();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
    logger.debug('Selected File:', file);
  };

  const handleDelete = (documentId: number) => async () => {
    try {
      logger.debug("test")
      const response = await apiService.delete(`/api/Document/${documentId.toString()}/`);
      if (response.status === 204) {
        logger.debug('Document deleted successfully');
        handleDeleteSuccess(true);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await authClient.signInWithMsal();
        }
      }
      logger.error('Failed to delete document', error);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadStatus({ type: 'error', message: 'No file selected' });
      return;
    }

    // Check for maximum uploads
    if (documents.length >= 5) {
      setUploadStatus({ type: 'error', message: 'Maximum uploads per user: 5' });
      return;
    }

    // Check for supported file type
    const supportedFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!supportedFileTypes.includes(selectedFile.type)) {
      setUploadStatus({ type: 'error', message: 'Supported file type: PDF, DOCX, PPTX' });
      return;
    }

    // Check for maximum file size
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSizeInBytes) {
      setUploadStatus({ type: 'error', message: 'Maximum file size: 5MB' });
      return;
    }

    if (eduquestUser) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('uploaded_by', eduquestUser.id.toString());
      formData.append('name', selectedFile.name);
      formData.append('size', (selectedFile.size / (1024 * 1024)).toFixed(2));

      try {
        const response = await apiService.post('/api/DocumentUpload/', formData);
        if (response.status === 201) {
          logger.debug('Document uploaded successfully');
          setSelectedFile(null);
          handleSubmitSuccess(true);
          setUploadStatus({ type: 'success', message: 'Document uploaded successfully' });
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            await authClient.signInWithMsal();
          }
        }
        logger.error('Failed to upload document');
        setUploadStatus({ type: 'error', message: 'Failed to upload document' });
      }
    }
  }

  return (
    <Box>
      <Grid container spacing={4}>
        {documents.map((document) => (
          <Grid key={document.id} lg={3} md={4} xs={12} >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardActionArea
                href={document.file}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ height: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                <CardMedia
                  component="img"
                  alt={document.name}
                  image={`/assets/${document.file?.split('.').pop() ?? 'default'}.svg`}
                  sx={{ height: 160, objectFit: 'contain', p: 4, backgroundColor: '#fafafa' }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="overline" color="text.secondary">
                    filename
                  </Typography>
                  <Typography variant="body2" mb={2} >
                    {document.name}
                  </Typography>
                  <Typography variant="overline" color="text.secondary">
                    size
                  </Typography>
                  <Typography variant="body2" mb={2} >
                    {document.size} MB
                  </Typography>
                  <Typography variant="overline" color="text.secondary">
                    uploaded at
                  </Typography>
                  <Typography variant="body2">
                    {new Date(document.uploaded_at).toLocaleDateString("en-SG", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Box>
                <CardActions sx={{ justifyContent: 'flex-end'}}>
                  <Button
                    endIcon={<TrashIcon />}
                    color="error"
                    onClick={handleDelete(document.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Box>
            </Card>
          </Grid>
        ))}

        <Grid lg={3} md={4} xs={12} >
          <Card sx={{
            height: documents.length === 0 ? '500px' : '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <Stack spacing={2} sx={{height: '100%'}}>
                  <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
                    <FormControl required>
                      <Button
                        component="label"
                        role={undefined}
                        variant="outlined"
                        tabIndex={-1}
                        startIcon={<FileDashedIcon/>}
                        size='large'
                      >
                        {selectedFile ? selectedFile.name : 'Select Document'}
                        <VisuallyHiddenInput type="file" onChange={handleFileChange}/>
                      </Button>
                    </FormControl>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon size={22} style={{marginRight: '8px'}} color="#66bb6a"/>
                    <Typography variant="body2">
                      Maximum uploads per user: 5
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon size={22} style={{marginRight: '8px'}} color="#66bb6a"/>
                    <Typography variant="body2">
                      Supported file type: PDF, DOCX, PPTX
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={4}>
                    <CheckCircleIcon size={22} style={{marginRight: '8px'}} color="#66bb6a"/>
                    <Typography variant="body2">
                      Maximum file size: 5MB
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="center" alignItems="center" >
                    <FormControl required>
                      <Button
                        variant="contained"
                        startIcon={<CloudArrowUpIcon/>}
                        size='large'
                        type="submit"
                      >Upload</Button>
                    </FormControl>
                  </Box>
                  {uploadStatus ? <Alert severity={uploadStatus.type} sx={{marginTop: 2}}>
                      {uploadStatus.message}
                    </Alert> : null}
                </Stack>
              </CardContent>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
