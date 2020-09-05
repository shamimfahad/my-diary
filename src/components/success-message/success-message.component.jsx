import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SuccessMessage = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    open: true,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  useEffect(() => {
    const timer = setTimeout(() => {
      props.resetShowSnackbar();
    }, 5000);
    return () => clearTimeout(timer);
  }, [props]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({ ...state, open: false });
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          Entry Saved Successfully
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SuccessMessage;