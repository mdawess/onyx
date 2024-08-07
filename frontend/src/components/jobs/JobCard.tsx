import React, { useState, useEffect } from 'react'
import { Drawer, ScrollArea } from '@mantine/core';
import { IoLocationSharp, IoTimeSharp, IoBagSharp } from "react-icons/io5";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useMutation, useQuery } from '@apollo/client';
import Image from 'next/image';
import styles from '../../../styles/components/Jobs.module.css'
import { BOOKMARK_JOB } from '../../../graphql/mutations/scholarMutations';
import { useSession } from 'next-auth/react';
import { CHECK_BOOKMARK } from '../../../graphql/queries/scholarQueries';
import va from '@vercel/analytics';
import { useMediaQuery } from 'react-responsive';
import {LOG_APPLY_CLICK } from '../../../graphql/mutations/analyticsMutations';
import { LOG_JOB_CLICK } from '../../../graphql/mutations/analyticsMutations';
import { useRouter } from 'next/router';
import { GET_SCHOLAR_BY_EMAIL } from '../../../graphql/queries/scholarQueries';

type JobCardProps = {
  job: any;
  email: string;
  employerData: any;
  archive?: boolean | undefined;
}

const JobCard = (props: any) => {
  const { data: session } = useSession({ required: true })

  const { data: scholarData, loading: loadingScholar, error: scholarError } = useQuery(GET_SCHOLAR_BY_EMAIL, {
    variables: { email: session?.user?.email }
  })

  const [logJobClick] = useMutation(LOG_JOB_CLICK)
  const [logApplyClick] = useMutation(LOG_APPLY_CLICK)

    const { job, email, employerData, archive } = props;
    const [bookmarked, setBookmarked] = useState(false);
    const [opened, setOpened] = useState(false);
    const [logo, setLogo] = useState('https://logo.clearbit.com/www.onyxinitiative.org/');
    const [employerName, setEmployerName] = useState('');

    const date = new Date(parseInt(job.deadline)).toDateString();
    const check = new Date(parseInt(job.deadline)).getFullYear();

  
    useEffect(() => {
      if (employerData) {
        setLogo(employerData?.getEmployers?.find((employer: any) => employer.employer_id === job.employer_id).logo_url);
        setEmployerName(employerData?.getEmployers?.find((employer: any) => employer.employer_id === job.employer_id).name);
      }
    }, [employerData, job.employer_id])
    const isSmallScreen = useMediaQuery({ query: '(max-width: 767px)' });

    const handleJobClick = async () => {
      
      setOpened(!opened);
      try {
        // Ensure scholarId and jobId are integers before passing them to the mutation
        const scholarIdInt = parseInt(scholarData?.getScholarByEmail?.scholar_id, 10);
        const jobIdInt = parseInt(job.job_id, 10);
        const currentDate = new Date();
        console.log(session?.user?.name)
        await logJobClick({
          variables: { scholarId: scholarIdInt, jobId: jobIdInt }
        });
      } catch (err) {
        const scholarIdInt = scholarData?.getScholarByEmail?.scholar_id
        const jobIdInt = parseInt(job.job_id, 10);
        console.log(scholarIdInt)
        console.log(jobIdInt)
        console.error(err);
      }
    }
    
  
    return (
      <div key={job.job_id} className={styles.mainContainer}>
      <div className={styles.jobCard}>
        <div>
          <div className={styles.jobCardHeader}>
            <div className={styles.jobCardImage}>
              <Image 
                onClick={handleJobClick}
                src={logo}
                alt="Company Logo"
                width={60}
                height={60}
                priority
                quality={100}
                loader={({ src }) => src }
              />
            </div>
            <div className={styles.jobHeader}
              onClick={handleJobClick}
              style={{ marginLeft: '0.4rem'}}
            >
              <h3 style={{ padding: 0, margin: 0, marginBottom: "0.4rem"}}>{job.title}</h3>
              <div className={styles.additionalInfo}>
                <IoBagSharp size={16} color='rgb(54, 54, 54)' />
                <h5>{employerName}  </h5>
                <div></div>
                <IoLocationSharp size={16} color='rgb(54, 54, 54)' />
                <h5>{job.location}  </h5>
                <div></div>
                <IoTimeSharp size={16} color='rgb(54, 54, 54)' />
                <h5>{Capitalize(job.job_type)}</h5>
              </div>
            </div>
          </div>
          
          <div className={styles.jobCardBody}
            onClick={() => handleJobClick}
          >
            {job.applicant_year && job.applicant_year.length > 0 ? <h4>{'Graduation Years: ' + formatYears(job.applicant_year)}</h4> : null}
            <p>{job.description}</p>
          </div>
          {
            job.tags ?
          <div className={styles.jobTags}>
            {job.tags.map((tag: string, index:number) => <Tag key={tag} tag={tag}/>)}
          </div> : null
          }
          <p className={styles.deadline}>{check > 2090 ? "No Deadline" : 'Deadline: ' + date}</p>
        </div>
        {archive ? null : <Bookmarked bookmarked={bookmarked} setBookmarked={setBookmarked} job_id={job.job_id} />}
      </div>
      
      {/* @todo: add other necessary info */}
      { email ? null : 
      <Drawer
          opened={opened}
          onClose={() => setOpened(!opened)}
          padding="xl"
          size={isSmallScreen ? '90%' : '60%'}
          position='right'
          scrollAreaComponent={ScrollArea.Autosize}
        >
          <div className={styles.jobCardHeaderDrawer}>
            <Image 
              src={logo}
              alt="Company Logo"
              width={60}
              height={60}
              loader={({ src }) => src }
              // unoptimized
            />
            <div className={styles.jobHeaderDrawer}>
              <h3>{job.title}</h3>
              <div className={styles.additionalInfo} style={{ marginTop: "-16px"}}> 
                <IoBagSharp size={16} color='rgb(54, 54, 54)' />
                <h5>{employerName} </h5>
                <div></div>
                <IoLocationSharp size={16} color='rgb(54, 54, 54)' />
                <h5>{job.location} </h5>
                <div></div>
                <IoTimeSharp size={16} color='rgb(54, 54, 54)' />
                <h5>{Capitalize(job.job_type)}</h5>
              </div>
            </div>
          </div>
          {
            job.tags ?
          <div className={styles.jobTags}>
            {job.tags.map((tag: string, index: number) => <Tag key={tag} tag={tag}/>)}
          </div> : null
          }
          <div className={styles.jobCardBodyDrawer}>
            { job.link ? <div>
              <ApplyButton link={job.link} scholarData={scholarData} logApplyClick={logApplyClick} job={job} session={session}/>
            </div> : null}
          <div>
            <h4>Job Description</h4>
            <p>{formatText(job.long_description)}</p>
            { job.requirements ? 
              <div>
              <h4>Resposibilities & Requirements</h4> 
              {formatText(job.requirements)}
              </div> : null
            }
            {
              job.experience ? 
            <div>
              <h4>Experience</h4>
              <p>{job.experience}</p>
            </div> : null
            }
            {
             job.education ? 
              <div>
            <h4>Education</h4>
            {formatText(job.education)}
            </div> : null
            }
          </div>
          { job.term ? 
            <div style={{ display: "flex" }}>
                <p style={{ fontWeight: "bold", marginRight: "0.3rem" }}>Term: </p>
                <p>{job.term}</p>
            </div> : null
          }
          {job.contact_email ? <h4>{"Contact: " + job.contact_email}</h4> : null}
          {job.additional_info ?  
            <div> 
              <h5>Additional Information</h5>
              <p>{job.additional_info}</p>
            </div>
            : null}
          {job.how_to_apply ?  
            <div> 
              <h4>How to Apply</h4>
              <p>{job.how_to_apply}</p>
            </div>
            : null}
          <div style={{ display: "flex" }}>
              <p className={styles.deadline}>{check > 2090 ? "No Deadline" : 'Deadline: ' + date}</p>
          </div>
          </div>
        </Drawer>
      }
      </div>
    )
  }
  
  // @todo: Add logic so if there's more than x #, it renders +total - x more
  const Tag = (props: { tag: any; }) => {
    const tag = props.tag;
    return (
      <div className={styles.tag}>
        {tag}
      </div>
    )
  }
  
  const Bookmarked = (props: any) => {
    const { bookmarked, setBookmarked, job_id } = props;
    const { data: session, status } = useSession({ required: true })
    const [bookmarkJob, { data, loading }] = useMutation(BOOKMARK_JOB)
    const { data: bookmark, loading: bookmarkLoading, refetch } = useQuery(CHECK_BOOKMARK, {
      variables: { email: session?.user?.email, jobId: job_id }
    });

    useEffect(() => {
      if (!bookmarkLoading) {
        setBookmarked(bookmark?.checkBookmark);
      }
    }, [bookmark, bookmarkLoading, setBookmarked])

    return (
      <button 
        className={styles.bookmarkContainer}
        onClick={() => {
          // @todo: This should create a relation in the favourites table of the db
          bookmarkJob({
            variables: { email: session?.user?.email, jobId: job_id }
          })
          refetch({ email: session?.user?.email, jobId: job_id })
          setBookmarked(!bookmarked)
        }}
      >
        {bookmarked ? <FaBookmark size={24} color='#806E53' /> : <FaRegBookmark size={24} color='gray' />}
      </button>
    )
  }

