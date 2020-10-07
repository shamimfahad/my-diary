import React, { useEffect } from 'react';
import moment from 'moment';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Button } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    maxWidth: 700,
    outline: 'none',
    maxHeight: 500,
    overflow: 'scroll',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 370,
      maxHeight: 600,
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: 700,
      maxHeight: 800,
    },
  },
  media: {
    objectFit: 'contain',
    paddingTop: '1rem',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '5px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 'none',
  },
  modalHeader: {
    marginBottom: '1rem',
  },
}));

const EntryModal = (props) => {
  const { setShowModal, entry } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setShowModal(false);
  };
  return (
    <>
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
          <Card className={classes.root}>
            {entry.imageUrl && (
              <CardMedia
                component="img"
                className={classes.media}
                alt=""
                height="250"
                image={entry.imageUrl}
              />
            )}
            <CardContent>
              <div className={classes.paper}>
                <div className={classes.modalHeader}>
                  <Typography variant="h5" component="h2">
                    {moment(entry.createdAt.seconds * 1000).format(
                      'Do MMMM YYYY'
                    )}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    color="textSecondary"
                    component="p"
                  >
                    by {entry.author}
                  </Typography>
                </div>
                <Typography lineheight={5} variant="body1" component="p">
                  {entry.body}
                </Typography>
              </div>
              {matches && <Button onClick={handleClose}>Close</Button>}
            </CardContent>
          </Card>
        </Fade>
      </Modal>
    </>
  );
};

export default EntryModal;
