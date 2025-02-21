import { ApplicationEditer, InputBox } from "@/components";
// import { CheckBox } from "@mui/icons-material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  IconButton,
  Dialog,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createApplication,
  deleteApplication,
  deleteManyApplication,
  lookupApplication,
  updateApplication,
} from "@/actions";
import { StateSelector } from "@/components/StateSelector";

const columns = ["State", "Link", "Company", "Role", "Salary", "Description"];

const DashboardPage = () => {
  const width = {
    Link: "100px !important",
    Company: "80px !important",
    Role: "130px !important",
    Salary: "80px !important",
    State: "80px !important",
  };
  const prep = {
    link: "",
    company: "",
    role: "",
    salary: "",
    description: "",
    state: 0,
  };
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [states, setStates] = useState([]);
  const [application, setApplication] = useState(prep);
  const [editApplication, setEditApplication] = useState({});
  const [editIndex, setEditIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const handleReload = () => {
    lookupApplication(
      {
        from: page * rowsPerPage,
        count: rowsPerPage,
        company: { $regex: application.company, $options: "i" },
        role: { $regex: application.role, $options: "i" },
        state: { $gt: application.state - 1 },
        // description: { $regex: application.description, $options: "i" },
      },
      (response) => {
        if (response.result && Array.isArray(response.data)) {
          setRows(response.data);
          setStates(response.data.map(() => false));
          setCount(response.count);
        }
      }
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAdd = () => {
    setLoading(true);
    createApplication({ ...application }, (response) => {
      setLoading(false);
      if (response.result) {
        setApplication({ ...prep });
        handleReload();
      }
    });
  };

  const handleDelete = () => {
    setRows([]);
    setStates([]);
    setLoading(true);
    deleteManyApplication(
      {
        id: {
          $in: [...rows.filter((row, ind) => states[ind]).map((row) => row.id)],
        },
      },
      (response) => {
        setLoading(false);
        handleReload();
      }
    );
  };

  const handleDeleteOne = (ind) => {
    setLoading(true);
    setStates([]);
    setRows([]);
    deleteApplication({ id: rows[ind].id }, (response) => {
      setLoading(false);
      handleReload();
    });
  };

  const handleUpdate = (index, newValue) => {
    setLoading(true);
    updateApplication(
      { find: { id: newValue.id }, update: newValue },
      (response) => {
        setLoading(false);
        if (response.result) {
          let newRows = [...rows];
          newRows[index] = newValue;
          setRows([...newRows]);
        }
      }
    );
  };

  const handleOpenApplication = (ind) => {
    setEditIndex(ind);
    setEditApplication(rows[ind]);
    setEditMode(true);
  };

  const handleCloseApplication = () => {
    setEditMode(false);
  };

  const handleSaveApplication = () => {
    handleCloseApplication();
    handleUpdate(editIndex, editApplication);
  };

  useEffect(() => {
    handleReload();
  }, [page, rowsPerPage, application]);

  useEffect(() => {
    console.log(1);
  }, []);

  return (
    <Paper sx={{ height: "100%" }}>
      <TableContainer
        sx={{
          maxHeight: "100%",
          position: "relative",
          ".MuiTableCell-root": { p: 1 },
          overflowX: "hidden",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead
            sx={{
              position: "sticky",
              top: "0px",
              background: "white",
              zIndex: "40",
            }}
          >
            {/* ====================== Table Header ======================= */}
            <TableRow>
              <TableCell
                sx={{
                  padding: "2px !important",
                  minWidth: 80,
                  maxWidth: 80,
                  width: 80,
                }}
              >
                <Checkbox
                  size="small"
                  checked={states.length && states.every((state) => state)}
                  indeterminate={
                    states.filter((state) => state).length !== 0 &&
                    states.filter((state) => state).length !== states.length
                  }
                  onChange={(e) => {
                    setStates(states.map(() => e.target.checked));
                  }}
                ></Checkbox>
                <IconButton
                  color="error"
                  onClick={handleDelete}
                  size="small"
                  disabled={states.filter((state) => state).length === 0}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    maxWidth: width[column],
                    minWidth: width[column],
                    padding: "2px !important",
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
            {/* ======================  Append Bar  ======================= */}
            <TableRow>
              <TableCell
                sx={{
                  padding: "2px !important",
                  textAlign: "center",
                  minWidth: 80,
                  maxWidth: 80,
                  width: 80,
                }}
              >
                <IconButton color="primary" onClick={handleAdd} size="small">
                  <AddIcon />
                </IconButton>
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    verticalAlign: "bottom",
                    maxWidth: width[column],
                    minWidth: width[column],
                    width: width[column],
                    padding: "2px !important",
                  }}
                >
                  {column === "State" ? (
                    <StateSelector
                      value={application.state}
                      onChange={(newValue) =>
                        setApplication({
                          ...application,
                          state: newValue,
                        })
                      }
                    ></StateSelector>
                  ) : (
                    <InputBox
                      multiline={column === "Description"}
                      value={application[column.toLowerCase()] ?? ""}
                      onChange={(newValue) =>
                        setApplication({
                          ...application,
                          [column.toLowerCase()]: newValue,
                        })
                      }
                    ></InputBox>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* ====================== Table Content ======================== */}
            {rows.map((row, ind) => {
              return (
                <TableRow hover tabIndex={-1} key={ind}>
                  <TableCell
                    sx={{
                      minWidth: 80,
                      maxWidth: 80,
                      width: 80,
                      padding: "2px !important",
                      height: "40px !important",
                    }}
                  >
                    <Checkbox
                      checked={states[ind]}
                      onChange={(e) => {
                        let newStates = [...states];
                        newStates[ind] = e.target.checked;
                        setStates([...newStates]);
                      }}
                      size="small"
                    ></Checkbox>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteOne(ind)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  {columns.map((column, index) => (
                    <TableCell
                      key={column}
                      sx={{
                        padding: "2px !important",
                        maxWidth: width[column],
                        minWidth: width[column],
                        width: width[column],
                        maxHeight: "40px !important",
                        height: "40px !important",
                        fontSize: "12px !important",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                      onClick={
                        index < 2 ? undefined : () => handleOpenApplication(ind)
                      }
                    >
                      {index < 1 ? (
                        <StateSelector
                          value={row[column.toLowerCase()]}
                          onChange={(newValue) =>
                            handleUpdate(ind, { ...row, state: newValue })
                          }
                        ></StateSelector>
                      ) : column === "Link" ? (
                        <a href={row[column.toLowerCase()]}>
                          {row[column.toLowerCase()]}
                        </a>
                      ) : column === "Company" || column === "Salary" ? (
                        <b>{row[column.toLowerCase()]}</b>
                      ) : (
                        <p>{row[column.toLowerCase()]}</p>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}

            {/* ======================== No Content ========================= */}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  No data available.
                </TableCell>
              </TableRow>
            )}

            {/* ====================== Pagination Bar ======================= */}
            {rows.length !== 0 && (
              <TableRow
                sx={{
                  position: "sticky",
                  bottom: "0px",
                  left: "0px",
                  right: "0px",
                  background: "white",
                }}
              >
                <TableCell colSpan={7} sx={{ padding: "2px !important" }}>
                  <TablePagination
                    sx={{
                      ".MuiTablePagination-spacer": {
                        display: "none",
                      },
                    }}
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ApplicationEditer
        application={editApplication}
        onChange={setEditApplication}
        open={editMode}
        onClose={handleCloseApplication}
        onSave={handleSaveApplication}
      ></ApplicationEditer>
      <Dialog
        open={loading}
        sx={{
          ".MuiPaper-root": {
            background: "transparent",
            boxShadow: "none",
            overflow: "visible",
          },
          ".MuiBackdrop-root": {
            background: "rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <CircularProgress />
      </Dialog>
    </Paper>
  );
};

export default DashboardPage;
