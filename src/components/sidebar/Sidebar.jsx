import React, { useContext, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import "./sidebar.css";
import { useAppState, UserContext } from "../../context/Context";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";
import {FiChevronDown} from 'react-icons/fi'

const Sidebar = () => {
  const { courses, users } = useSelector((state) => state.info);

  const { loggedUser } = useSelector((state) => state.auth); // from here we can get enrolled course info for logged user

  const navigate = useNavigate();

  const loggedStudent = users.find((s) => s.uid === loggedUser?.uid); // from we are getting only logged user info from all students

  const showStudentAssignment = (assignment, id) => {
    const toLower = assignment.toLowerCase();
    const studentLinks = [...document.querySelectorAll('.student-link')];
    console.log("student links: " + studentLinks);
    studentLinks.forEach((link, i) => {
      if (i === id) {
        console.log("if called",i,id);
        link.classList.add('active');
      } else {
        console.log("else called");
        link.classList.remove('active');
        
      }
    });

    navigate("/home/assignment", { state: toLower });
  };

  // here we are converting the object into array so that we can use map and show  only enrolled course tab in the sidebar

  const enrolledCourse = [];
  for (const course in loggedStudent?.enrolledCourse) {
    enrolledCourse.push(loggedStudent?.enrolledCourse[course].courseName);
  }

  const assignmentTab = enrolledCourse.map((c, i) => (
    <li key={c} onClick={() => showStudentAssignment(c, i)} className="sidebar-link student-link">
      {c}
    </li>
  ));
  
  // const listItems = [...document.querySelectorAll(".sidebar-link")];

  // listItems.forEach((item, i) => {
  //   item.addEventListener("click", (e) => {
  //     console.log("e.target", e.target.classList.contains("active"));
  //     if (!e.target.classList.contains("active")) {
  //       e.target.classList.add("active");
  //     } else {
  //       e.target.classList.remove("active");
  //     }
  //   })
  //   // if (i === id) {
  //   //   item.classList.add("active");
  //   // } else {
  //   //   item.classList.remove("active");
  //   // }
  // });


 

  const showCreateDoc = (docName, i) => {
    const toLower = docName.toLowerCase();

    if (i > 2) {
      navigate("/home/create/assignment", { state: toLower });
    }
  };

  const allCoursesList = courses.map((course, i) => (
    <li
      key={i}
      onClick={() => showCreateDoc(course.courseName, i + 3)}
      className="sidebar-link sidebarList"
    >
      {course.courseName}
    </li>
  ));

  const goToHome = () => {
    navigate("/home/dashboard");
  };

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-logo-wrapper">
        <img
          className="logo"
          src={logo}
          alt="sidebar logo"
          onClick={goToHome}
        />
      </div>
      <ul className="ul sidebar-list-wrapper">
        <Link
          to="/home/dashboard"
          className="link sidebar-link active student-link"
          onClick={() => showCreateDoc("dashboard", 0)}
        >
          Dashboard
        </Link>
        {loggedUser?.role == "admin" && (
          <>
            <Link
              to="/home/create/new-course"
              className="link sidebar-link"
              onClick={() => showCreateDoc("dashboard", 1)}
            >
              New Course
            </Link>
            <Link
              to="/home/create/new-student"
              className="link sidebar-link"
              onClick={() => showCreateDoc("dashboard", 2)}
            >
              Student
            </Link>

            {allCoursesList}
          </>
        )}

        {loggedUser?.role == "student" && (
          <>
            <div className="sidebar-link">Assignments <FiChevronDown /></div>
           {assignmentTab}
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
