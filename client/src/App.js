import React, { Component } from 'react';

import { ApolloProvider } from 'react-apollo';
import client from './client';

import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import Dashboard from './components/Dashboard';
import BoothRegister from './components/BoothRegister';
import BoothLogin from './components/BoothLogin';
import Navigation from './components/Navigation';
import StudentSignup from './components/StudentSignup';
import Landing from './components/Landing';
import Account from './components/Account';
import Candidate from './components/Candidate';
import Scan from './components/Scan';
import CheckIn from './components/CheckIn';

import * as auth from './auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.getToken() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

/**
 * Root component of application
 */
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Container id="main">
            <Navigation />
            <Route exact path='/' component={Landing} />
            <Route path='/register' component={BoothRegister} />
            <Route path='/login' component={BoothLogin} />
            <PrivateRoute path='/dashboard' component={Dashboard} /> 
            <PrivateRoute path='/account' component={Account} />
            <PrivateRoute exact path='/candidate/:id' component={Candidate} />
            <PrivateRoute exact path='/candidate/:id/add' component={CheckIn} />
            <PrivateRoute path='/scan' component={Scan} />
            <Route path='/student/signup' component={StudentSignup} />
          </Container>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
