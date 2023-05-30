import { gql } from '@apollo/client'


export const ADD_TO_FAVORITES = gql`
    mutation AddToFavourites($scholarId: ID!, $jobId: ID!) {
        addToFavourites(scholar_id: $scholarId, job_id: $jobId)
    }
`

export const REMOVE_FROM_FAVORITES = gql`
    mutation RemoveFromFavourites($scholarId: ID!, $jobId: ID!) {
        removeFromFavourites(scholar_id: $scholarId, job_id: $jobId)
    }
`


export const CREATE_JOB = gql`
    mutation CreateJob($employerId: ID!, $adminId: ID!, $title: String!, $description: String!, $employerIndustries: String!, $categories: String!, $jobType: String!, $term: String!, $location: String!, $applicantYear: [Int!]!, $deadline: String!, $tags: [String!]!, $live: Boolean!, $link: String!, $longDescription: String, $requirements: String, $experience: String, $education: String, $howToApply: String, $additionalInfo: String, $contactEmail: String, $jobFunction: String!) {
        createJob(employer_id: $employerId, admin_id: $adminId, title: $title, description: $description, employer_industries: $employerIndustries, categories: $categories, job_type: $jobType, term: $term, location: $location, applicant_year: $applicantYear, deadline: $deadline, tags: $tags, live: $live, link: $link, long_description: $longDescription, requirements: $requirements, experience: $experience, education: $education, how_to_apply: $howToApply, additional_info: $additionalInfo, contact_email: $contactEmail, job_function: $jobFunction)
    }
`

export const CREATE_JOB_NO_CONTACT_EMAIL = gql`
    mutation CreateJob($employerId: ID!, $adminId: ID!, $title: String!, $description: String!, $employerIndustries: String!, $jobFunction: String!, $categories: String!, $jobType: String!, $term: String!, $location: String!, $applicantYear: [Int!]!, $deadline: String!, $tags: [String!]!, $live: Boolean!, $link: String!, $longDescription: String, $requirements: String, $education: String, $experience: String, $howToApply: String, $additionalInfo: String) {
        createJob(employer_id: $employerId, admin_id: $adminId, title: $title, description: $description, employer_industries: $employerIndustries, job_function: $jobFunction, categories: $categories, job_type: $jobType, term: $term, location: $location, applicant_year: $applicantYear, deadline: $deadline, tags: $tags, live: $live, link: $link, long_description: $longDescription, requirements: $requirements, education: $education, experience: $experience, how_to_apply: $howToApply, additional_info: $additionalInfo)
    }
`

export const ARCHIVE_JOB = gql`
    mutation CreateJob($jobId: ID!) {
        archiveJob(job_id: $jobId)
    }
`

export const DELETE_JOB = gql`
    mutation DeleteJob($jobId: ID!) {
        deleteJob(job_id: $jobId)
    }
`

export const ADD_TO_FEATURED = gql`
    mutation AddToFeatured($jobIds: [ID!]!) {
        addToFeatured(job_ids: $jobIds)
    }
`

export const REMOVE_FROM_FEATURED = gql`
    mutation RemoveFromFeatured($jobId: ID!) {
        removeFromFeatured(job_id: $jobId)
    }
`

export const SetLive = gql`
    mutation SetLive($jobId: ID!) {
        setLive(job_id: $jobId)
    }
`

export const MakePrivate = gql`
    mutation MakePrivate($jobId: ID!) {
        makePrivate(job_id: $jobId)
    }
`

//@todo: This is not yet implemented in the backend
//@warn: Do not use this mutation until it is implemented
// export const INCREMENT_VIEWS = gql`
//     mutation IncrementViews($jobId: ID!) {
//         incrementViews(job_id: $jobId)
//     }
// `

export const BATCH_CREATE_JOBS = gql`
    mutation BatchCreateJobs($adminId: ID!, $jobs: [BatchJob!]!) {
        batchCreateJobs(admin_id: $adminId, jobs: $jobs)
    }
`