const formatYears = (years: number[]) => {
  //Check if years is empty
  if (years.length === 0) return;
  let formattedYears: string = '';
  for (let i = 0; i < years.length; i++) {
    if (i === years.length - 1) {
      formattedYears += years[i].toString();
    } else {
      formattedYears += years[i].toString() + ', ';
    }
  }
  return formattedYears;
}

export const Capitalize = (str: string) => {
  // Capitalize each word in the string separated by a space
  const sub = str.split(' ');
  let capitalized = '';
  for (let i = 0; i < sub.length; i++) {
    capitalized += sub[i].charAt(0).toUpperCase() + sub[i].slice(1) + ' ';
  }
  return capitalized;
}

const ApplyButton = (props: any) => {

  const { link, logApplyClick, scholarData, job, session } = props;

  let regex = /^https:\/\//;

  return (
      <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: '#806E53', 
          marginTop: 10, 
          paddingRight: 30, 
          paddingTop: 15,
          paddingBottom: 15,
          paddingLeft: 30,
          borderRadius: 5,
          width: 'fit-content',
      }}>
            <button 
              style={{ border: 'none', backgroundColor: 'transparent', padding: 0, margin: 0}}
              onClick={async () => {
                try {
                  const scholarIdInt = parseInt(scholarData?.getScholarByEmail?.scholar_id, 10);
                  const jobIdInt = parseInt(job.job_id, 10);
                  console.log("SCHOLAR ID INT" + scholarIdInt);
                  console.log("JOB ID INT" + jobIdInt);
                  const currentDate = new Date();
          
                  if (!isNaN(scholarIdInt) && !isNaN(jobIdInt)) {
                    console.log('Sending request with:', { scholarId: scholarIdInt, jobId: jobIdInt });
                    await logApplyClick({
                      variables: { scholarId: scholarIdInt, jobId: jobIdInt }
                    });
                  } else {
                    console.error('Invalid scholarId or jobId');
                  }
          
                  va.track("Apply", { link: link });
                } catch (err) {
                  console.error('Error logging apply click:', err);
                }
              }}
            >
              <a 
                href={regex.test(link) ? link : "https://" + link} 
                style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem'}} 
                target='_blank' 
                rel="noreferrer"
              >
                Apply
              </a>
            </button>
          </div>
  )
}

const formatText = (text: string) => {
  if (!text) return "";
  // if (text[0] === '-' || text[0] === '•') {
    
    // Initial Function
    let result = text.split(/(?=- |\n)/)

    // Trim whitespaces
    let final = result.map((str: string, index: number) => {
      if (str.includes("- ") || str.startsWith("\n-\t" || str.startsWith("- "))) {
        return <li key={index}>{str.trim().slice(2)}</li>
      } else {
        return <div key={index}><h4 style={{ fontWeight: "bold", fontSize: "16" }}>{str}</h4></div>
      }
    });
    return final;
}

export const filterNewlines = (text: string) => {
  if (!text) return "";
  const result = text.split('\\n').map((str: string, indx: number) => <p key={indx}>{str}</p>);
  return result;
}

export default JobCard;