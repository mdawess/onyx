import React, { useState, useEffect, useMemo } from 'react'
import { Select, Pagination, Slider, RangeSlider, Drawer } from '@mantine/core';
import { DatePicker, DateRangePicker } from '@mantine/dates';
import { Job } from '../../../../backend/src/types/db.types';
import styles from '../../../styles/components/Jobs.module.css'
import loading_svg from '../../assets/loading.svg';
import Image from 'next/image';
import { IoLocationSharp } from "react-icons/io5";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_EMPLOYER_BY_ID } from '../../../graphql/queries/employerQueries';

type ListedJobsProps = {
    jobs: Job[];
}

type Bookmarks = {
    [key: string]: boolean;
}

export default function ListedJobs(props: ListedJobsProps) {
  const { jobs } = props;
  const [activePage, setPage] = useState(1);

  // @todo: This should be changed when the backend is called
  // The current jobs variable should be cleared and then the new jobs should be added
  // with loading corresponding to those states
  const [loading, setLoading] = useState(false);

  // @todo: Change this to 10 for production
  const jobsPerPage = 4;

  // Uncomment this when backend is connected
  const numPages = loading ? 1 : Math.ceil(jobs.length / jobsPerPage);

  // The jobs to display beased on the current page
  const display = jobs.slice((activePage - 1) * jobsPerPage, activePage * jobsPerPage);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Image src={loading_svg} alt="Loading..." width={100} height={100}/>
        <h1>Loading...</h1>
      </div>
    )
  }

  // @todo: Map over the job object and add ability to switch pages
  // @todo: fix bookmarking and make it so it doesnt slow down the page
  return (
    <div className={styles.cardContainer}>
      {/* For the job listing */}
      <div className={styles.job}>
        {display.map((job: any, index: number) => {
          return (
              <JobCard job={job} key={index} />
          )
        })}
      </div>
      {/* For the pages */}
      <div>
        <Pagination 
          page={activePage} 
          onChange={setPage} 
          total={numPages} 
          color="gray"
        />
      </div>
    </div>
  )
}

// Move to separate components file
const JobCard = (props: any) => {
  const { job } = props;
  const [bookmarked, setBookmarked] = useState(false);
  const [opened, setOpened] = useState(false);
  const { data, loading } = useQuery(GET_EMPLOYER_BY_ID, {
    variables: { employerId: job.employer_id }
  });

  // @todo: Add a call to get the employer website
  let website: string;
  if (job.name) {
    website = websiteURL(job.name)
  } else {
    if (loading) {
      website = 'www.onyxinitiative.org/'
    } else {
      website = websiteURL(data.getEmployerById.name);
    }
  }
3
  let logo = fetchLogo(website);
  const date = new Date(parseInt(job.deadline)).toDateString();

  return (
    <div key={job.job_id} className={styles.mainContainer}>
    <div className={styles.jobCard}>
      <div className={styles.jobCardHeader}>
        <Image 
          onClick={() => setOpened(!opened)}
          src={logo}
          alt="Company Logo"
          width={60}
          height={60}
        />
        <div className={styles.jobHeader}
          onClick={() => setOpened(!opened)}
        >
          <h3>{job.title}</h3>
          <div className={styles.additionalInfo}>
            <IoLocationSharp size={16} color='gray' />
            <h6>{job.location} • {job.job_type}</h6>
          </div>
        </div>
        <Bookmarked bookmarked={bookmarked} setBookmarked={setBookmarked} job_id={job.job_id} />
      </div>
      <div className={styles.jobCardBody}
        onClick={() => setOpened(!opened)}
      >
        <h4>{'Targetted Years: ' + formatYears(job.applicant_year)}</h4>
        <p>{job.description}</p>
      </div>
      <div className={styles.jobTags}>
        {job.tags.map((tag: string) => Tag(tag))}
      </div>
      <p className={styles.deadline}>{'Deadline: ' + date}</p>
    </div>
    {/* @todo: add other necessary info */}
    <Drawer
        opened={opened}
        onClose={() => setOpened(!opened)}
        padding="xl"
        size="30%"
        position='right'
      >
        <div className={styles.jobCardHeader}>
        <Image 
          src={logo}
          alt="Company Logo"
          width={60}
          height={60}
        />
        <div className={styles.jobHeader}>
          <h3>{job.title}</h3>
          <div className={styles.additionalInfo}>
            <IoLocationSharp size={16} color='gray' />
            <h6>{job.location} • {job.job_type}</h6>
          </div>
        </div>
      </div>
      </Drawer>
    </div>
  )
}

// @todo: Add logic so if there's more than x #, it renders +total - x more
const Tag = (tag: string) => {
  return (
    <div className={styles.tag}>
      {tag}
    </div>
  )
}

const Bookmarked = (props: any) => {
  const { bookmarked, setBookmarked, job_id } = props;
  return (
    <button 
      className={styles.bookmarkContainer}
      onClick={() => {
        // @todo: This should create a relation in the favourites table of the db
        setBookmarked(!bookmarked)
      }}
    >
      {bookmarked ? <FaBookmark size={24} color='#806E53' /> : <FaRegBookmark size={24} color='gray' />}
    </button>
  )
}

//@todo: Pull logos programmatically
const websiteURL = (company: string) => {
  // Temp fix
  if (company == 'Facebook') {
    return 'www.facebook.com';
  } else if (company === '') {
    return 'www.onyxinitiative.org/';
  } else {
    return "www." + company.toLowerCase().replace(/ /g, "-") + ".com";
  }
}

// Helper function to get logos dynamically
// @todo: try to update this to get higher quality logos
export const fetchLogo = (websiteURL: string) => {
  return `https://logo.clearbit.com/${websiteURL}`;
}

const formatYears = (years: string[]) => {
  let formattedYears: string = '';
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < years.length; i++) {
    if (i === years.length - 1) {
      formattedYears += (currentYear +parseInt(years[i]));
    } else {
      formattedYears += (currentYear +parseInt(years[i])) + ', ';
    }
  }
  return formattedYears;
}