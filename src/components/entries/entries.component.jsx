import React, { useEffect, useState } from 'react';
import { orderBy } from 'lodash';
import './entries.styles.scss';
import Entry from '../entry/entry.component';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

import { firestore } from '../../firebase/firebase.utils';
import InfiniteScroll from 'react-infinite-scroll-component';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const Entries = ({ currentUser }) => {
  const classes = useStyles();
  const [loadedData, setLoadedData] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const { email } = currentUser;

  const order = (array, sortBy) => {
    const newArray = orderBy(array, ['createdAt'], [sortBy]);
    return newArray;
  };

  const fetchEntries = async (email) => {
    firestore
      .collection('entries')
      .where('author', '==', email)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get()
      .then((entriesSnapshot) => {
        setLastVisible(entriesSnapshot.docs[entriesSnapshot.docs.length - 1]);
        const transformedEntries = entriesSnapshot.docs.map((doc) => {
          const { body, createdAt, author, imageUrl } = doc.data();
          return {
            id: doc.id,
            body,
            author,
            createdAt,
            imageUrl,
          };
        });
        setEntries(transformedEntries);
        setLoadedData(transformedEntries);
      });
  };

  const fetchMoreData = async (email) => {
    firestore
      .collection('entries')
      .where('author', '==', email)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .startAfter(lastVisible)
      .get()
      .then((entriesSnapshot) => {
        if (entriesSnapshot.docs.length > 0) {
          setLastVisible(entriesSnapshot.docs[entriesSnapshot.docs.length - 1]);
          const transformedEntries = entriesSnapshot.docs.map((doc) => {
            const { body, createdAt, author, imageUrl } = doc.data();
            return {
              id: doc.id,
              body,
              author,
              createdAt,
              imageUrl,
            };
          });
          setEntries(entries.concat(transformedEntries));
          setLoadedData(loadedData.concat(transformedEntries));
        }
        else {
          setHasMore(false);
        }
      });
  };

  useEffect(() => {
    const getEntries = async () => {
      await fetchEntries(email);
    };
    getEntries();
  }, [email]);

  useEffect(() => {
    if (selectedDate) {
      const sortedData = loadedData;
      const newDate = selectedDate._d;
      setEntries(
        sortedData.filter((entry) => {
          return (
            moment(entry.createdAt.seconds * 1000)._d.getDate() ===
              newDate.getDate() &&
            moment(entry.createdAt.seconds * 1000)._d.getMonth() ===
              newDate.getMonth()
          );
        })
      );
    }
    // eslint-disable-next-line
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleChange = (event) => {
    const sortedEntries = order(entries, `${event.target.value}`);
    setEntries(sortedEntries);
  };

  const handleViewAll = (e) => {
    e.preventDefault();
    setSelectedDate(null);
    setEntries(loadedData);
  };

  const fetchNextSlot = async () => {
    await fetchMoreData(email);
  };

  return (
    <div className="entries-container">
      <div className="entries-nav">
        <h3 className="entries-header">Your Previous Entries</h3>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="DD/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Go To Date"
            value={selectedDate}
            autoComplete="off"
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        {selectedDate && <Button onClick={handleViewAll}>View All</Button>}
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="age-native-simple">Sort</InputLabel>
          <Select
            native
            onChange={handleChange}
            inputProps={{
              name: 'sort',
              id: 'sort-native',
            }}
          >
            <option value="desc">Latest</option>
            <option value="asc">Oldest</option>
          </Select>
        </FormControl>
      </div>
      <InfiniteScroll
        dataLength={loadedData.length}
        next={fetchNextSlot}
        hasMore={hasMore}
        style={{overflow: "hidden"}}
        loader={<h4 style={{textAlign: 'center', marginBottom: '1rem'}}>Loading...</h4>}
      >
        <Grid container className={classes.root} spacing={2} style={{marginBottom: '1rem'}}>
          {entries ? (
            entries.map((entry) => <Entry key={entry.id} entry={entry} />)
          ) : (
            <div>You don't have any entries</div>
          )}
        </Grid>
      </InfiniteScroll>
    </div>
  );
};

export default Entries;
