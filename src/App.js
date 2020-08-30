import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './components/index/index.component';
import UserIcon from './components/user-icon/user-icon.component';
import SignInAndSignUp from './components/sign-in-and-sign-up/sign-in-and-sign-up.component';
import Entries from './components/entries/entries.component';

import { auth, createUserProfileDocument } from './firebase/firebase.utils';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot((snapshot) => {
          this.setState({
            currentUser: {
              id: snapshot.id,
              ...snapshot.data(),
            },
          });
        });
      }
      this.setState({ currentUser: userAuth });
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }
  render() {
    return (
      <div className="app">
        {this.state.currentUser ? <UserIcon currentUser={this.state.currentUser} /> : null}
        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              this.state.currentUser ? (
                <Index currentUser={this.state.currentUser} />
              ) : (
                <SignInAndSignUp />
              )
            }
          />
          <Route
            path="/entries"
            render={() =>
              this.state.currentUser ? (
                <Entries currentUser={this.state.currentUser} />
              ) : (
                <SignInAndSignUp />
              )
            }
          />
        </Switch>
      </div>
    );
  }
}

export default App;
