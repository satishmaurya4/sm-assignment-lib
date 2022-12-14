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
import { visuallyHidden } from "@mui/utils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "enrolledCourseCount",
    numeric: true,
    disablePadding: false,
    label: "Enrolled Course",
  },
  {
    id: "downloadedAssignmentsCount",
    numeric: true,
    disablePadding: false,
    label: "Downloaded Assignments",
  },
  {
    id: "uploadedAssignmentsCount",
    numeric: true,
    disablePadding: false,
    label: "Uploaded Assignments",
  },
  {
    id: "checkedAssignmentCount",
    numeric: true,
    disablePadding: false,
    label: "Assignments Checked",
  },
  {
    id: "profilePic",
    numeric: true,
    disablePadding: false,
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => {
          console.log(headCell);
          return (
            <TableCell
              key={headCell.id}
              align="center"
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
          Students Record
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function AdminStudentTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { users } = useSelector((state) => state.info);
  const navigate = useNavigate();

  const goToStudentDetails = (id) => {
    navigate(`/home/students/details/${id}`);
  };

  const students = users.filter((u) => u.role === "student");
  const studentsData = students.map((s) => {
    const id = s.uid;
    const name = s.name;
    const active = "" + s.active;
    let enrolledCourseCount = 0;
    s.enrolledCourse.forEach((ec) => (enrolledCourseCount += 1));

    let downloadedAssignmentsCount = 0;
    s.enrolledCourse.forEach((ec) => {
      ec.assignmentDetails.forEach((ad) => {
        if (ad?.isAssignmentDownloaded) {
          downloadedAssignmentsCount += 1;
        }
      });
    });

    let uploadedAssignmentsCount = 0;
    s.enrolledCourse.forEach((ec) => {
      ec.assignmentDetails.forEach((ad) => {
        if (ad?.isAssignmentUploaded) {
          uploadedAssignmentsCount += 1;
        }
      });
    });

    let checkedAssignmentCount = 0;
    s.enrolledCourse.forEach((ec) => {
      ec.assignmentDetails.forEach((ad) => {
        if (ad?.isChecked) {
          checkedAssignmentCount += 1;
        }
      });
    });

    const profilePic = s.profilePic;
    return {
      id,
      name,
      active,
      checkedAssignmentCount,
      enrolledCourseCount,
      downloadedAssignmentsCount,
      uploadedAssignmentsCount,
      profilePic,
    };
  });

  console.log("studetsdata", studentsData);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = studentsData.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - studentsData.length) : 0;

  return (
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
              rowCount={studentsData.length}
            />
            <TableBody>
              {stableSort(studentsData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="normal"
                        sx={{ textTransform: "capitalize", padding: "0px 5px" }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="center">
                        {row.enrolledCourseCount}
                      </TableCell>
                      <TableCell align="center">
                        {row.downloadedAssignmentsCount}
                      </TableCell>
                      <TableCell align="center">
                        {row.uploadedAssignmentsCount}
                      </TableCell>
                      <TableCell align="center">
                        {row.checkedAssignmentCount}
                      </TableCell>
                      <TableCell>
                        <button
                          className="btn"
                          onClick={() => goToStudentDetails(row.id)}
                        >
                          View Details
                        </button>
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
          count={studentsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
