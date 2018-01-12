/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import uuidv1 from 'uuid/v1';
import { FormattedMessage } from 'react-intl';
import RegisterPage from '../RegisterPage/Loadable';
import { LinkContainer } from 'react-router-bootstrap';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import messages from './messages';

export default function App() {
  return (
    <div>
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
      >
        <meta name="description" content="A React.js Boilerplate application" />
      </Helmet>
      <Router>
        <div>
          <Navbar collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/"> Pinterest clone </Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                <LinkContainer to="/register">
                  <NavItem eventKey={uuidv1()}>
                    <FormattedMessage {...messages.register} />
                  </NavItem>
                </LinkContainer >
                <LinkContainer to="/login">
                  <NavItem eventKey={uuidv1()}>
                    <FormattedMessage {...messages.login} />
                  </NavItem>
                </LinkContainer >

              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/features" component={FeaturePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="" component={NotFoundPage} />
          </Switch>
          <Footer />
        </div>
      </Router>
    </div>
  );
}
