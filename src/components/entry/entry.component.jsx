import React, { useState } from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';

import EntryModal from '../entry-modal/entry-modal.component';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  hint: {
    color: theme.palette.text.hint,
  },
}));

const Entry = ({ entry }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const classes = useStyles();
  let imgSrc;

  entry.imageUrl ? imgSrc = entry.imageUrl : imgSrc = "https://source.unsplash.com/featured/?{lifestyle},{notes},{travel}";

  const handleOpen = () => {
    setShowModal(true);
    setSelectedEntry(entry);
  };

  return (
    <>
      <Grid item xs={12} md={6} sm={6} lg={3}>
        <Card className={classes.root}>
          <CardActionArea onClick={handleOpen}>
            <CardMedia
              component="img"
              alt="Contemplative Reptile"
              height="140"
              image={imgSrc}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography variant="h5" component="h2">
                {moment(entry.createdAt.seconds * 1000).format('Do MMMM YYYY')}
              </Typography>
              <Typography
                gutterBottom
                variant="subtitle1"
                className={classes.hint}
                component="p"
              >
                {moment(entry.createdAt.seconds * 1000).format('hh:mm a')}
              </Typography>
              <Typography
                variant="body2"
                noWrap
                color="textSecondary"
                component="p"
              >
                {entry.body}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary" onClick={handleOpen}>
              View Full Entry
            </Button>
          </CardActions>
        </Card>
      </Grid>
      {showModal && (
        <EntryModal setShowModal={setShowModal} entry={selectedEntry} />
      )}
    </>
  );
};

export default Entry;
