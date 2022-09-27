import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import Wrapper from "../../components/wrapper/Wrapper";
import { database } from "../../firebaseConfig";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import "./assignment.css";
import { getAuth } from "firebase/auth";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import StudentTable from "../../components/stats/student/StudentTable";
import { format } from "date-fns";

const StudentAssignment = () => {
  const [fileData, setFileData] = useState({});
  const { state } = useLocation();

  const { users, courses } = useSelector((state) => state.info);
  const { loggedUser } = useSelector((state) => state.auth);

  // here we are extracting only enrolled course that was assigned at the time of student creation,
  // so that we can show only that course topics

  const enrolledCourse = loggedUser.enrolledCourse.find(
    (ec) => ec.courseName === state
  );

  console.log("enrolledCourseDetails", enrolledCourse);

  const enrolledCourseDetails = [];

  enrolledCourse.assignmentDetails.forEach((ad) => {
    if (ad) {
      const {
        assignmentDownloadedDate,
        assignmentUploadedDate,
        isAssignmentDownloaded,
        isAssignmentUploaded,
        isChecked,
        receivedMarks,
        totalMarks,
        topicName,
      } = ad;
      enrolledCourseDetails.push({
        assignmentDownloadedDate,
        assignmentUploadedDate,
        isAssignmentDownloaded,
        isAssignmentUploaded,
        isChecked,
        receivedMarks,
        totalMarks,
        topicName,
      });
    }
  });

  console.log("enrolledCourseDetails", enrolledCourseDetails);

  const assignedCourse = enrolledCourse.courseName;

  const auth = getAuth();

  const findLoggedUser = users.find((s) => s?.uid === loggedUser?.uid);

  // handle download

  const handleDownload = (selectedTopic) => {
    // here we are finding matched course based on the sidebar tab click, we'll use it later

    const course = courses.find((c) => c.courseName === state);

    const topic = course.topics.find((t) => t.topicName === selectedTopic);

    getDownloadURL(ref(storage, topic.fileName))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
        };

        xhr.open("GET", url);
        xhr.send();

        let totalMarks;
        courses.forEach((c) => {
          if (c.courseName === assignedCourse) {
            c.topics.forEach((t) => {
              if (t.topicName === selectedTopic) {
                totalMarks = t.totalMarks;
                console.log("from it", t.totalMarks);
              }
            });
          }
        });
        console.log("totalMarks: " + totalMarks);

        const convertToJsObj = JSON.stringify(findLoggedUser);

        const res = JSON.parse(convertToJsObj);

        const ec = res.enrolledCourse;

        ec.forEach((item) => {
          if (item.courseName === assignedCourse) {
            item.assignmentDetails.forEach((ad) => {
              if (ad.topicName === selectedTopic) {
                ad.isAssignmentDownloaded = true;
                ad.assignmentDownloadedDate = format(new Date(), "MM/dd/yyyy");
                ad.assignmentDownloadedUrl = url;
                ad.totalMarks = totalMarks;
              }
            });
          }
        });

        const userDocRef = doc(database, "users", auth.currentUser.uid);
        updateDoc(userDocRef, {
          enrolledCourse: ec,
        })
          .then(() => {
            console.log("file downloaded");
          })
          .catch((err) => console.log(err));

        window.open(url, "_blank");
      })
      .catch((error) => {
        console.log("error from download", error);
      });
  };

  // handle upload

  const handleUpload = (selectedTopic) => {
    const storageRef = ref(storage, `uploaded-assignment/${fileData.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileData);

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
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error.message);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);

          const convertToJsObj = JSON.stringify(findLoggedUser);

          const res = JSON.parse(convertToJsObj);

          const ec = res.enrolledCourse;

          ec.forEach((item) => {
            if (item.courseName === assignedCourse) {
              item.assignmentDetails.forEach((ad) => {
                if (ad.topicName === selectedTopic) {
                  ad.isAssignmentUploaded = true;
                  ad.assignmentUploadedDate = format(new Date(), "MM/dd/yyyy");
                  ad.assignmentUploadedUrl = downloadURL;
                }
              });
            }
          });

          const userDocRef = doc(database, "users", auth.currentUser.uid);
          updateDoc(userDocRef, {
            enrolledCourse: ec,
          })
            .then(() => {
              console.log("file downloaded");
            })
            .catch((err) => console.log(err));

          // onSnapshot(topicQuery, (data) => {
          //   console.log("onSnapshot");
          //   const fetchedAssignment = data.docs.map((item) => {
          //     return item.data();
          //   });
          //   const { courseName } = fetchedAssignment[0];

          //   addDoc(uploadDocCollectionRef, {
          //     downloadURL,
          //     topic,
          //     courseName,
          //     fileName: fileData.name,
          //     uid: auth.currentUser.uid,
          //     uploadDate: format(new Date(), 'MM/DD/YYYY'),
          //     userName: currentUser[0].name,
          //   })
          //     .then((res) => console.log("course", res))
          //     .catch((err) => console.log(err));
          // });
        });
      }
    );
  };

  return (
    <>
      <Sidebar />
      <Header />
      <Wrapper>
        {courses.length === 0 && <h2>Loading...</h2>}

        {courses.length > 0 && (
          <>
            <h2>Course Name: {assignedCourse?.toUpperCase()}</h2>
            <div className="content-wrapper">
              <div className="content content-header">
                {/* <h4>Topics</h4> */}
              </div>
              {!enrolledCourseDetails && <h4>No assignment available!</h4>}
              {/* {topicWithAssignment.length > 0 &&
                topicWithAssignment.map((topic, i) => (
                  <div key={i} className="content content-topic">
                    <p className="topic">{topic.topicName}</p>
                    <div className="assignment-icons">
                      <AiOutlineDownload
                        onClick={() => handleDownload(topic.topicName)}
                        size="30"
                        className="assignment-icon"
                        title="Download"
                      />

                      <label htmlFor="fileInput">
                        <MdComputer
                          size="30"
                          className="assignment-icon"
                          title="Choose from computer"
                        />
                      </label>
                      <input
                        type="file"
                        id="fileInput"
                        onChange={(e) => setFileData(e.target.files[0])}
                        name="file"
                        style={{ display: "none" }}
                      />
                      <AiOutlineUpload
                        onClick={() => handleUpload(topic.topicName)}
                        size="30"
                        className="assignment-icon"
                        title="Upload"
                      />
                    </div>
                  </div>
                ))} */}
              {enrolledCourseDetails && (
                <StudentTable
                  showDetails={enrolledCourseDetails}
                  handleDownload={handleDownload}
                  handleUpload={handleUpload}
                  setFileData={setFileData}
                />
              )}
            </div>
          </>
        )}
      </Wrapper>
    </>
  );
};

export default StudentAssignment;
