import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import styles from "../styles/components/AddJobForm.module.css";
import { Checkbox } from "@mantine/core";
import { CREATE_JOB } from "../graphql/mutations/jobMutations";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Employer, job_type } from "../../backend/src/types/db.types";
import Image from 'next/image';
import {GET_EMPLOYER_BY_NAME, GET_EMPLOYERS} from "../../frontend/graphql/queries/employerQueries";
import {Select, MultiSelect, Button} from '@mantine/core';
import { DatePicker } from '@mantine/dates';



type JobInfo = {
    employer_id: string,
    admin_id: string,
    title: string,
    description: string,
    long_description: string
    contact_email: string
    job_type: string,
    term: string,
    location: string,
    applicant_year: number[],
    deadline: string,
    tags: string[]
}

export default function AddJob() {
    const [JobInfo, setJobInfo] = useState({} as JobInfo)
    const [checked, setChecked] = useState(false)
    const [createJob, {data: jobData, loading, error}] = useMutation(CREATE_JOB, {variables: {
      employerId: JobInfo.employer_id,
    adminId: JobInfo.admin_id,
    title: JobInfo.title,
    term: JobInfo.term,
    description: JobInfo.description,
    jobType: JobInfo.job_type,
    longDescription: JobInfo.long_description,
    contactEmail: JobInfo.contact_email,
    location: JobInfo.location,
    applicantYear: JobInfo.applicant_year,
    deadline: JobInfo.deadline,
    tags: JobInfo.tags
    }})
    const router = useRouter()
    const [completed, setCompleted] = useState(null as boolean | null)


    const handleSubmit = () => {
      console.log(JobInfo)
      createJob();
      router.push('/Admin')
  }

  const [dateValue, setDateValue] = useState<Date | null>(null);

  const { data: employerData, loading: employerLoading, } = useQuery(GET_EMPLOYERS)

  const [empData, setEmpData] = useState([])



  useEffect(() => {
    if (completed) {
      handleSubmit();
    }
  }, [completed])

  useEffect(() => {
    if (!employerLoading) {
      setEmpData(employerData?.getEmployers)
    }
    // Ignore, this is intentional
  }, [empData, employerLoading])

  

  const [searchValue, onSearchChange] = useState('');
  const [applicationYearSearchValue, onSearchApplicationYear] = useState('');
  const [tagSearchValue, onSearchTag] = useState('');
  const [tagData, setTagData] = useState([{ value: 'Technology', label:  'Technology' },
    { value: 'Business ', label: 'Business' }, { value: 'Marketing', label:  'Marketing' }, { value: 'Engineering', label:  'Engineering' }, { value: 'Finance', label:  'Finance' }, { value: 'HR', label:  'HR' }, { value: 'IT', label:  'IT' }, { value: 'Research', label:  'Research' }, { value: 'Sales', label:  'Sales' }, { value: 'Security', label:  'Security' }, { value: 'Accounting', label:  'Accounting' }, { value: 'Administration', label:  'Administration' }, { value: 'Automotive', label:  'Automotive' }, { value: 'Arts&Entertainment', label:  'Arts&Entertainment' }, { value: 'Communication', label:  'Communication' }, { value: 'Design', label:  'Design' }, { value: 'Gaming', label:  'Gaming' }, { value: 'Healthcare', label:  'HealthCare' }, { value: 'Mathematics', label:  'Mathematics' }, { value: 'Telecommunications', label:  'Telecommunications' }
    ])
  

    const {loading: employerIdLoading, data: employerId} = useQuery(GET_EMPLOYER_BY_NAME, {variables: {name: searchValue}})

  
    useEffect(() => {
      console.log(applicationYearSearchValue)
      if(!employerIdLoading && searchValue != "") {
        JobInfo.employer_id = employerId.getEmployerByName.employer_id
        JobInfo.admin_id = "1"
      }
    }, [searchValue, employerIdLoading])
    const [selected, setSelected] = useState([] as any[])



  
  

    return (
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image
              src="https://onyxinitiative.org/assets/img/onyxlogo_nav.png" 
              alt="Onyx Logo" 
              width={250} 
              height={100} 
          />
        </div>
        <div className={styles.formContainer}> 
          <h1> Create a Job!</h1>
          <InputElement label="title" JobInfo={JobInfo} setJobInfo={setJobInfo} />
          <Select
            className={styles.inputContainer}
            label="Employer Name"
            placeholder="Pick one"
            dropdownComponent="div"
            searchable
            clearable
            onSearchChange={onSearchChange}
            searchValue={searchValue}
            nothingFound="No options"
            data={formatEmpData(empData)}
          />
          <InputElement label="description" JobInfo={JobInfo} setJobInfo={setJobInfo} />
          <InputElement label="jobType" JobInfo={JobInfo} setJobInfo={setJobInfo} />
          <InputElement label="term" JobInfo={JobInfo} setJobInfo={setJobInfo} />
          <InputElement label="location" JobInfo={JobInfo} setJobInfo={setJobInfo} />
          <MultiSelect
            className={styles.inputContainer}
            label="applicantYear"
            placeholder="Pick one"
            searchable
            clearable
            onSearchChange={onSearchApplicationYear}
            searchValue={applicationYearSearchValue}
            nothingFound="No options"
            dropdownPosition="bottom"
            data={[
              new Date().getFullYear().toString(),
              (new Date().getFullYear()+1).toString(),
              (new Date().getFullYear()+2).toString(),
              (new Date().getFullYear()+3).toString(),
              (new Date().getFullYear()+4).toString()
            ]}
            onChange={(query) => {
              let x: number[] = [];
              for (let i = 0; i < query.length; i++) {
                x.push(parseInt(query[i]))
              }
              setJobInfo(state => ({...state, applicant_year: x}))
            }}
          />
            <InputElement label="deadline" JobInfo={JobInfo} setJobInfo={setJobInfo} />
          <MultiSelect
            className={styles.inputContainer}
            label="tags"
            placeholder="Pick one"
            searchable
            clearable
            creatable
            onSearchChange={onSearchTag}
            getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => {
              const item = { value: query, label: query };
              setTagData((current) => [...current, item]);
              return item;
               }}
            searchValue={tagSearchValue}
            nothingFound="No options"
            data={tagData}
            onChange={(query) => {
              setJobInfo(state => ({...state, tags: query}))
            }}
          />
          <InputElement label="contactEmail" JobInfo={JobInfo} setJobInfo={setJobInfo} />
          <InputElementLong label="longDescription" JobInfo={JobInfo} setJobInfo={setJobInfo} />
          <Checkbox
            label="Save to Drafts?"
            color="dark"
            size="md"
          />
          <Button color="dark" onClick={() => {
            // 1. Check all fields are filled
            console.log(JobInfo)
            checkCompletion(JobInfo, setCompleted);
          }}>
            Create Job
          </Button>



        </div>


      </div>
      
    )
  }
  

