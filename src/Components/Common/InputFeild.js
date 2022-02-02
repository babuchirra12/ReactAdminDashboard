import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const InputFeild = () => {
  const classes = useStyles();
  return (
    <div>
      <TextField id="outlined-basic" variant="outlined" />
      <TextField
        id="standard-full-width"
       
        style={{ margin: 8 }}
        placeholder="Placeholder"
        helperText="Full width!"
        variant="outlined"
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="None"
        id="margin-none"
        defaultValue="Default Value"
        className={classes.textField}
        helperText="Some important text"
      />
    </div>
  );
};

export default InputFeild;
