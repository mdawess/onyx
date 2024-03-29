import React, { useState, useEffect, useMemo } from 'react'
import { Select, Pagination, Slider, RangeSlider, Drawer } from '@mantine/core';
import { IoLocationSharp } from "react-icons/io5";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import Image from 'next/image';
import styles from '../../styles/components/Jobs.module.css'
import { Job } from '../../../backend/src/types/db.types';

type JobCardProps = {
  job: Job;
  email: boolean;
  employerName: string;
}

const EmailJobCard = (props: JobCardProps) => {
    const { job, email, employerName } = props;
    const [bookmarked, setBookmarked] = useState(false);
    const [opened, setOpened] = useState(false);
  
    // @todo: Add a call to get the employer website
    let website: string = websiteURL(employerName);
    let logo = fetchLogo(website);
    const date = job.deadline.toDateString();
  
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
          { email ? null :
            <Bookmarked bookmarked={bookmarked} setBookmarked={setBookmarked} job_id={job.job_id} />
          }
        </div>
        <div className={styles.jobCardBody}
          onClick={() => setOpened(!opened)}
        >
          <h4>{'Targetted Years: ' + formatYears(job.applicant_year as unknown as string[])}</h4>
          <p>{job.description}</p>
        </div>
        <div className={styles.jobTags}>
          {job.tags.map((tag: string) => Tag(tag))}
        </div>
        <p className={styles.deadline}>{'Deadline: ' + date}</p>
      </div>
      {/* @todo: add other necessary info */}
      { email ? null : 
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
      }
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
export const websiteURL = (company: string) => {
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

export default EmailJobCard;