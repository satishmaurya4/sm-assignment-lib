import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Wrapper from "../../../components/wrapper/Wrapper";
import { database, storage } from "../../../firebaseConfig";
import "./createAssignment.css";
import { AiOutlineUpload } from "react-icons/ai";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { alert, loading, setUploading } from "../../../features/ui/uiSlice";
import Sidebar from "../../../components/sidebar/Sidebar";
import Header from "../../../components/header/Header";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { MdComputer } from "react-icons/md";

import { TiTick } from "react-icons/ti";
import FileInput from "./FileInput";
import { format } from "date-fns";
import Uploading from "../../../features/ui/uploading/Uploading";
import { getCourses } from "../../../features/info/infoSlice";

const CreateAssignment = () => {
  // const [data, setData] = useState({});
  const [editForm, setEditForm] = useState(false);
  const [topic, setTopic] = useState("");
  const [assignmentMark, setAssignmentMark] = useState("");
  const [matchedCourse, setMatchedCourse] = useState({});
  const [file, setFile] = useState({
    fileInfo: null,
    selectedTopic: "",
  });
  const { state } = useLocation();
  const dispatch = useDispatch();
  const ui = useSelector((state) => state.ui);
  const { courses } = useSelector((state) => state.info);

  console.log("courses", courses);

  // here getting spcific course based on the sidebar tab click value that is state ,
  // useNavigate hook takes as second argument {state: ""} and value can be retrieved from the useLocation hook
  // we are doing this so that we can show only spcific course data in this component
  console.log("state", state);
  // const matchedCourse = courses?.find((c) => c.courseName === state);

  // we will be using later on
  // const { courseName, topics, uid } = matchedCourse;
  const submitFile = (selectedTopic) => {
    const selectedCourse = courses.find((c) => c.courseName === state);

    const matchedTopic = selectedCourse.topics.find(
      (t) => t.topicName === selectedTopic
    );

    let isFileExist = matchedTopic.fileName;

    console.log("****", matchedTopic, isFileExist);

    if (!isFileExist) {
      dispatch(
        alert({
          status: "error",
          message: "Please choose assignment first!",
          isOpen: true,
        })
      );
      return;
    }
    const storageRef = ref(storage, isFileExist);
    const uploadTask = uploadBytesResumable(storageRef, file.fileInfo);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        // switch (snapshot.state) {
        //   case 'paused':
        //     console.log('Upload is paused');
        //     break;
        //   case 'running':
        //     console.log('Upload is running');
        //     break;
        // }
        dispatch(setUploading(true));
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error.message);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);

          // const findUploadedAssignment = matchedCourse?.topics.find(
          //   (t) => t.topicName === selectedTopic
          // );

          // if (findUploadedAssignment.isAssignmentUploaded) {
          //   dispatch(
          //     alert({
          //       status: "error",
          //       message: "File is already uploaded!",
          //       isOpen: true,
          //     })
          //   );
          // }

          const updatedDoc = selectedCourse?.topics.map((topic) => {
            if (topic.topicName === selectedTopic) {
              return {
                ...topic,
                isAssignmentUploaded: true,
                documentUrl: downloadURL,
                fileName: isFileExist,
              };
            }
            return topic;
          });

          const courseRef = doc(database, "courses", matchedCourse?.uid);
          updateDoc(courseRef, {
            topics: updatedDoc,
          })
            .then(() => {
              dispatch(
                alert({
                  status: "success",
                  message: "Assignment uploaded successfully!",
                  isOpen: true,
                })
              );
              dispatch(setUploading(false));
              setFile({
                fileInfo: null,
                selectedTopic: "",
              });
            })
            .catch((err) => console.log(err));
        });
      }
    );
  };

  const editHandler = (e) => {
    e.preventDefault();
    dispatch(loading(true));
    if (!assignmentMark || !topic) {
      dispatch(
        alert({
          status: "error",
          message: "All fields are required!",
          isOpen: true,
        })
      );

      return;
    }

    const existingTopic = matchedCourse?.topics.find(
      (t) => t.topicName === topic
    );
    if (existingTopic) {
      dispatch(
        alert({
          status: "error",
          message: "Topic already exist!",
          isOpen: true,
        })
      );
    } else {
      const newTopicData = {
        createdAt: format(new Date(), "MM/dd/yyyy"),
        documentUrl: "",
        fileName: "",
        isAssignmentUploaded: false,
        topicName: topic,
        totalMarks: assignmentMark,
      };
      const courseRef = doc(database, "courses", matchedCourse?.uid);
      updateDoc(courseRef, {
        topics: [...matchedCourse?.topics, newTopicData],
      })
        .then(() => {
          dispatch(
            alert({
              status: "success",
              message: "Topic added successfully!",
              isOpen: true,
            })
          );
          dispatch(loading(false));
          setEditForm(false);
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteHandler = (topic) => {
    const filteredTopics = matchedCourse?.topics.filter(
      (t) => t.topicName !== topic
    );
    const courseRef = doc(database, "courses", matchedCourse?.uid);
    updateDoc(courseRef, {
      topics: filteredTopics,
    })
      .then(() => {
        dispatch(
          alert({
            status: "success",
            message: "Topic deleted successfully!",
            isOpen: true,
          })
        );
        dispatch(loading(false));
        setEditForm(false);
      })
      .catch((err) => console.log(err));
  };

  let data;
  const getFile = (fileName) => {
    console.log("fileName: " + fileName);
    data = fileName;
  };

  const handleFileChange = (event, index, selectedTopic) => {
    // setFile(e.target.files[0]);
    const fileObj = JSON.stringify(event.target.files);

    // courses.forEach((c) => {
    //   if (c.courseName === state) {
    //     console.log("courseName: " + c.courseName);
    //     c.topics.forEach((t) => {
    //       if (t.topicName === selectedTopic) {
    //         t.isAssignmentUploaded = true;
    //         t.fileName = e.target.files[0];
    //       }
    //     });
    //   }
    // });

    const updatedDoc = courses.map((c) => {
      if (c.courseName === state) {
        const updatedTopic = c.topics.map((t) => {
          if (t.topicName === selectedTopic) {
            return {
              ...t,
              isAssignmentUploaded: true,
              fileName: event.target.files[0],
            };
          }
          return t;
        });
        return {
          ...c,
          topics: updatedTopic,
        };
      }
      return c;
    });

    console.log(
      "updated doc: " + event.target,
      fileObj,
      JSON.stringify(updatedDoc)
    );

    // const matchedCourse = courses.find(c => c.courseName === state);

    // const newState = [...courses];
    // newState[index] = {
    //   ...newState[index],
    //   isAssignmentUploaded: true,
    //   fileName: e.target.files[0],
    // };

    // console.log("new index", newState[index]);

    // setFile(e.target.files[0]);
    // getCourses(newState);
    // const modified = JSON.stringify(newState);

    console.log("new state: " + courses);
  };

  const obj = {
    name: "satish",
    age: 18,
  };

  console.log("temp obj", obj);
  console.log("temp obj" + JSON.stringify(obj));

  const fileInfo = file.fileInfo;
  console.log("***", fileInfo);

  useEffect(() => {
    // console.log("file info: ", file.fileInfo);
    // console.log("file", file.fileInfo);

    if (file.fileInfo) {
      // console.log("file info: ", file.fileInfo);
      dispatch(
        alert({
          status: "success",
          message: `You have selected ${file.fileInfo.name} file!`,
          isOpen: true,
        })
      );
      const updatedDoc = courses.map((c) => {
        if (c.courseName === state) {
          const updatedTopic = c.topics.map((t) => {
            if (t.topicName === file.selectedTopic) {
              // console.log("file info: ", file.fileInfo.name);

              return {
                ...t,
                fileName: file.fileInfo.name,
              };
            }
            return t;
          });
          return {
            ...c,
            topics: updatedTopic,
          };
        }
        return c;
      });

      console.log("updated doc: ", JSON.stringify(updatedDoc));
      dispatch(getCourses(updatedDoc));
    }
  }, [file.fileInfo]);

  useEffect(() => {
    if (!state) {
      setMatchedCourse(courses[0]);
      console.log("create assignment useEffect", courses);
    } else {
      const tempData = courses?.find((c) => c.courseName === state);
      setMatchedCourse(tempData);
    }
    console.log("create assignment useEffect");
  }, [state, courses]);

  console.log(file);

  return (
    <div className="page-container">
      <Sidebar />
      <Header />
      {ui.isUploading && <Uploading />}
      <Wrapper>
        <div className="edit-course" onClick={() => setEditForm(!editForm)}>
          <FiEdit />
        </div>
        <div>
          {matchedCourse?.topics?.length === 0 && <h2>Loading...</h2>}
          {matchedCourse?.topics?.length > 0 && (
            <>
              <h2 classname="assignment-title">
                Course Name:{" "}
                <span
                  style={{ textTransform: "capitalize", marginLeft: "5px" }}
                >
                  {matchedCourse?.courseName}
                </span>
              </h2>
              <div className="content-wrapper">
                <div className="content content-header">
                  <p>Assignments</p>
                </div>
                {matchedCourse?.topics.map((topic, i) => (
                  <div key={i} className="content content-topic">
                    <p className="assignment-topic">{topic.topicName}</p>
                    <div className="assignment-icons">
                      {topic.isAssignmentUploaded ? (
                        <TiTick color="lime" size="30" />
                      ) : (
                        <>
                          <label
                            htmlFor="fileInput"
                            className="assignment-icon"
                            title="Choose file"
                          >
                            <MdComputer color="#fff" size="30" />
                          </label>
                          <input
                            type="file"
                            id="fileInput"
                            onChange={(e) =>
                              setFile({
                                fileInfo: e.target.files[0],
                                selectedTopic: topic.topicName,
                              })
                            }
                            style={{ display: "none" }}
                          />
                        </>
                      )}

                      {topic.isAssignmentUploaded ? (
                        <TiTick color="lime" size="30" />
                      ) : (
                        <AiOutlineUpload
                          onClick={() =>
                            submitFile(
                              topic.topicName,
                              matchedCourse?.courseName
                            )
                          }
                          size="30"
                          className="assignment-icon"
                          title="Upload"
                        />
                      )}

                      <AiFillDelete
                        onClick={() => deleteHandler(topic.topicName)}
                        size="30"
                        className="assignment-icon"
                        title="Delete topic"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {editForm && (
          <form onSubmit={editHandler} className="create-assignmnet-form">
            <div className="form-group">
              <label>Enter Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Assignment Mark</label>
              <input
                type="text"
                value={assignmentMark}
                onChange={(e) => setAssignmentMark(e.target.value)}
              />
            </div>
            <button type="submit" className="btn">
              Submit
            </button>
          </form>
        )}
      </Wrapper>
    </div>
  );
};

export default CreateAssignment;
