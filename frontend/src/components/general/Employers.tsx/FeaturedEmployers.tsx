import React from "react";
import employerData from "../../../mockData/employerData";

export default function FeaturedEmployer() {
    return (
        <div>
            <img src="" alt="" />
            <h2>Featured Employers</h2>
            <ul>
                
                {employerData.data.getEmployers.map(
                    employer => {
                        return (<li>{employer.name} -- {employer.city}, {employer.province}</li>)
                    }
                )}
            </ul>
        </div>
    )
}


const employers = employerData.data.getEmployers

// const getemployers = () => {
//     let empList = []

//     for (let emp of employers) {
//         empList.push(emp.name)
//     }
//     return empList
// }

