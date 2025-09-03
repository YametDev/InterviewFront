import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

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
  Button,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import {
  ApplicationEditer,
  ComboSelector,
  InputBox,
  UploadButton,
  StateSelector
} from "@/components";
import {
  createApplication,
  deleteApplication,
  deleteManyApplication,
  getCookie,
  lookupApplication,
  lookupUser,
  setCookie,
  updateApplication,
  uploadResume,
} from "@/actions";
import { makeStyles } from "@mui/styles";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const columns = [
  "State",
  "Date",
  "Link",
  "Company",
  "Role",
  "Salary",
  "Resume",
  "Description",
];
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: 0,
    marginRight: 0,
    width: 200,
  },
}));

const DashboardPage = () => {
  const classes = useStyles();
  const router = useRouter();

  const width = {
    Link: "100px !important",
    Date: "100px !important",
    Company: "80px !important",
    Role: "130px !important",
    Salary: "80px !important",
    State: "70px !important",
    Resume: "90px !important",
  };

  const prep = {
    date: "",
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
  const debouncedApplication = useDebounce(application, 500);
  const [editApplication, setEditApplication] = useState({});

  const [editIndex, setEditIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(0);
  const [users, setUsers] = useState([]);

  const [upload, setUpload] = useState(undefined);
  const [tableWidth, setTableWidth] = useState(0);
  const tableContainerRef = useRef(null);

  const isApplicationOrigin = () => {
    return true;
  }

  const handleEscape = (str) => ({ $regex: str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), $options: "i"});

  const handleReloadUserInfo = (email) => {
    if (email.length) {
      lookupUser({ $or: [{ email }, { parent: email }] }, (response) => {
        if (response.result && response.data.length) {
          const newUserData = response.data.map((user) => {
            if (user.email === email) {
              setUserId(user.userId);
            }
            return {
              name: user.name,
              email: user.email,
              userId: user.userId,
            };
          });
          setUsers(newUserData);
          setCurrentUserId(newUserData[0].userId);
        } else {
          router.push("/signin");
        }
      });
    }
  };

  const handleReload = (anim = false) => {
    if (anim) {
      setLoading(true);
    }
    lookupApplication(
      {
        userId: isApplicationOrigin()
          ? currentUserId
          : { $in: users.map((user) => user.userId) },
        date: application.date.length === 0 ? "0000-00-00" : application.date,
        offset: new Date().getTimezoneOffset(),
        from: page * rowsPerPage,
        count: rowsPerPage,
        company: handleEscape(application.company),
        role: handleEscape(application.role),
        state: { $gt: application.state - 1 },
        link: handleEscape(application.link),
        description: handleEscape(application.description),
      },
      (response) => {
        if (anim) {
          setLoading(false);
        }
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

  const handleUploadResume = async () => {
    if (!upload) return "";
    const formData = new FormData();
    formData.append("file", upload);

    try {
      const response = await uploadResume(formData);
      return response.data.webViewLink;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    const resume = await handleUploadResume();
    createApplication(
      { userId: currentUserId, resume, ...application },
      (response) => {
        setLoading(false);
        if (response.result) {
          setApplication({ ...prep });
          setUpload(undefined);
        }
      }
    );
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
      {
        id: newValue._id,
        update: {
          link: newValue.link,
          company: newValue.company,
          role: newValue.role,
          salary: newValue.salary,
          description: newValue.description,
        },
      },
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

  const handleLogout = () => {
    setCookie("jobseeker", "");
    router.push("/signin");
  };

  useEffect(() => {
    if (currentUserId) {
      handleReload(true);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (currentUserId) {
      setPage(0);
      handleReload(true);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (email.length) {
      handleReload();
    }
  }, [debouncedApplication]);

  useEffect(() => {
    handleReloadUserInfo(email);
  }, [email]);

  useEffect(() => {
    const email = getCookie("jobseeker");
    if (email.length) {
      setEmail(email);
    } else {
      router.push("/signin");
    }

    setTimeout(() => {
      // Table Width Observe
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setTableWidth(entry.contentRect.width); // Update the width state
        }
      });

      if (tableContainerRef.current) {
        observer.observe(tableContainerRef.current); // Observe the TableContainer
      }

      return () => {
        if (tableContainerRef.current) {
          observer.unobserve(tableContainerRef.current); // Clean up the observer
        }
      };
    }, 300);
  }, []);

  return (
    <Paper sx={{ height: "100%" }}>
      {email.length !== 0 && (
        <TableContainer
          ref={tableContainerRef}
          sx={{
            ".MuiTableCell-root": { p: 1 },
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
              {/* ====================== Email Selection ======================= */}
              <TableRow>
                <TableCell colSpan={8}>
                  <ComboSelector
                    fullWidth={false}
                    items={users.map((user) => ({
                      value: user.userId,
                      label: user.name,
                    }))}
                    value={currentUserId}
                    onChange={(e) => setCurrentUserId(e.target.value)}
                  />
                </TableCell>
                <TableCell colSpan={1}>
                  <Button onClick={handleLogout} color="error">
                    Logout
                  </Button>
                </TableCell>
              </TableRow>
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
                    ) : column === "Resume" ? (
                      <UploadButton
                        onChange={(e) => setUpload(e.target.files[0])}
                        size="small"
                        sx={{ fontSize: "12px !important", py: 0, px: 1 }}
                        text={upload ? "Ready" : "Upload"}
                        color={upload ? "info" : "warning"}
                      />
                    ) : column === "Date" ? (
                      <form className={classes.container} noValidate>
                        <TextField
                          type="date"
                          className={classes.textField}
                          variant="standard"
                          size="small"
                          value={application.date}
                          sx={{
                            input: {
                              fontSize: "14px",
                            },
                          }}
                          onChange={(e) =>
                            setApplication({
                              ...application,
                              date: e.target.value,
                            })
                          }
                        />
                      </form>
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
                          index < 2 || index === 6
                            ? undefined
                            : () => handleOpenApplication(ind)
                        }
                      >
                        {index < 1 ? (
                          <StateSelector
                            value={row[column.toLowerCase()]}
                            onChange={(newValue) =>
                              handleUpdate(ind, { ...row, state: newValue })
                            }
                          ></StateSelector>
                        ) : column === "Date" ? (
                          <>{row.createdAt}</>
                        ) : column === "Link" ? (
                          <a href={row.link}>{row.link}</a>
                        ) : column === "Company" || column === "Salary" ? (
                          <b>{row[column.toLowerCase()]}</b>
                        ) : column === "Resume" ? (
                          row.resume &&
                          row.resume.length && (
                            <a target="_blank" href={row.resume}>
                              View Resume
                            </a>
                          )
                        ) : (
                          <p
                            style={{
                              width: tableWidth - 766,
                              overflow: "hidden",
                            }}
                          >
                            {row[column.toLowerCase()]}
                          </p>
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
                  <TableCell colSpan={8} sx={{ padding: "2px !important" }}>
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
                      slotProps={{
                        select: {
                          "aria-label": "Rows per page",
                        },
                        actions: {
                          showFirstButton: true,
                          showLastButton: true,
                          slots: {
                            firstPageIcon: FirstPageRoundedIcon,
                            lastPageIcon: LastPageRoundedIcon,
                            nextPageIcon: ChevronRightRoundedIcon,
                            backPageIcon: ChevronLeftRoundedIcon,
                          },
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
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
