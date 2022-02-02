import React, { useEffect, useState } from "react";

import clsx from "clsx";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import axios, { AxiosResponse } from "axios";
import { getTask } from "../../service/merchants";

const baseUrl = "http://185.185.126.15:8080/api";

interface OnboardingTaskDto {
  id?: number;
  name: string;
}

async function getTask(
  page: number,
  size: number
): Promise<AxiosResponse<OnboardingTaskDto[]>> {
  return await axios.get<OnboardingTaskDto[]>(
    `${baseUrl}/management/onboarding/task?page=${page}&size=${size}`
  );
}

interface Data {
  id: number;
  businessName: string;
  title: string;
  status: string;
}

function createData(
    id: number,
    businessName: string,
    title: string,
    status: string
): Data {
  return { id, businessName, title, status };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
) => number {
  return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: "id", numeric: false, disablePadding: true, label: "id" },
  {
    id: "businessName",
    numeric: true,
    disablePadding: false,
    label: "businessName",
  },
  { id: "title", numeric: true, disablePadding: false, label: "title" },
  { id: "status", numeric: true, disablePadding: false, label: "status" },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
      event: React.MouseEvent<unknown>,
      property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
      (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };

  return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
                indeterminate={
                  numSelected > 0 && numSelected < rowCount
                }
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{ "aria-label": "select all desserts" }}
            />
          </TableCell>
          {headCells.map((headCell) => (
              <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "normal"}
                  sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
          ))}
        </TableRow>
      </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
      },
      highlight:
          theme.palette.type === "light"
              ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(
                    theme.palette.secondary.light,
                    0.85
                ),
              }
              : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
              },
      title: {
        flex: "1 1 100%",
      },
    })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  onClick: (e: React.MouseEvent<unknown>) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
      <Toolbar
          className={clsx(classes.root, {
            [classes.highlight]: numSelected > 0,
          })}
      >
        {numSelected > 0 ? (
            <Typography
                className={classes.title}
                color="inherit"
                variant="subtitle1"
                component="div"
            >
              {numSelected} selected
            </Typography>
        ) : (
            <Typography
                className={classes.title}
                variant="h6"
                id="tableTitle"
                component="div"
            >
              Customers
            </Typography>
        )}
        {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="delete" onClick={props.onClick}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
        ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
        )}
      </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        width: "100%",
      },
      paper: {
        width: "100%",
        marginBottom: theme.spacing(2),
      },
      table: {
        minWidth: 750,
      },
      visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1,
      },
    })
);

export default function BusinessCustomersTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("businessName");
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState<Data[]>([]);
  const [loading, setLoading] = useState(false);

  let updatedState: Data[] = [];

  // TODO - move this to API file
  const apiUrl = "http://185.185.126.15:8080/api/management/onboarding/task";

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      getTask(1, 100)
          .then((resp) => {
            console.log(resp.data);
          })
          .catch((error) => {
            console.error(error);
          });
      const response = await axios.get(apiUrl, {
        params: { page: 1, size: 100 },
      });
      setLoading(false);

      const objContent: any = response.data.content;

      for (let a = 0; a < objContent.length; a++) {
        updatedState[a] = createData(
            objContent[a].id,
            objContent[a].businessName,
            objContent[a].title,
            objContent[a].status
        );

        setRows([...rows, ...updatedState]);
      }
    };

    getData();
  }, []);

  const handleRequestSort = (
      event: React.MouseEvent<unknown>,
      property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = async () => {
    // npm install qs
    var qs = require("qs");

    const response = await axios.delete(apiUrl, {
      params: {
        ids: selected,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    });

    if (response.status === 204) {
      const updatedData = rows.filter(
          (row) => !selected.includes(row.id)
      ); // It'll return all data except selected ones

      setRows(updatedData); // reset rows to display in table.
    }
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar
              numSelected={selected.length}
              onClick={handleDeleteClick}
          />
          <TableContainer>
            <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                aria-label="enhanced table"
            >
              <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
              />
              <TableBody>
                {loading ? (
                    <div className="spinerr">
                      <CircularProgress />
                    </div>
                ) : null}
                {stableSort(rows, getComparator(order, orderBy))
                    .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                    )
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                          <TableRow
                              hover
                              onClick={(event) =>
                                  handleClick(event, row.id)
                              }
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.businessName}
                              selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                  checked={isItemSelected}
                                  inputProps={{
                                    "aria-labelledby":
                                    labelId,
                                  }}
                              />
                            </TableCell>
                            <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                            >
                              {row.id}
                            </TableCell>
                            <TableCell align="right">
                              {row.businessName}
                            </TableCell>
                            <TableCell align="right">
                              {row.title}
                            </TableCell>
                            <TableCell align="right">
                              {row.status}
                            </TableCell>
                          </TableRow>
                      );
                    })}
                {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
  );
}