export type InputElementProps = {
  label: string;
  JobInfo: JobInfo | {};
  setJobInfo: any;
}

export const InputElementLong = ({label, JobInfo, setJobInfo}: InputElementProps) => {
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    setJobInfo({ ...JobInfo, [label]: inputValue } as JobInfo)
    // Ignore warning, this is intentional
  }, [inputValue])

  return (
    <div className={styles.inputContainerLarge}>
      <h3 className={styles.inputText}>{label}</h3>
      <textarea rows={5}
        className={styles.inputForm} 
        id={label} 
        placeholder={label}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      ></textarea>
    </div>
  )
}


export const InputElement = ({label, JobInfo, setJobInfo}: InputElementProps) => {
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    setJobInfo({ ...JobInfo, [label]: inputValue } as JobInfo)
    // Ignore warning, this is intentional
  }, [inputValue])

  return (
    <div className={styles.inputContainer}>
      <h3 className={styles.inputText}>{label}</h3>
      <input 
        className={styles.inputForm}
        type="text" 
        id={label} 
        placeholder={label}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
    </div>
  )
}

const formatEmpData = (empData: any[]) => {
  let formatted = [];
  for (let i = 0; i < empData.length; i++) {
    formatted.push(empData[i].name)
  }
  return formatted
}


const checkCompletion = async (jobInfo: JobInfo, setCompleted: any) => {
  if (jobInfo.title && jobInfo.description && jobInfo.job_type && jobInfo.location && jobInfo.applicant_year && jobInfo.deadline && jobInfo.tags) {
    setCompleted(true)
  } else {
    setCompleted(false)
  }
}

const createTagList = (tags: any[]) => {
  let tagList = [];
  for (let i = 0; i < tags.length; i++) {
    tagList.push(tags[i].label)
  }
  return tagList
}

