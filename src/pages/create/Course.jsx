import React from "react";
import { useState } from "react";
import { collectionRef } from "../../firebaseConfig";
import { addDoc, getDocs} from "firebase/firestore";
import Wrapper from "../../components/wrapper/Wrapper";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { alert, loading } from "../../features/ui/uiSlice";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { format } from "date-fns";

const Course = () => {
  const [courseName, setCourseName] = useState("");
  const [courseTopic, setCourseTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [assignmentMarks, setAssignmentMarks] = useState(0);

  const dispatch = useDispatch();

  const ui = useSelector((state) => state.ui);
  const onCourseNameChanged = (e) => setCourseName(e.target.value);
  const onCourseTopicChanged = (e) => setCourseTopic(e.target.value);

  const addTopics = () => {
    if (!courseTopic) {
      dispatch(
        alert({
          status: "error",
          message: "All fields are required!",
          isOpen: true,
        })
      );
      return;
    }
    if (!assignmentMarks) {
      dispatch(
        alert({
          status: "error",
          message: "Please assign total marks of the assignment!",
          isOpen: true,
        })
      );
      return;
    }
    const existingTopic = topics.find((t) => t.topicName === courseTopic);
    if (existingTopic) {
      dispatch(
        alert({
          status: "error",
          message: "Topic already exist!",
          isOpen: true,
        })
      );
    } else {
      topics.push({
        topicName: courseTopic,
        documentUrl: "",
        isAssignmentUploaded: false,
        fileName: "",
        totalMarks: assignmentMarks,
        createdAt: format(new Date(), "MM/dd/yyyy"),
      });
      dispatch(
        alert({
          status: "success",
          message: "Topic added successfully!",
          isOpen: true,
        })
      );
    }
    setCourseTopic("");
    setAssignmentMarks("");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(loading(true));
    if (!courseName || topics.length === 0) {
      dispatch(
        alert({
          status: "error",
          message: "All fields are required!",
          isOpen: true,
        })
      );

      return;
    }
    getDocs(collectionRef)
      .then((res) => {
        const data = res.docs.map((item) => {
          return item.data();
        });

        const existingCourse = data.find(
          (c) => c.courseName.toLowerCase() === courseName.toLowerCase()
        );
        if (existingCourse) {
          setCourseName("");
          dispatch(
            alert({
              status: "error",
              message: "Course already exist!",
              isOpen: true,
            })
          );

          dispatch(loading(true));
          return;
        }
        addDoc(collectionRef, {
          courseName: courseName.toLowerCase(),
          topics,
        })
          .then((res) => {
            setCourseName("");
            dispatch(
              alert({
                status: "success",
                message: "New course added successfully!",
                isOpen: true,
              })
            );
            dispatch(loading(false));
            setTopics([]);
          })
          .catch((err) => {
            dispatch(
              alert({
                status: "error",
                message: "An error occured!",
                isOpen: true,
              })
            );
            setTopics([]);
          });
      })
      .catch((err) => {
        dispatch(
          alert({ status: "error", message: "An error occured!", isOpen: true })
        );
      });
  };

  return (
    <div className="page-container">
      <Sidebar />
      <Header />
      <Wrapper>
        <div>
          <h5>Create New Course</h5>
          <form className="form" onSubmit={submitHandler}>
            <div className="form-group">
              <label>Course Name</label>
              <input
                type="text"
                value={courseName}
                onChange={onCourseNameChanged}
              />
            </div>
            <div className="form-group">
              <label>Course Topics</label>
              <input
                type="text"
                value={courseTopic}
                onChange={onCourseTopicChanged}
              />
              <label>Assignment Marks</label>
              <input
                type="text"
                value={assignmentMarks}
                onChange={(e) => setAssignmentMarks(e.target.value)}
              />
              <button onClick={addTopics} type="button">
                Add Topic
              </button>
            </div>

            <button type="submit">
              {ui.isLoading ? (
                <CircularProgress size={20} sx={{ color: "#00dadb" }} />
              ) : (
                "Save"
              )}
            </button>
          </form>
        </div>
      </Wrapper>
    </div>
  );
};

export default Course;
