import { Routes, Route, useLocation } from "react-router-dom";
import Auth from "./features/auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import Course from "./pages/create/Course";
import Student from "./pages/create/Student";
import StudentAssignment from "./pages/assignment/StudentAssignment";
import { currentTime } from "./utils/currentTime";
import Alert from "./features/ui/Alert";
import CreateAssignment from "./pages/assignment/create-assignment/CreateAssignment";
import { useDispatch, useSelector } from "react-redux";
import {
  alert,
  loading,
  setIsContentLoading,
  setUploading,
} from "./features/ui/uiSlice";
import { getCourses, getUsers } from "./features/info/infoSlice";
import RequireAuth from "./components/RequireAuth";
import PageNotFound from "./pages/404/PageNotFound";
import Unauthorized from "./pages/unauthorized/Unauthorized";
import { useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import { collectionRef, userCollectionRef } from "./firebaseConfig";
import AdminCourseDetails from "./components/stats/admin/AdminCourseDetails";
import AdminStudentDetails from "./pages/studentsDetails/AdminStudentDetails";
import Layout from "./components/Layout";

const ROLES = {
  admin: "admin",
  student: "student",
};

function App() {
  const { pathname } = useLocation();

  console.log("pathname: " + pathname);

  const dispatch = useDispatch();
  const ui = useSelector((state) => state.ui);
  const { users, courses } = useSelector((state) => state.info);
  const { loggedUser } = useSelector((state) => state.auth);

  console.log("students", users);
  console.log("courses", courses);
  console.log("loggedUser", loggedUser);

  useEffect(() => {
    currentTime();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(alert({ status: "", message: "", isOpen: false }));
    }, 3000);

    return () => {
      clearTimeout(id);
    };
  }, [ui.alertInfo.isOpen]);

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(loading(false));
    }, 3000);
    return () => {
      clearTimeout(id);
    };
  }, [ui.isLoading]);

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(setUploading(false));
    }, 3000);
    return () => {
      clearTimeout(id);
    };
  }, [ui.isUploading]);

  useEffect(() => {
    onSnapshot(collectionRef, (data) => {
      dispatch(
        getCourses(
          data.docs.map((item) => {
            return { ...item.data(), uid: item.id };
          })
        )
      );
      dispatch(setIsContentLoading(false));
    });
    onSnapshot(userCollectionRef, (data) => {
      dispatch(
        getUsers(
          data.docs.map((item) => {
            return item.data();
          })
        )
      );
      dispatch(setIsContentLoading(false));
    });
    console.log("snapsoht");
  }, []);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (data) => {
  //     if (data) {
  //       const uidQuery = query(
  //         userCollectionRef,
  //         where("uid", "==", auth.currentUser.uid)
  //       );

  //       onSnapshot(uidQuery, (data) => {
  //         const loggedUser = data.docs.map((item) => {
  //           return item.data();
  //         });
  //         dispatch(loading(false));
  //         dispatch(
  //           alert({
  //             status: "success",
  //             message: "Logged in successfully!",
  //             isOpen: true,
  //           })
  //           );
  //         dispatch(setUser({ ...loggedUser[0] }));
  //         localStorage.setItem("user", JSON.stringify({ ...loggedUser[0] }));
  //           navigate("home/dashboard");
  //       });
  //       console.log("logged in successfully");
  //     } else {
  //       dispatch(getLoggedUser(null));
  //       console.log("logged out successfully");
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //   }

  // }, []);

  // useEffect(() => {
  //   if (loggedUser) {
  //     navigate("/home/dashboard");

  //   } else {
  //     navigate("/");
  //   }
  // },[loggedUser])

  // if (users.length === 0 || courses.length === 0) {
  //   console.log("no values")
  //   navigate("/");
  //   return;
  // }

  return (
    <>
      {ui.alertInfo.isOpen && <Alert />}

      <Routes>
        {/* <Route path="/home/dashboard" exact element={<Dashboard />} />
            <Route path="/home/create/new-student" exact element={<Student />} />
            <Route path="/home/create/new-course" exact element={<Course />} />
            <Route
              path="/home/create/assignment"
              exact
              element={<CreateAssignment />}
            />
            <Route path="/home/assignment" exact element={<StudentAssignment />} />
            <Route path="/home/students/details/:id" element={users.length !== 0 && courses.length !==0 ?<AdminStudentDetails />:null} />
            <Route path = "/home/courses/details/:id" element={<AdminCourseDetails />} /> */}

        {/* <Route element={<RequireAuth allowedRoles={[ROLES.admin]} />}>
          <Route path="/home/dashboard" exact element={<Dashboard />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.admin]} />}>
          <Route path="/home/create/new-student" exact element={<Student />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.admin]} />}>
          <Route path="/home/create/new-course" exact element={<Course />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.admin]} />}>
          <Route
            path="/home/create/assignment"
            exact
            element={<CreateAssignment />}
          />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.student]} />}>
          <Route path="/home/dashboard" exact element={<Dashboard />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.student]} />}>
          <Route path="/home/assignment" exact element={<StudentAssignment />} />
        </Route>

  <Route path="/unauthorized" element={<Unauthorized />} />
<Route path="/*" element={<PageNotFound />} /> */}

        <Route path="/" element={<Layout />}>
          {/*public routes */}
          <Route index element={<Auth />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* protected routes */}

          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.admin, ROLES.student]} />
            }
          >
            <Route path="home/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.admin]} />}>
            <Route
              path="home/create/assignment"
              element={<CreateAssignment />}
            />
            <Route path="home/create/new-course" element={<Course />} />
            <Route path="home/create/new-student" element={<Student />} />
            <Route
              path="home/courses/details/:id"
              element={<AdminCourseDetails />}
            />
            <Route
              path="home/students/details/:id"
              element={
                users.length !== 0 && courses.length !== 0 ? (
                  <AdminStudentDetails />
                ) : null
              }
            />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.student]} />}>
          {/* <Route path="home/dashboard" element={<Dashboard />} /> */}
          <Route path="home/assignment" element={<StudentAssignment />} />
        </Route>

        {/* catch all */}
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
