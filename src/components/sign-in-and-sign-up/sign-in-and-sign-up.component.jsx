import React from 'react';
import './sign-in-and-sign-up.styles.scss';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { signInWithGoogle } from '../../firebase/firebase.utils';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    justifyContent: 'center',
    color: '#fff',
    backgroundColor: '#304FFE',
    padding: theme.spacing(3),

    '&:hover': {
      backgroundColor: '#304FFE',
      boxShadow: '4',
    }
  },
}));

const SignInAndSignUp = () => {
  const classes = useStyles();
  return (
    <div className="signInContainer">
      <div className="signInButton">
        <Button
          variant="contained"
          className={classes.button}
          startIcon={<AccountCircleIcon />}
          onClick={signInWithGoogle}
        >
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default SignInAndSignUp;
