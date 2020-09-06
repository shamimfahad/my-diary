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
import LinearProgress from '@material-ui/core/LinearProgress';

import { createEntry, storage } from '../../firebase/firebase.utils';
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
  const [image, setImage] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [progress, setProgress] = useState(null);
  const fullName = currentUser.displayName.split(' ');
  const firstName = fullName[0];

  const imageUpload = async (image) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              resolve(url);
            });
        }
      );
    });
  };

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let entry = {
      author: currentUser.email,
      author_id: currentUser.id,
      body,
    };
    if (image) {
      const imageUrl = await imageUpload(image);
      entry = {
        author: currentUser.email,
        author_id: currentUser.id,
        body,
        imageUrl,
      };
      try {
        await createEntry(entry);
        setBody('');
        setImage(null);
        setProgress(null);
        setShowSnackbar(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await createEntry(entry).then(() => {
          setBody('');
          setShowSnackbar(true);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetShowSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <div className="container">
      <div className="main-body">
        <div className="header-container">
          <h3 className="main-header">{`Hello ${firstName}`}</h3>
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
          {image && (
            <div className="sub-header" style={{ marginTop: '0.3rem' }}>
              {image.name}
            </div>
          )}
          {progress && <LinearProgress variant="determinate" value={progress} />}
          <div>
            <input
              accept="image/*"
              className={classes.input}
              id="icon-button-file"
              type="file"
              onChange={handleFileUpload}
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
