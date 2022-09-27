import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { doc, deleteDoc } from "firebase/firestore";
import { database } from "../../../firebaseConfig";
import DeleteDialouge from "../../../features/ui/DeleteDialouge";
import { handleDD } from "../../../features/ui/uiSlice";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "courseName",
    numeric: false,
    disablePadding: true,
    label: "Course",
  },
  {
    id: "assignmentCount",
    numeric: true,
    disablePadding: false,
    label: "Assignment",
  },

  {
    id: "uploadedAssignmentsCount",
    numeric: true,
    disablePadding: false,
    label: "Uploaded Assignments",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts"
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => {
          console.log(headCell);
          return (
            <TableCell
              key={headCell.id}
              // align={headCell.numeric ? "right" : "left"}
              // padding={headCell.disablePadding ? "none" : "normal"}
              align="left"
              padding="normal"
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Courses Record
        </Typography>
      )}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function AdminCourseTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [deleteCourse, setDeleteCourse] = React.useState('');
  const [deleteCourseId, setDeleteCourseId] = React.useState('');
  const { users, courses } = useSelector((state) => state.info);
  const { isDeleteDialougeOpen, isDelete } = useSelector(state => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToCourseDetails = (id) => {
    navigate(`/home/courses/details/${id}`);
  };
  console.log("courses", courses);
  console.log("users", users);

  const students = users.filter(u => u.role === 'student');

  // const updatedObj = [];

  console.log(JSON.stringify(students));
  console.log("students", students);

  students.forEach((a => {
    console.log(Object.isFrozen(a));
  }))

//  students.forEach(function (o) {
//      o.enrolledCourse = o.enrolledCourse.filter((s) => s.courseName !== "esi");
//   });
  
const arr = [
  {
    uid: 1,
    enrolledCourse: [
      {
        courseName: "esi",
        assignmentDetails: [1, 2, 3]
      },
      {
        courseName: "es",
        assignmentDetails: [1, 2, 3]
      }
    ]
  },
  {
    uid: 4,
    enrolledCourse: [
      {
        courseName: "es",
        assignmentDetails: [1, 2, 3]
      }
    ]
  },
  {
    uid: 2,
    enrolledCourse: [
      {
        courseName: "esi",
        assignmentDetails: [1, 2, 3]
      }
    ]
  },
  {
    uid: 3,
    enrolledCourse: [
      {
        courseName: "epf",
        assignmentDetails: [1, 2, 3]
      }
    ]
  }
];

// var id = prompt("Id of subbrands to remove: ");
  
  // console.log("arr", arr);
  
arr.forEach(function (o) {
  o.enrolledCourse = o.enrolledCourse.filter((s) => s.courseName != "esi");
});
  
arr.forEach((a => {
  console.log(Object.isExtensible(a.enrolledCourse));
}))

// console.log(arr);
  
  
  
  


  // console.log("updated students", students);

  let coursesData = courses.map((c) => {
    const id = c.uid;
    const courseName = c.courseName;
    let assignmentCount = 0;
    c.topics.forEach((t) => {
      if (t.topicName) {
        assignmentCount += 1;
      }
    });
    let uploadedAssignmentsCount = 0;
    c.topics.forEach((t) => {
      if (t.isAssignmentUploaded) {
        uploadedAssignmentsCount += 1;
      }
    });
    let createdAt;
    return {
      courseName,
      assignmentCount,
      uploadedAssignmentsCount,
      createdAt,
      id,
    };
  });

  console.log("courses", coursesData);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = coursesData.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    // const selectedIndex = selected.indexOf(name);
    // let newSelected = [];

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, name);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1));
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1)
    //   );
    // }

    // setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - coursesData.length) : 0;

  // handle course delete

  const handleCourseDelete = async (courseId) => {
    const matchedCourse = coursesData.find(cd => cd.id === courseId);
    console.log('****',matchedCourse);
    setDeleteCourse(matchedCourse?.courseName);
    setDeleteCourseId(courseId);
    dispatch(handleDD(true));
    console.log("delete", isDelete);
    if (isDelete) {
      await deleteDoc(doc(database, "courses", courseId));
      dispatch(
        alert({
          status: "success",
          message: "Course deleted successfully!",
          isOpen: true,
        })
        )
        dispatch(handleDD(false))
    }
  };

  console.log("deleteCourse", deleteCourse);
  React.useEffect(() => {
    handleCourseDelete(deleteCourseId);
  },[isDelete])

  return (
    <>
      {isDeleteDialougeOpen && deleteCourse ? <DeleteDialouge deleteC={deleteCourse} /> : null}
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={coursesData.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(coursesData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.courseName);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.courseName)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.courseName}
                      selected={isItemSelected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId
                          }}
                        />
                      </TableCell> */}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="0px 10px"
                        align="left"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {row.courseName}
                      </TableCell>
                      <TableCell align="left">{row.assignmentCount}</TableCell>

                      <TableCell align="left">
                        {row.uploadedAssignmentsCount}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <button
                          className="btn"
                          onClick={() => goToCourseDetails(row.id)}
                        >
                          View Details
                        </button>
                        <AiFillDelete
                          color="tomato"
                          size="30"
                          title="Delete"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleCourseDelete(row.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={coursesData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      </Box>
      </>
  );
}
