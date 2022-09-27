  import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import Wrapper from "../../components/wrapper/Wrapper";
import { alert } from "../../features/ui/uiSlice";
import { database } from "../../firebaseConfig";
import "./studentDetails.css";
import { FiChevronDown,FiChevronUp } from "react-icons/fi";


import AdminSingleStudentTable from "../../components/stats/admin/AdminSingleStudentTable";

const AdminStudentDetails = () => {
  const [showOption, setShowOption] = useState(false);
  const [showAssignedOption, setShowAssignedOption] = useState(false);
  const [singleStudentData, setSingleStudentData] = useState("");
  const [assignCourse, setAssignCourse] = useState("");
  const [assignedCourse, setAssignedCourse] = useState("");
  const { id } = useParams();

  const { users, courses } = useSelector((state) => state.info);
  const dispatch = useDispatch();

  const findStudents = users.filter((u) => u.role === "student");
  console.log("findStudents", findStudents);
  const studentDetails = findStudents.find((s) => s.uid === id);

  console.log("studentDetails", studentDetails);

  const { name, email, contactNo, createdAt, enrolledCourse } = studentDetails;
  console.log(courses);

  const handleAssignCourse = (courseName) => {
    const existingCourse = enrolledCourse.find(
      (ec) => ec.courseName === courseName
    );

    if (existingCourse) {
      setAssignCourse("Assign New Course");
      dispatch(
        alert({
          status: "error",
          message: "This course is already assigned!",
          isOpen: true,
        })
      );
      return;
    }

    setAssignCourse(courseName);
    const matchedCourse = courses.find(
      (course) => course.courseName === courseName
    );
    console.log("****", matchedCourse);
    const assignmentDetails = matchedCourse.topics.map((topic) => {
      return {
        isAssignmentDownloaded: false,
        isAssignmentUploaded: false,
        assignmentDownloadedUrl: "",
        assignmentUploadedUrl: "",
        assignmentDownloadedDate: "",
        assignmentUploadedDate: "",
        topicName: topic.topicName,
        documentUrl: topic.documentUrl,
        totalMarks: "",
        receivedMarks: "",
        isChecked: false,
        remarks: ""
      };
    });

    const userDocRef = doc(database, "users", id);
    updateDoc(userDocRef, {
      enrolledCourse: [...enrolledCourse, { assignmentDetails, courseName }],
    })
      .then(() => {
        dispatch(
          alert({
            status: "success",
            message: "New course assigned successfully!",
            isOpen: true,
          })
        );
      })
      .catch((err) => console.log(err));
    setShowOption(false);
  };

  const handleAssignedCourse = (courseName) => {
    const matchedCourse = enrolledCourse.find(
      (ec) => ec.courseName.toLowerCase() === courseName.toLowerCase()
    );
    // const matchedCourseDetails = matchedCourse.assignmentDetails.map(c => {
    //   // const { assignmentDownloadedDate, assignmentUploadedDate, isAssignmentDownloaded, isAssignmentUploaded, topicName, totalMarks } = c;
    //   return {...c}

    // })
    // console.log("matchedCourse", matchedCourse.assignmentDetails);
    setAssignedCourse(matchedCourse.courseName)
    setSingleStudentData(matchedCourse.assignmentDetails);

    setShowAssignedOption(false);
  };

  console.log("singleStudentData", singleStudentData);

  const assignOptions = courses.map((c) => (
    <p onClick={() => handleAssignCourse(c.courseName)}>{c.courseName}</p>
  ));
  const assignedOptions = enrolledCourse.map((ec) => (
    <p onClick={() => handleAssignedCourse(ec.courseName)}>{ec.courseName}</p>
  ));

  console.log("single student data", singleStudentData)

  return (
    <>
      <Sidebar />
      <Header />
      <Wrapper>
        <div>
          <div className="assign-new-course-header">
            <h4>See Student Details</h4>
            <div className="assign-new-course-select">
              <p
                className="assign-new-course-select-header"
                onClick={() => courses.length !== 0 && setShowOption(!showOption)}
              >
                <span  style={{textTransform: 'capitalize'}}>{assignCourse ? assignCourse : 'Assign New Course'}</span>
                {showOption ? <FiChevronUp /> : <FiChevronDown />}
              </p>
              {showOption && (
                <div className="assign-new-course-option">{assignOptions}</div>
              )}
            </div>
          </div>
          <div className="student-detail-card">
            <p>
              <span>Name:</span>
              <span style={{textTransform: 'uppercase'}}>{name}</span>
            </p>
            <p>
              <span>Email:</span>
              <span>{email}</span>
            </p>
            <p>
              <span>Contact No:</span>
              <span>{contactNo}</span>
            </p>
            <p>
              <span>Registered At:</span>
              <span>{createdAt}</span>
            </p>
          </div>

          <div className="assign-new-course-select">
            <p
              className="assign-new-course-select-header"
              onClick={() => setShowAssignedOption(!showAssignedOption)}
            >
              <span style={{textTransform: 'capitalize'}}>{assignedCourse ? assignedCourse : 'Select Assigned Course'}</span>
              {showAssignedOption ? <FiChevronUp /> : <FiChevronDown />}
            </p>
            {showAssignedOption && (
              <div className="assign-new-course-option">{assignedOptions}</div>
            )}
          </div>
          {singleStudentData && (
            <AdminSingleStudentTable assignedCourse={assignedCourse}  singleStudentData={singleStudentData} />
          )}
        </div>
      </Wrapper>
    </>
  );
};

export default AdminStudentDetails;
