import React from "react";
import { useState } from "react";
import { database } from "../../firebaseConfig";
import Wrapper from "../../components/wrapper/Wrapper";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { alert } from "../../features/ui/uiSlice";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import "./create.css";
import { format } from "date-fns";
import { useRef } from "react";

const Student = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [password, setPassword] = useState("");
  const [assignCourse, setAssignCourse] = useState("");
  const [openOptions, setOpenOptions] = useState(false);

  const spanRef = useRef();


  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.info);
  console.log("courses", courses);

  // enroll course

  const handleOptions = (courseName) => {
    setAssignCourse(courseName);
    setOpenOptions(false);
  };

  const courseOptions = courses.map((c) => (
    <li
      key={c.courseName}
      className="dropdown-list-item"
      onClick={() => handleOptions(c.courseName)}
    >
      {c.courseName}
    </li>
  ));

  const onNameChanged = (e) => setName(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onContactNoChanged = (e) => setContactNo(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !contactNo || !password || !assignCourse) {
      dispatch(
        alert({
          status: "error",
          message: "All fields are required!",
          isOpen: true,
        })
      );
      return;
    }
    try {
      const auth = getAuth();
      console.log("auth", auth);

      // new student will be added in the authentication database

      await createUserWithEmailAndPassword(auth, email, password);

      // here we are extracting only assigned course from all courses at the time of new student creation
      // get the array of object

      const matchedCourse = courses.find(
        (course) => course.courseName === assignCourse
      );
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
            totalMarks: topic.totalMarks,
            receivedMarks: "",
            isChecked: false,
            remarks: "",
          };
      });

      try {
        await setDoc(doc(database, "users", auth.currentUser.uid), {
          uid: auth.currentUser.uid,
          name,
          email,
          contactNo,
          password,
          active: true,
          role: "student",
          enrolledCourse: [
            {
              courseName: assignCourse,
              assignmentDetails,
            },
          ],
          profilePic: "",
          createdAt: format(new Date(), 'MM/dd/yyyy')
        });
        setName("");
        setEmail("");
        setContactNo("");
        setPassword("");
        dispatch(
          alert({
            status: "success",
            message: "New Student added successfully!!",
            isOpen: true,
          })
        );
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      dispatch(
        alert({
          status: "error",
          message: "Email is already in use!",
          isOpen: true,
        })
      );

      setName("");
      setEmail("");
      setContactNo("");
      setPassword("");
    }
  };

  // useEffect(() => {
  //   if (courses.length === 0) {
  //     setOpenOptions(false);
  //   }
  // },[courses])


  console.log("openOptions", openOptions)

  return (
    <div className="page-container">
      <Sidebar />
      <Header />

      <Wrapper>
        <div>
          <h5>Create New Student</h5>
          <form className="form student-form" onSubmit={submitHandler}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={name} onChange={onNameChanged} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="text" value={email} onChange={onEmailChanged} />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                value={contactNo}
                onChange={onContactNoChanged}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="text"
                value={password}
                onChange={onPasswordChanged}
              />
            </div>
            <div
              className="dropdown"
              onClick={() =>
                courses.length !== 0 && setOpenOptions(!openOptions)
              }
              ref={spanRef}
            >
              <span>{assignCourse ? assignCourse : "Assign Course"}</span>
              {openOptions ? <FiChevronUp  /> : <FiChevronDown />}
            </div>
            {openOptions && (
              <ul className="ul dropdown-list">{courseOptions}</ul>
            )}

            <button type="submit">Save</button>
          </form>
        </div>
      </Wrapper>
    </div>
  );
};

export default Student;
