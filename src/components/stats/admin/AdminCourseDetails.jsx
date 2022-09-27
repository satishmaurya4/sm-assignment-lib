import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Header from '../../header/Header'
import Sidebar from '../../sidebar/Sidebar'
import Wrapper from '../../wrapper/Wrapper'
import AdminSingleCourseTable from './AdminSingleCourseTable'

const AdminCourseDetails = () => {
  const { courses } = useSelector(state => state.info);
  const { id } = useParams();

  const matchedCourse = courses.find(c => c.uid === id);

  console.log("matchedCourse", matchedCourse);
  const matchedCourseDetails = [];
   matchedCourse?.topics.forEach(c => {
   
       matchedCourseDetails.push(c);

  })
  console.log("matchedCourseDetails", matchedCourseDetails);
  
  return (
    <>
      <Sidebar />
      <Header />
      <Wrapper>
        <h5>See course details : {matchedCourse?.courseName?.toUpperCase()}</h5>
        <AdminSingleCourseTable matchedCourseDetails={matchedCourseDetails} />
      </Wrapper>
    </>
  )
}

export default AdminCourseDetails