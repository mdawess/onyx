import styles from "../../../styles/components/EmployerBlock.module.css";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Drawer, Button, ScrollArea, Center } from '@mantine/core';
import { job_type, Job } from '../../../../backend/src/types/db.types';
import EmployerJobList from './EmployerJobList';
import {Employer} from '../../../../backend/src/types/db.types'
import { GET_EMPLOYER_BY_ID } from '../../../graphql/queries/employerQueries';
import { useQuery } from "@apollo/client";
import { GET_JOBS_BY_EMPLOYER_ID } from "../../../graphql/queries/jobQueries";
import { getLogo, unsupportedCompanies } from "../../utils/microservices";
import { useMediaQuery } from "react-responsive";



export const EmployerBlock = (props: any) => {
    const { employer, jobs } = props
    const [opened, setOpened] = useState(false);

    // const {data: JobList, loading: jobLoading, error}  = useQuery(GET_JOBS_BY_EMPLOYER_ID, {
    //   variables: { employerId: employer.employer_id}
    // });
    
    // const [jobs, setJobs] = useState([])
      
    // useEffect(() => {
    //   if (!jobLoading && JobList?.getJobsByEmployerId) {
    //       setJobs(JobList?.getJobsByEmployerId)
    //   } else {
    //       setJobs([])
    //   }
    //   // Ignore, this is intentional
    // }, [JobList, jobLoading]);
    console.log(employer)

    const isLargeScreen = useMediaQuery({ query: '(min-width: 800px)' })

    return (
        
        <>
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          padding="xl"
          size="xl"
          position="right"
          scrollAreaComponent={ScrollArea.Autosize}
        >
          
            <Image src={employer.logo_url} 
                    alt="Company Logo" 
                    width={80}
                    height={80}
                    loader={({ src }) => src }
                    unoptimized
            />
            <p>
                <a href={employer.website}>{"Learn more: " + employer.website}</a>
            </p>
            <p>{"Contact: " + employer.contact_email}</p>
            {employer.student_new_grad_link ? <p>{"Student and New Grad Link: " + employer.student_new_grad_link}</p> : null }
            <p>{filterNewlines(employer.description)}</p>
            <h3>Job Postings</h3>
            <EmployerJobList jobs={jobs.filter((job: Job) => job.employer_id === employer.employer_id)} />
            
        </Drawer>
        <div style={{
            display: "flex", 
            flexDirection: "column", 
            width: "100%", 
            padding: "0.5rem",
            alignItems: "center",
        }}>
            <Button  className={styles.employerContainer} onClick={() => setOpened(true)}>
                <div>
                    <Image src={employer.logo_url} 
                        alt="Company Logo" 
                        width={isLargeScreen ? 200 : 90}
                        height={isLargeScreen ? 200 : 90}
                        // layout="fill"
                        objectFit="contain"
                        unoptimized={true}
                        priority={true}
                        loader={({ src }) => src }
                        />
                </div>
            </Button>
            <h3>{employer.name}</h3>
        </div>
      </>
        
    ) 
}
    

export const filterNewlines = (text: string) => {
    if (!text) return "";
    const result = text.split('\n').map((str: string, indx: number) => <p key={indx}>{str}</p>);
    return result;
}








