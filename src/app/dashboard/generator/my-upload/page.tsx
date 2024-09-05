"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import apiService from "@/api/api-service";
import {AxiosError, type AxiosResponse} from "axios";
import { logger } from '@/lib/default-logger'
import { authClient } from "@/lib/auth/client";
import {useUser} from "@/hooks/use-user";
import type { Document } from "@/types/document";
import { SkeletonBadgeCard } from '@/components/dashboard/skeleton/skeleton-badge-card';
import { DocumentCard } from "@/components/dashboard/generator/document-card";



export default function Page(): React.JSX.Element {
  const { eduquestUser } = useUser();
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = React.useState(true);



  const getMyDocuments = async (): Promise<void> => {
    if (eduquestUser) {
      try {
        const response: AxiosResponse<Document[]> = await apiService.get<Document[]>(`/api/Document/by-user/${eduquestUser?.id.toString()}/`);
        const data: Document[] = response.data;
        setDocuments(data);
        logger.debug('Documents', data);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            await authClient.signInWithMsal();
          }
        }
        logger.error('Failed to fetch data', error);
      } finally {
        setLoadingDocuments(false);
      }
    }
  }

  const handleDeleteSuccess = async (): Promise<void> => {
    await getMyDocuments();
  }

  const handleSubmitSuccess = async (): Promise<void> => {
    await getMyDocuments();
  }


  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await getMyDocuments();
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, []);


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} >
          <Typography variant="h4">My Documents</Typography>
          <Typography variant="body2" color="text.secondary">You can upload lecture materials here and use them to generate quests and questions!</Typography>

        </Stack>

      </Stack>


      <Stack spacing={1} sx={{ flex: '1 1 auto' }}>

            { loadingDocuments ? <SkeletonBadgeCard/>
            :
              ( documents ?
                  <DocumentCard
                    documents={documents}
                    handleDeleteSuccess={handleDeleteSuccess}
                    handleSubmitSuccess={handleSubmitSuccess}
                  /> :
               null
              )
            }


      </Stack>
    </Stack>

  );
}
