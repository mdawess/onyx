import { ARCHIVE_JOB } from "../graphql/mutations/jobMutations";
import { GET_JOBS } from "../graphql/queries/jobQueries";
import React, {useState, useEffect} from 'react';
import styles from '../../frontend/styles/components/RemoveJob.module.css';
import Image from 'next/image';
import { useMutation, useQuery } from "@apollo/client";
import { Job } from "../../backend/src/types/db.types";
import loading_svg from "../../frontend/src/assets/loading.svg";
import {GET_EMPLOYER_BY_ID} from "../graphql/queries/employerQueries";
import { BsFillArchiveFill } from "react-icons/bs";
import SearchBar from "../src/components/jobs/SearchBar";
import BackButton from "../src/components/admin/BackButton";



//Search Bar


type SelectedJob = {
    jobID: string
}

export default function RemoveJob(props: SelectedJob) {


    //Mutations and Queries Needed
    const { data: jobsData, loading: loading, error: AllJobQueryError, refetch } = useQuery(GET_JOBS)

    const refetchQueries = [{ query: GET_JOBS }];

    const [search, setSearch] = useState('')
    const [jobs, setJobs] = useState([])

    useEffect(() => {
      if (!loading) {
          setJobs(jobsData?.getJobs)
        }
      }
      // Ignore, this is intentional
     ,[jobsData, loading])

     
    // For if the page is loading 
    if (loading) {
        return (
          <div className={styles.loading}>
            <Image src={loading_svg} alt="Loading..." width={100} height={100}/>
            <h1>Loading...</h1>
          </div>
        )
      }
    
    

    return (
        <div>
          <BackButton />
          <Image
              src="https://onyxinitiative.org/assets/img/onyxlogo_nav.png" 
              alt="Onyx Logo" 
              width={250} 
              height={100} 
          />
            <h1>Search for a Job to archive!</h1>
            <SearchBar setJobs={setJobs} query={search} setSearch={setSearch}/>
            <div className={styles.jobContainer}>
                {loading ? <p>loading</p> : jobs.map((job: Job, index:any) => <RemoveJobCard  job={job} key={index} refetchQueries={refetchQueries} />
                )}
                
            </div>
        </div>

    )
}



export function RemoveJobCard(props: any) {
  const {job, refetchQueries } = props
  const [deleteJob, {data: jobData, loading: deleteLoading, error}] = useMutation(ARCHIVE_JOB, {refetchQueries})


    const {data: employer_name, loading, error: queryError} = useQuery(GET_EMPLOYER_BY_ID, {variables: {
        employerId: job.employer_id
    }})


    const deadline_date = new Date(parseInt(job.deadline)).toDateString();
    const date_posted = new Date(parseInt(job.date_posted)).toDateString();

    async function confirmDelete() {
      try {
        var result = confirm("Are you sure you want to archive this Job?");
        if (result == true) {
        console.log(job.job_id)
        await deleteJob({variables: {jobId: job.job_id}})
        alert(`${job.title} successfully archived'`)}
        else {
    } }
      catch(queryError){
        console.error('Error occurred: ', queryError);
      }
    }

    if (loading) return <p>Loading...</p>;
    if (queryError) return <p>Error occurred. Please try again later.</p>;


    return (
        <div className={styles.removeJobCard}>
            <p>{job.title}</p>
            <p>{ loading ? <p>loading</p> : employer_name.getEmployerById.name}</p>
            <p>Deadline: {deadline_date}</p>
            <p>Date Posted: {date_posted}</p>
            <BsFillArchiveFill onClick={confirmDelete} size={20} color="black"></BsFillArchiveFill>
        </div>
    )
}


 
  
  