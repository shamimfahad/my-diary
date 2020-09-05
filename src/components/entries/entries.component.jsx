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

import { fetchEntries } from '../../firebase/firebase.utils';

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
  const [selectedDate, setSelectedDate] = React.useState(null);

  const { email } = currentUser;

  const order = (array, sortBy) => {
    const newArray = orderBy(array, ['createdAt'], [sortBy]);
    return newArray;
  };

  useEffect(() => {
    const getEntries = async () => {
      const data = await fetchEntries(email);
      const sortedData = order(data, 'desc');
      setEntries(sortedData);
      setLoadedData(sortedData);
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
      <Grid container className={classes.root} spacing={2}>
        {entries ? (
          entries.map((entry) => <Entry key={entry.id} entry={entry} />)
        ) : (
          <div>You don't have any entries</div>
        )}
      </Grid>
    </div>
  );
};

export default Entries;
