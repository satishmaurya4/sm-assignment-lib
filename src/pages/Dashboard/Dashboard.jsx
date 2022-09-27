import React from "react";
import Wrapper from "../../components/wrapper/Wrapper";
import Widgets from "../../components/widgets/Widgets";
import "./dashboard.css";
import { useSelector } from "react-redux";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import AdminStudentTable from "../../components/stats/admin/AdminStudentTable";
import AdminCourseTable from "../../components/stats/admin/AdminCourseTable";
import StudentDashboardTable from "../../components/stats/student/StudentDashboardTable";
import CircularProgress from "@mui/material/CircularProgress";

const Dashboard = () => {
  const { loggedUser } = useSelector((state) => state.auth);
  const { users, courses } = useSelector((state) => state.info);
  const { isContentLoading } = useSelector((state) => state.ui);

  const students = users.map((user) => user.role === "student");

  return (
    <div className="page-container">
      <Sidebar />
      <Header />
      <Wrapper>
        <div>
          <h4>Dashboard</h4>
          <div className="widgets-container">
            {loggedUser?.role === "admin" && (
              <>
                {users.length !== 0 && courses.length !== 0 ? (
                  <>
                    <Widgets type="all students" />
                    <Widgets type="all courses" />
                    <Widgets type="created assignments" />
                    <Widgets type="uploaded assignments" />
                  </>
                ) : null}
              </>
            )}
          </div>
          {isContentLoading ? (
            <CircularProgress />
          ) : loggedUser?.role === "admin" ? (
            <>
              {students.length !== 0 ? (
                <AdminStudentTable />
              ) : (
                <h4 style={{ marginBottom: "10px" }}>No student found.</h4>
              )}

              {courses.length !== 0 ? (
                <AdminCourseTable />
              ) : (
                <h4 style={{ marginBottom: "10px" }}>No course found.</h4>
              )}
            </>
          ) : (
             <StudentDashboardTable />
          )}

{/* loggedUser?.role === "student" && */}
        </div>
      </Wrapper>
    </div>
  );
};

export default Dashboard;
