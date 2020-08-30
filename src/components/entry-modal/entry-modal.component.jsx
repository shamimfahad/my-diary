import React, { useEffect } from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: 700,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '5px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 'none',
  },
}));

const EntryModal = (props) => {
  const { setShowModal, entry } = props;
  console.log(entry);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setShowModal(false);
  };
  return (
    <>
      <ClickAwayListener onClickAway={handleClose}>
        <Modal
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <Typography variant="h5" component="h2">
                {moment(entry.createdAt.seconds * 1000).format('Do MMMM YYYY')}
              </Typography>
              <Typography
                gutterBottom
                variant="subtitle1"
                color="textSecondary"
                component="p"
              >
                by {entry.author}
              </Typography>
              <Typography variant="body1" component="p">
                {entry.body}
              </Typography>
            </div>
          </Fade>
        </Modal>
      </ClickAwayListener>
    </>
  );
};

export default EntryModal;
