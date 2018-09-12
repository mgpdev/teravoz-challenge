import React from "react";
import PropTypes from "prop-types";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import PhoneRounded from "@material-ui/icons/PhoneRounded";

const styles = theme => ({
  root: {
    width: "100%"
  }
});

function CallItem(props) {
  const { number, time } = props;
  return (
    <div>
      <ListItem>
        <Avatar>
          <PhoneRounded />
        </Avatar>
        <ListItemText primary={number} secondary={time} />
      </ListItem>
    </div>
  );
}

CallItem.propTypes = {
  number: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired
};

export default CallItem;
