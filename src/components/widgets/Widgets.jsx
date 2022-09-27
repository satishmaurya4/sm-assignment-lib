import React from "react";
import { ImUsers } from "react-icons/im";
import { MdOutlineGolfCourse } from "react-icons/md";
import { MdCreate } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import "./widgets.css";
import { useSelector } from "react-redux";

const Widgets = ({ type }) => {
  const { users, courses } = useSelector((state) => state.info);

  // here we are getting only students count not other user like admin
  const students = users.filter(u => u.role === 'student');



  // firstly looping throgh all courses and getting topics property which is an array with all topics
  // with filter getting that topic which has isAssignmentUploaded set to true
  // getting length of the array so that we can count number of created assignments

  const uploadedAssignments = courses.map(c => {
    return c.topics.filter(t => t.isAssignmentUploaded === true).length;
  })

  let uAInitValue = 0;

  const uACount = uploadedAssignments.reduce((prev, curr) => prev + curr, uAInitValue);

  const createdAssignments = courses.map(c => c.topics.length);
  let cAInitValue = 0;

  const cACount = createdAssignments.reduce((prev, curr) => prev + curr, cAInitValue);


  let data;
  if (type === "all students") {
    data = {
      title: "All students",
      counts: students.length,
      icons: <ImUsers size="30" color="orange" />,
    };
  } else if (type === "all courses") {
    data = {
      title: "All courses",
      counts: courses.length,
      icons: <MdOutlineGolfCourse size="30" color="lime" />,
    };
  }
  else if (type === "created assignments") {
    data = {
      title: "created assignments",
      counts: cACount,
      icons: <MdCreate size="30" color="pink" />,
    };
  }
  else if (type === "uploaded assignments") {
    data = {
      title: "uploaded assignments",
      counts: uACount,
      icons: <FaFileUpload size="30" color="yellow" />,
    };
  } 
  

  return (
    <div className="widget-card">
      <p className="widget-count">{data.counts}</p>
      <div className="widget-footer">
        <span className="widget-title">{data.title}</span>
        {data.icons}
      </div>
    </div>
  );
};

export default Widgets;
