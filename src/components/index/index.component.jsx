import React, { useState } from 'react';
import moment from 'moment';
import './index.styles.scss';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Tooltip from '@material-ui/core/Tooltip';

import { createEntry } from '../../firebase/firebase.utils';
import SuccessMessage from '../success-message/success-message.component';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

const Index = ({ currentUser }) => {
  const classes = useStyles();
  const [body, setBody] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const entry = {
      author: currentUser.email,
      body,
    };
    setBody('');
    try {
      await createEntry(entry).then((res) => {
        setBody('');
        setShowSnackbar(true);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const resetShowSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <div className="container">
      <div className="main-body">
        <div className="header-container">
          <h3 className="main-header">Hello Meow</h3>
          <p className="sub-header">{moment().format("[It's] dddd Do MMMM")}</p>
        </div>
        <form>
          <TextField
            autoFocus
            label="How was your day?"
            variant="outlined"
            multiline
            rows={12}
            fullWidth
            value={body}
            onChange={handleChange}
          />
          <div>
            <input
              accept="image/*"
              className={classes.input}
              id="icon-button-file"
              type="file"
            />
            <Tooltip title="Insert Image">
              <label htmlFor="icon-button-file">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
              </label>
            </Tooltip>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
      {showSnackbar && <SuccessMessage resetShowSnackbar={resetShowSnackbar} />}
    </div>
  );
};

export default Index;
