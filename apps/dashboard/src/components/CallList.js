import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import moment from "moment";
import { subscribeToQueue } from "./../services/web-socket";
import { formatPhoneNumber } from "./../utils/formatter";
import logger from "./../utils/logger";
import CallItem from "./CallItem";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
});

class CallList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { calls: [] };
    subscribeToQueue(props.queue, calls => {
      logger(`Event (${props.queue}) Received`, calls);
      this.setState({
        calls: JSON.parse(calls)
      });
    });
  }
  render() {
    const { title, classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="title" gutterBottom>
          {title}
        </Typography>
        <List>
          {this.state.calls.map(row => {
            return (
              <CallItem
                number={formatPhoneNumber(row.number)}
                time={moment(row.startAt).fromNow()}
              />
            );
          })}
        </List>
      </div>
    );
  }
}

CallList.propTypes = {
  title: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CallList);
