import React, { useEffect, useState } from 'react';
import { orderBy } from 'lodash';
import './entries.styles.scss';
import Entry from '../entry/entry.component';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
  const [entries, setEntries] = useState([]);
  const { email } = currentUser;

  const order = (array, sortBy) => {
    const newArray = orderBy(array, ['createdAt'], [sortBy]);
    return newArray;
  }

  useEffect(() => {
    const getEntries = async () => {
      const data = await fetchEntries(email);
      const sortedData = order(data, 'desc');
      setEntries(sortedData);
    };
    getEntries();
  }, [email]);

  const handleChange = (event) => {
    const sortedEntries = order(entries, `${event.target.value}`);
    setEntries(sortedEntries);
  };

  return (
    <div className="entries-container">
      <div className="entries-nav">
        <h3 className="entries-header">Your Previous Entries</h3>
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
        { entries ? 
          entries.map((entry) => (
            <Entry key={entry.id} entry={entry} />
          ))
          : <div>You don't have any entries</div>
        }
      </Grid>
    </div>
  );
};

export default Entries;
