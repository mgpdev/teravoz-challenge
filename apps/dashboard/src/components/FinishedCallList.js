import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import moment from "moment";
import { subscribeToQueue } from "./../services/web-socket";
import { formatPhoneNumber } from "./../utils/formatter";
import logger from "./../utils/logger";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  title: {
    margin: theme.spacing.unit * 3
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

class FinishedCallList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { calls: [] };
    subscribeToQueue("999", calls => {
      logger("Event (999) Received", calls);
      this.setState({
        calls: JSON.parse(calls)
      });
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Typography variant="title" gutterBottom className={classes.title}>
          Last finished Calls
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.calls.map(row => {
              return (
                <TableRow key={row.id}>
                  <TableCell>{formatPhoneNumber(row.number)}</TableCell>
                  <TableCell>
                    {moment(row.startAt).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                  <TableCell>
                    {moment(row.endAt).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                  <TableCell>
                    {row.downloadLink && (
                      <Button
                        variant="contained"
                        size="small"
                        className={classes.button}
                      >
                        <SaveIcon
                          className={classNames(
                            classes.leftIcon,
                            classes.iconSmall
                          )}
                        />
                        Save
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

FinishedCallList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FinishedCallList);
