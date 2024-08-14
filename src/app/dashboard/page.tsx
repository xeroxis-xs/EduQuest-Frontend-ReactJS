import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
// import dayjs from 'dayjs';

import { config } from '@/config';
// import { Budget } from '@/components/dashboard/overview/budget';
// import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
// import { LatestProducts } from '@/components/dashboard/overview/latest-products';
// import { Sales } from '@/components/dashboard/overview/sales';
// import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
// import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
// import { TotalProfit } from '@/components/dashboard/overview/total-profit';
// import { Traffic } from '@/components/dashboard/overview/traffic';
import { TotalCourse } from '@/components/dashboard/overview/total-course';
import { TotalQuest } from "@/components/dashboard/overview/total-quest";
import { Goat } from "@/components/dashboard/overview/goat";
import {TotalUser} from "@/components/dashboard/overview/total-user";
import {MyEnrolledCourses} from "@/components/dashboard/overview/my-enrolled-courses";
import {MyEarnedBadges} from "@/components/dashboard/overview/my-earned-badges";
import { RecentAchievements } from "@/components/dashboard/overview/recent-achievements";
import {TopCollectors} from "@/components/dashboard/overview/top-collectors";

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={5}>
      {/*<Grid lg={3} sm={6} xs={12}>*/}
      {/*  <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />*/}
      {/*</Grid>*/}
      {/*<Grid lg={3} sm={6} xs={12}>*/}
      {/*  <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />*/}
      {/*</Grid>*/}
      {/*<Grid lg={3} sm={6} xs={12}>*/}
      {/*  <TasksProgress sx={{ height: '100%' }} value={75.5} />*/}
      {/*</Grid>*/}
      {/*<Grid lg={3} sm={6} xs={12}>*/}
      {/*  <TotalProfit sx={{ height: '100%' }} value="$15k" />*/}
      {/*</Grid>*/}
      <Grid lg={3} sm={6} xs={12} >
        <TotalUser sx={{ height: '100%' }} value="10" trend="up" diff={12} />
      </Grid>
      <Grid lg={3} sm={6} xs={12} >
        <TotalCourse sx={{ height: '100%' }} value="12" trend="up" diff={16}/>
      </Grid>
      <Grid lg={3} sm={6} xs={12} >
        <TotalQuest sx={{ height: '100%' }} value="56" trend="up" diff={1}/>
      </Grid>
      <Grid lg={3} sm={6} xs={12} >
        <Goat sx={{ height: '100%' }} value={{nickname: 'TEOH XI SHENG', quest: 'Quest 1 from CSC1', time: '50ms'}} />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <MyEnrolledCourses
          courses={[
            {
              id: '123',
              code: 'CS2001',
              name: 'Artificial Intelligence',
              term: 'AY 2023 Semester 1',
              quests: 4,
              completed: 1,
            },
            {
              id: '124',
              code: 'CS2002',
              name: 'Data Science',
              term: 'AY 2023 Semester 1',
              quests: 5,
              completed: 1,
            },
            {
              id: '125',
              code: 'CS2003',
              name: 'Machine Learning',
              term: 'AY 2023 Semester 1',
              quests: 3,
              completed: 1,
            },
            {
              id: '126',
              code: 'CS2004',
              name: 'Cyber Security',
              term: 'AY 2023 Semester 1',
              quests: 3,
              completed: 1,
            },
            {
              id: '127',
              code: 'CS2005',
              name: 'Software Engineering',
              term: 'AY 2023 Semester 1',
              quests: 3,
              completed: 2,
            },
            {
              id: '128',
              code: 'CS2006',
              name: 'Computer Networks',
              term: 'AY 2023 Semester 1',
              quests: 3,
              completed: 1,
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={12} xs={12}>
        <MyEarnedBadges
          badges={[
            { name: 'First Attempt Badge', image: '/assets/first_attempt_badge.svg', count: 3 },
            { name: 'Completionist Badge', image: '/assets/completionist_badge.svg', count: 1 },
            { name: 'Expert Badge', image: '/assets/expert_badge.svg', count: 0 },
            { name: 'Speedster Badge', image: '/assets/speedster_badge.svg', count: 2 },
            { name: 'Perfectionist Badge', image: '/assets/perfectionist_badge.svg', count: 1 },
          ]}
        />
      </Grid>
      <Grid lg={5} md={12} xs={12}>
        <TopCollectors
          userBadges={[
            { nickname: 'Hugh Jackman', badges: [
              { name: 'Perfectionist Badge', image: '/assets/perfectionist_badge.svg' },
              { name: 'First Attempt Badge', image: '/assets/first_attempt_badge.svg' },
              { name: 'Speedster Badge', image: '/assets/speedster_badge.svg' },
              { name: 'Speedster Badge', image: '/assets/speedster_badge.svg' },
              { name: 'Completionist Badge', image: '/assets/completionist_badge.svg' },
              { name: 'Expert Badge', image: '/assets/expert_badge.svg' },
              { name: 'Expert Badge', image: '/assets/expert_badge.svg' },
              ]},
            { nickname: 'Robert Downey Jr', badges: [
              { name: 'Completionist Badge', image: '/assets/completionist_badge.svg' },
              { name: 'Completionist Badge', image: '/assets/completionist_badge.svg' },
              { name: 'First Attempt Badge', image: '/assets/first_attempt_badge.svg' },
              { name: 'Expert Badge', image: '/assets/expert_badge.svg' },
            ]},
            { nickname: 'Chris Hemsworth', badges: [
              { name: 'Expert Badge', image: '/assets/expert_badge.svg' },
              { name: 'Expert Badge', image: '/assets/expert_badge.svg' },
              { name: 'First Attempt Badge', image: '/assets/first_attempt_badge.svg' },
            ]},
            { nickname: 'Chris Evans', badges: [
              { name: 'Speedster Badge', image: '/assets/speedster_badge.svg' },
              { name: 'First Attempt Badge', image: '/assets/first_attempt_badge.svg' },
              { name: 'Completionist Badge', image: '/assets/completionist_badge.svg' },
            ]},
            { nickname: 'Scarlett Johansson', badges: [
              { name: 'Perfectionist Badge', image: '/assets/perfectionist_badge.svg' },
              { name: 'First Attempt Badge', image: '/assets/first_attempt_badge.svg' },
            ]}
          ]}
        />
      </Grid>
      <Grid lg={7} md={12} xs={12}>
        <RecentAchievements
          userBadges={[
            {
              name: 'First Attempt Badge',
              image: '/assets/first_attempt_badge.svg',
              nickname: 'Hugh Jackman',
              awarded_on: '2023-10-01 12:00:00',
              from_course: null,
              from_quest: 'Quest 1 in CC2001',
            },
            {
              name: 'Completionist Badge',
              image: '/assets/completionist_badge.svg',
              nickname: 'Robert Downey Jr',
              awarded_on: '2023-10-01 12:00:00',
              from_course: 'CS2002 Data Science',
              from_quest: null,
            },
            {
              name: 'Expert Badge',
              image: '/assets/expert_badge.svg',
              nickname: 'Chris Hemsworth',
              awarded_on: '2023-10-01 12:00:00',
              from_course: null,
              from_quest: 'Quest 1 in CS2003',
            },
            {
              name: 'Speedster Badge',
              image: '/assets/speedster_badge.svg',
              nickname: 'Chris Evans',
              awarded_on: '2023-10-01 12:00:00',
              from_course: null,
              from_quest: 'Quest 1 in CS2004',
            },
            {
              name: 'Perfectionist Badge',
              image: '/assets/perfectionist_badge.svg',
              nickname: 'Scarlett Johansson',
              awarded_on: '2023-10-01 12:00:00',
              from_course: null,
              from_quest: 'Quest 1 in CS2005',
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>

      {/*<Grid lg={8} xs={12}>*/}
      {/*  <Sales*/}
      {/*    chartSeries={[*/}
      {/*      { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },*/}
      {/*      { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },*/}
      {/*    ]}*/}
      {/*    sx={{ height: '100%' }}*/}
      {/*  />*/}
      {/*</Grid>*/}
      {/*<Grid lg={4} md={6} xs={12}>*/}
      {/*  <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />*/}
      {/*</Grid>*/}
      {/*<Grid lg={4} md={6} xs={12}>*/}
      {/*  <LatestProducts*/}
      {/*    products={[*/}
      {/*      {*/}
      {/*        id: 'PRD-005',*/}
      {/*        name: 'Soja & Co. Eucalyptus',*/}
      {/*        image: '/assets/product-5.png',*/}
      {/*        updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'PRD-004',*/}
      {/*        name: 'Necessaire Body Lotion',*/}
      {/*        image: '/assets/product-4.png',*/}
      {/*        updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'PRD-003',*/}
      {/*        name: 'Ritual of Sakura',*/}
      {/*        image: '/assets/product-3.png',*/}
      {/*        updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'PRD-002',*/}
      {/*        name: 'Lancome Rouge',*/}
      {/*        image: '/assets/product-2.png',*/}
      {/*        updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'PRD-001',*/}
      {/*        name: 'Erbology Aloe Vera',*/}
      {/*        image: '/assets/product-1.png',*/}
      {/*        updatedAt: dayjs().subtract(10, 'minutes').toDate(),*/}
      {/*      },*/}
      {/*    ]}*/}
      {/*    sx={{ height: '100%' }}*/}
      {/*  />*/}
      {/*</Grid>*/}
      {/*<Grid lg={8} md={12} xs={12}>*/}
      {/*  <LatestOrders*/}
      {/*    orders={[*/}
      {/*      {*/}
      {/*        id: 'ORD-007',*/}
      {/*        customer: { name: 'Ekaterina Tankova' },*/}
      {/*        amount: 30.5,*/}
      {/*        status: 'pending',*/}
      {/*        createdAt: dayjs().subtract(10, 'minutes').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'ORD-006',*/}
      {/*        customer: { name: 'Cao Yu' },*/}
      {/*        amount: 25.1,*/}
      {/*        status: 'delivered',*/}
      {/*        createdAt: dayjs().subtract(10, 'minutes').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'ORD-004',*/}
      {/*        customer: { name: 'Alexa Richardson' },*/}
      {/*        amount: 10.99,*/}
      {/*        status: 'refunded',*/}
      {/*        createdAt: dayjs().subtract(10, 'minutes').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'ORD-003',*/}
      {/*        customer: { name: 'Anje Keizer' },*/}
      {/*        amount: 96.43,*/}
      {/*        status: 'pending',*/}
      {/*        createdAt: dayjs().subtract(10, 'minutes').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'ORD-002',*/}
      {/*        customer: { name: 'Clarke Gillebert' },*/}
      {/*        amount: 32.54,*/}
      {/*        status: 'delivered',*/}
      {/*        createdAt: dayjs().subtract(10, 'minutes').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'ORD-001',*/}
      {/*        customer: { name: 'Adam Denisov' },*/}
      {/*        amount: 16.76,*/}
      {/*        status: 'delivered',*/}
      {/*        createdAt: dayjs().subtract(10, 'minutes').toDate(),*/}
      {/*      },*/}
      {/*    ]}*/}
      {/*    sx={{ height: '100%' }}*/}
      {/*  />*/}
      {/*</Grid>*/}
    </Grid>
  );
}
