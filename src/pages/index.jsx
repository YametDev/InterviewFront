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
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Chip,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {
  ApplicationEditer,
  InputBox,
  UploadButton,
  StateSelector,
  SeekerSelector,
  SkillsTooltip,
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
  lookupSkill,
  createSkill,
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

  const [loading, setLoading] = useState(false);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [states, setStates] = useState([]);

  const [editApplication, setEditApplication] = useState({});

  const [editIndex, setEditIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]); // [{ sid, name }]

  const [upload, setUpload] = useState(undefined);
  const [tableWidth, setTableWidth] = useState(0);
  const [flexibleWidth, setFlexibleWidth] = useState(200);
  const tableContainerRef = useRef(null);

  // Column visibility management
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const buildColumnsData = () => [
    {
      property: "userId",
      display: "Seeker",
      width: 130,
      visible: true,
      editable: true,
      clickable: false,
      filter: (userId) => ({ userId }),
      editComponent: (value, onChange) => (
        <SeekerSelector
          value={value}
          onChange={(newValue) => onChange(newValue)}
          items={users}
          width={130}
        />
      ),
      dispComponent: (value, rowData, index) => (
        <SeekerSelector
          value={value}
          onChange={(newValue) =>
            handleUpdate(index, { ...rowData, userId: newValue })
          }
          items={users}
          width={130}
        />
      ),
    },
    {
      property: "state",
      display: "State",
      width: 70,
      default: 0,
      visible: true,
      editable: true,
      clickable: false,
      filter: (value) => ({ state: { $gt: value - 1 } }),
      editComponent: (value, onChange) => (
        <StateSelector
          value={value}
          onChange={(newValue) => onChange(newValue)}
          width={70}
        />
      ),
      dispComponent: (value, rowData, index) => (
        <StateSelector
          value={value}
          onChange={(newValue) =>
            handleUpdate(index, { ...rowData, state: newValue })
          }
          width={70}
        />
      ),
    },
    {
      property: "createdAt",
      display: "Date",
      width: 100,
      default: "",
      visible: true,
      editable: false,
      clickable: true,
      filter: (value) => ({ date: value.length === 0 ? "0000-00-00" : value }),
      editComponent: (value, onChange) => (
        <form
          className={classes.container}
          style={{ width: "100px !important" }}
        >
          <TextField
            type="date"
            className={classes.textField}
            variant="standard"
            size="small"
            value={value || ""}
            sx={{
              input: {
                fontSize: "14px",
              },
            }}
            onChange={(e) => onChange(e.target.value)}
          />
        </form>
      ),
      dispComponent: (value) => <>{value}</>,
    },
    {
      property: "link",
      display: "Link",
      width: 100,
      default: "",
      visible: true,
      editable: true,
      clickable: false,
      filter: (link) => ({ link: handleEscape(link) }),
      editComponent: (value, onChange) => (
        <InputBox
          value={value ?? ""}
          onChange={(newValue) => onChange(newValue)}
        />
      ),
      dispComponent: (value) => (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      ),
    },
    {
      property: "company",
      display: "Company",
      width: 80,
      default: "",
      visible: true,
      editable: true,
      clickable: true,
      filter: (value) => ({ company: handleEscape(value) }),
      editComponent: (value, onChange) => (
        <InputBox
          value={value ?? ""}
          onChange={(newValue) => onChange(newValue)}
        />
      ),
      dispComponent: (value) => <b>{value}</b>,
    },
    {
      property: "role",
      display: "Role",
      width: 130,
      default: "",
      visible: true,
      editable: true,
      clickable: true,
      filter: (value) => ({ role: handleEscape(value) }),
      editComponent: (value, onChange) => (
        <InputBox
          value={value ?? ""}
          onChange={(newValue) => onChange(newValue)}
        />
      ),
      dispComponent: (value) => <>{value}</>,
    },
    {
      property: "salary",
      display: "Salary",
      width: 80,
      default: "",
      visible: false,
      editable: true,
      clickable: true,
      filter: (value) => ({ salary: handleEscape(value) }),
      editComponent: (value, onChange) => (
        <InputBox
          value={value ?? ""}
          onChange={(newValue) => onChange(newValue)}
        />
      ),
      dispComponent: (value) => <b>{value}</b>,
    },
    {
      property: "resume",
      display: "Resume",
      width: 90,
      visible: false,
      editable: true,
      clickable: false,
      // No filter function for resume as it's not used in filtering
      editComponent: (upload, setUpload) => (
        <UploadButton
          onChange={(e) => setUpload(e.target.files[0])}
          size="small"
          sx={{ fontSize: "12px !important", py: 0, px: 1 }}
          text={upload ? "Ready" : "Upload"}
          color={upload ? "info" : "warning"}
        />
      ),
      dispComponent: (value) =>
        value && value.length ? (
          <a target="_blank" href={value} rel="noopener noreferrer">
            View Resume
          </a>
        ) : null,
    },
    {
      property: "skills",
      display: "Skills",
      width: 0,
      default: [],
      visible: true,
      editable: true,
      clickable: true,
      // Empty selection should not filter anything
      filter: (skills) => (Array.isArray(skills) && skills.length > 0 ? { skills: { $all: skills } } : {}),
      // filter omitted for now or implement contains-any
      editComponent: (value = [], onChange) => (
        <Autocomplete
          multiple
          freeSolo
          options={skills}
          getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.name)}
          value={value
            .map((sid) => skills.find((s) => s.sid === sid))
            .filter(Boolean)}
          onChange={async (_, selected) => {
            const last = selected.at(-1);
            if (typeof last === "string") {
              const input = last.trim();
              const exact = skills.find(
                (s) => s.name.toLowerCase() === input.toLowerCase()
              );
              if (exact) {
                onChange([
                  ...new Set(
                    selected.map((s) =>
                      typeof s === "string" ? exact.sid : s.sid
                    )
                  ),
                ]);
              } else {
                console.log(input);
                createSkill({ name: input }, (resp) => {
                  if (resp.result && resp.data) {
                    const created = {
                      sid: resp.data.sid,
                      name: resp.data.name,
                    };
                    setSkills((prev) => {
                      // avoid duplicates
                      if (prev.some((p) => p.sid === created.sid)) return prev;
                      return [...prev, created];
                    });
                    onChange(
                      selected.map((s) =>
                        typeof s === "string" ? created.sid : s.sid
                      )
                    );
                  }
                });
              }
            } else {
              onChange(selected.map((s) => s.sid));
            }
          }}
          renderTags={(selected, getTagProps) => {
            if (!selected.length) return null;
            const [first, ...rest] = selected;
            return (
              <>
                <Chip key={first.sid} label={first.name} size="small" />
                {rest.length > 0 && (
                  <SkillsTooltip items={rest} placement="top">
                    <Chip key="more" label={`+${rest.length}`} size="small" />
                  </SkillsTooltip>
                )}
              </>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              placeholder="Add skills"
            />
          )}
        />
      ),
      dispComponent: (value = []) => {
        const selected = value
          .map((sid) => skills.find((s) => s.sid === sid))
          .filter(Boolean);
        if (!selected.length) return null;
        const [first, ...rest] = selected;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              overflow: "hidden",
            }}
          >
            <Chip key={first.sid} label={first.name} size="small" />
            {rest.length > 0 && (
              <SkillsTooltip items={rest} placement="top">
                <Chip key="more" label={`+${rest.length}`} size="small" />
              </SkillsTooltip>
            )}
          </Box>
        );
      },
    },
    {
      property: "description",
      display: "Description",
      width: 0,
      default: "",
      visible: true,
      editable: true,
      clickable: true,
      filter: (value) => ({ description: handleEscape(value) }),
      editComponent: (value, onChange) => (
        <InputBox
          multiline={true}
          value={value ?? ""}
          onChange={(newValue) => onChange(newValue)}
        />
      ),
      dispComponent: (value) => (
        <p
          style={{
            width: "100%",
            overflow: "hidden",
          }}
        >
          {value}
        </p>
      ),
    },
  ];

  // Dynamic columns configuration
  const [columns, setColumns] = useState(buildColumnsData());

  // Generate prep object dynamically from columns configuration
  const prep = columns.reduce((acc, column) => {
    if (column.default !== undefined) {
      acc[column.property] = column.default;
    }
    return acc;
  }, {});

  const [application, setApplication] = useState({ ...prep, userId: 0 });
  const debouncedApplication = useDebounce(application, 500);

  // Ref to always have access to the latest application state
  const applicationRef = useRef(application);

  // Update ref whenever application changes
  useEffect(() => {
    applicationRef.current = application;
  }, [application]);

  const isApplicationOrigin = (application) => {
    return !columns.some((column) => {
      if (column.visible && column.default !== undefined) {
        // compare arrays by length for skills
        if (column.property === "skills") {
          return (
            (application.skills || []).length !== (column.default || []).length
          );
        }
        return application[column.property] !== column.default;
      }
      return false;
    });
  };

  const buildFilterObject = (application) => {
    let flag = false;
    let dynamicFilters = columns.reduce((filters, column) => {
      if (
        column.visible &&
        column.filter &&
        application[column.property] !== undefined
      ) {
        const columnFilter = column.filter(application[column.property]);
        if (
          column.default !== undefined &&
          application[column.property] != column.default
        ) {
          flag = true;
        }
        return { ...filters, ...columnFilter };
      }
      return filters;
    }, {});

    // Add required metadata
    return {
      ...dynamicFilters,
      userId: isApplicationOrigin(application)
        ? dynamicFilters.userId
        : { $in: users.map((user) => user.userId) },
      offset: new Date().getTimezoneOffset(),
      from: page * rowsPerPage,
      count: rowsPerPage,
    };
  };

  const buildUpdateObject = (app) => {
    return columns.reduce((acc, column) => {
      if (column.editable && app[column.property] !== undefined) {
        acc[column.property] = app[column.property];
      }
      return acc;
    }, {});
  };

  const handleEscape = (str) => ({
    $regex: str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
    $options: "i",
  });

  const handleReloadUserInfo = (email) => {
    if (email.length) {
      lookupUser({ $or: [{ email }, { parent: email }] }, (response) => {
        if (response.result && response.data.length) {
          let currentUser = {};
          const newUserData = response.data.map((user) => {
            if (user.email === email) currentUser = user;
            return {
              name: user.name,
              email: user.email,
              userId: user.userId,
            };
          });
          setUser(currentUser);
          setApplication({ ...application, userId: currentUser.userId });
          setUsers(newUserData);
        } else {
          router.push("/signin");
        }
      });
    }
  };

  const handleReload = (application, anim = false) => {
    if (anim) {
      setLoading(true);
    }

    const filterObject = buildFilterObject(application);

    lookupApplication(filterObject, (response) => {
      if (anim) {
        setLoading(false);
      }
      if (response.result && Array.isArray(response.data)) {
        setRows(response.data);
        setStates(response.data.map(() => false));
        setCount(response.count);
      }
    });
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
      return "";
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    const resume = await handleUploadResume();

    // Get current application state at the time of execution
    setApplication((currentApplication) => {
      console.log(currentApplication);
      createApplication({ resume, ...currentApplication }, (response) => {
        setLoading(false);
        if (response.result) {
          setApplication((prevApp) => ({ ...prevApp, ...prep }));
          setUpload(undefined);
        }
      });
      return currentApplication; // Return unchanged state
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
        setApplication((currentApplication) => {
          handleReload(currentApplication);
          return currentApplication;
        });
      }
    );
  };

  const handleDeleteOne = (ind) => {
    setLoading(true);
    setStates([]);
    setRows([]);
    deleteApplication({ id: rows[ind].id }, (response) => {
      setApplication((currentApplication) => {
        handleReload(currentApplication);
        return currentApplication;
      });
    });
  };

  const handleUpdate = (index, newValue) => {
    setLoading(true);
    const updateObject = buildUpdateObject(newValue);
    updateApplication(
      {
        id: newValue._id,
        update: updateObject,
      },
      (response) => {
        setApplication((currentApplication) => {
          handleReload(currentApplication, true);
          return currentApplication;
        });
        setLoading(false);
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

  // Column visibility handlers
  const handleOpenColumnSettings = () => {
    setColumnSettingsOpen(true);
  };

  const handleCloseColumnSettings = () => {
    setColumnSettingsOpen(false);
  };

  const handleToggleColumnVisibility = (property) => {
    // Prevent toggling visibility for required columns
    const requiredColumns = ["userId", "company", "role", "description"];
    if (requiredColumns.includes(property)) {
      return;
    }

    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.property === property ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent browser's default context menu
    event.stopPropagation(); // Stop event from bubbling up
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Next or prev page, rows changed
  useEffect(() => {
    if (application.userId !== 0) {
      handleReload(debouncedApplication, true);
    }
  }, [page, rowsPerPage]);

  // Application chnaged
  useEffect(() => {
    if (user != {}) {
      setPage(0);
      handleReload(debouncedApplication);
    }
  }, [debouncedApplication]);

  // Window resized
  useEffect(() => {
    let flexibleCount = 0;
    const width = columns.reduce((sum, column) => {
      if (!column.width || !column.visible) {
        if (!column.width && column.visible) flexibleCount++;
        return sum;
      }
      return sum + column.width + 4;
    }, 88);
    const computed = flexibleCount ? (tableWidth - width) / flexibleCount : 0;
    setFlexibleWidth(computed > 0 ? computed : 0);
  }, [tableWidth, columns.filter((c) => c.visible).map((c) => c.visible)]);

  useEffect(() => {
    setColumns(buildColumnsData());
  }, [users, skills]);

  // First load
  useEffect(() => {
    const handleGlobalContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleGlobalContextMenu);

    const storedEmail = getCookie("jobseeker");
    if (storedEmail.length) {
      handleReloadUserInfo(storedEmail);
    } else {
      router.push("/signin");
    }

    // Load skills list
    lookupSkill({}, (resp) => {
      if (resp.result && Array.isArray(resp.data)) {
        setSkills(resp.data.map((s) => ({ sid: s.sid, name: s.name })));
      }
    });

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

    return () => {
      document.removeEventListener("contextmenu", handleGlobalContextMenu);
    };
  }, []);

  return (
    <Paper sx={{ height: "100%" }}>
      {user != {} && (
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
                <TableCell colSpan={2}>
                  <Button onClick={handleLogout} color="error">
                    Logout
                  </Button>
                </TableCell>
                <TableCell
                  colSpan={columns.filter((c) => c.visible).length - 1}
                >{`${user.email} : ${user.name}`}</TableCell>
              </TableRow>
              {/* ====================== Table Header ======================= */}
              <TableRow onContextMenu={handleContextMenu}>
                <TableCell
                  sx={{
                    padding: "2px !important",
                    minWidth: 80,
                    maxWidth: 80,
                    width: 80,
                  }}
                >
                  {/* CheckAll checkbox */}
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
                  {/* DeleteSelected button */}
                  <IconButton
                    color="error"
                    onClick={handleDelete}
                    size="small"
                    disabled={states.filter((state) => state).length === 0}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                {columns
                  .filter((column) => column.visible)
                  .map((column) => (
                    <TableCell
                      key={column.property}
                      sx={{
                        maxWidth: column.width ? column.width : flexibleWidth,
                        minWidth: column.width ? column.width : flexibleWidth,
                        width: column.width ? column.width : flexibleWidth,
                        padding: "2px !important",
                      }}
                    >
                      {column.display}
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
                  <IconButton
                    onClick={handleOpenColumnSettings}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={handleAdd} size="small">
                    <AddIcon />
                  </IconButton>
                </TableCell>
                {columns
                  .filter((column) => column.visible)
                  .map((column) => (
                    <TableCell
                      key={column.property}
                      sx={{
                        verticalAlign: "bottom",
                        maxWidth: column.width ? column.width : flexibleWidth,
                        minWidth: column.width ? column.width : flexibleWidth,
                        width: column.width ? column.width : flexibleWidth,
                        padding: "2px !important",
                      }}
                    >
                      {column.property === "resume"
                        ? column.editComponent(upload, setUpload)
                        : column.editComponent(
                            application[column.property],
                            (newValue) =>
                              setApplication({
                                ...application,
                                [column.property]: newValue,
                              })
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
                    {columns
                      .filter((column) => column.visible)
                      .map((column, index) => (
                        <TableCell
                          key={column.property}
                          sx={{
                            padding: "2px !important",
                            maxWidth: column.width
                              ? column.width
                              : flexibleWidth,
                            minWidth: column.width
                              ? column.width
                              : flexibleWidth,
                            width: column.width ? column.width : flexibleWidth,
                            maxHeight: "40px !important",
                            height: "40px !important",
                            fontSize: "12px !important",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                          onClick={
                            column.clickable
                              ? () => handleOpenApplication(ind)
                              : undefined
                          }
                        >
                          {column.dispComponent(row[column.property], row, ind)}
                        </TableCell>
                      ))}
                  </TableRow>
                );
              })}

              {/* ======================== No Content ========================= */}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.filter((col) => col.visible).length + 1}
                  >
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
        editableColumns={columns.filter((col) => col.editable)}
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

      {/* Column Settings Dialog */}
      <Dialog open={columnSettingsOpen} onClose={handleCloseColumnSettings}>
        <DialogTitle>Column Visibility Settings</DialogTitle>
        <DialogContent>
          {columns.map((column) => {
            const requiredColumns = [
              "userId",
              "company",
              "role",
              "description",
            ];
            const isRequired = requiredColumns.includes(column.property);

            return (
              <FormControlLabel
                key={column.property}
                control={
                  <Checkbox
                    checked={column.visible}
                    onChange={() =>
                      handleToggleColumnVisibility(column.property)
                    }
                    disabled={isRequired}
                  />
                }
                label={column.display + (isRequired ? " (Required)" : "")}
                sx={isRequired ? { opacity: 0.6 } : {}}
              />
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseColumnSettings}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Right-click Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {columns.map((column) => {
          const requiredColumns = ["userId", "company", "role", "description"];
          const isRequired = requiredColumns.includes(column.property);

          return (
            <MenuItem
              key={column.property}
              onClick={() => {
                handleToggleColumnVisibility(column.property);
                handleCloseContextMenu();
              }}
              disabled={isRequired}
              sx={isRequired ? { opacity: 0.6 } : {}}
            >
              <ListItemIcon>
                {column.visible ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <VisibilityOffIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={column.display + (isRequired ? " (Required)" : "")}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </Paper>
  );
};

export default DashboardPage;
