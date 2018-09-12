import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import CallList from "./CallList";
import FinishedCallList from "./FinishedCallList";

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 40
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

function Dashboard(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Fade in={true}>
        <Grid container spacing={24}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper} elevation={1}>
              <CallList title="Active calls of new customers" queue="900" />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper} elevation={1}>
              <CallList
                title="Active calls of returning customers"
                queue="901"
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <FinishedCallList />
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
