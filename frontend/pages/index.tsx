import type { NextPage } from 'next'
import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Scholar from './Scholar'
import ServerCheck from './ServerCheck'
import Login from './Login'
import { GET_SCHOLAR_BY_EMAIL } from '../graphql/queries/scholarQueries'
import loading from '../src/assets/loading.svg'

import { useSession } from 'next-auth/react';
import { useLazyQuery } from '@apollo/client'
import EmailTest from './EmailTest'
import { Email, Recommendation } from '../emails/jobUpdate'
import { Job } from '../../backend/src/types/db.types'

const serverResponse = {
    applicationDeadline: '2021-12-31',
}

const Home: NextPage = () => {

  const { data, status } = useSession({ required: true })

  // Promp user to login if not authenticated
  if (status != 'authenticated') {
    return <Login />
  }

  return (
    <div>
      <Scholar />
      {/* <Email scholarName='Michael' jobs={sampleJobs as Recommendation[]} />
      <EmailTest /> */}
    </div>
  )
}

// export const sampleJobs = [{
//   scholar_id: "1",
//   view_name: "Software Engineer",
//   employer: "Google",
//   title: "Software Engineer",
//   description: "This is a sample job description. You can apply here: https://www.google.com",
//   job_type: "Full Time",
//   location: "Toronto, ON",
//   deadline: '2021-12-31',    
// },
// {
//   scholar_id: "1",
//   view_name: "Software Engineer",
//   employer: "Google",
//   title: "Software Engineer",
//   description: "This is a sample job description. You can apply here: https://www.google.com",
//   job_type: "Full Time",
//   location: "Toronto, ON",
//   deadline: '2021-12-31',    
// },
// ]

export default Home
