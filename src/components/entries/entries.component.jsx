import React, { useEffect, useState } from 'react';
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
  const [sortBy, setSortBy] = React.useState('');

  useEffect(() => {
    const getEntries = async () => {
      const data = await fetchEntries(email);
      setEntries(data);
    };
    getEntries();
  }, [email]);

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <div className="entries-container">
      <div className="entries-nav">
        <h3 className="entries-header">Your Previous Entries</h3>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="age-native-simple">Sort</InputLabel>
          <Select
            native
            value={sortBy}
            onChange={handleChange}
            inputProps={{
              name: 'sort',
              id: 'sort-native',
            }}
          >
            <option aria-label="None" value="" />
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
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
