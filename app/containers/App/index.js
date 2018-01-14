/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
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


import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectApp from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { setAuth, logoutRequest } from './actions';
import { loadLocalStorage } from 'localStorage';
import { showProgressLog } from 'utils/Logger';
export class App extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    const cacheState = loadLocalStorage();
    const access_token = cacheState.access_token || this.props.app.access_token;
    this.props.dispatch(setAuth(access_token));
  }
  checkPrivateRoute = () => {
    return this.props.app.access_token ? true : false;
  }

  onLogoutClick = () => {
    showProgressLog("onLogoutClick", "onLogoutClick", "App");
    this.props.dispatch(logoutRequest(this.props.app.access_token));
  }

  render() {
    var isLogin = this.checkPrivateRoute();
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
                  {isLogin ? <NavItem eventKey={uuidv1()} onClick={this.onLogoutClick}>
                    <FormattedMessage {...messages.logout} />
                  </NavItem> : null}
                  {!isLogin ? <LinkContainer to="/register">
                    <NavItem eventKey={uuidv1()}>
                      <FormattedMessage {...messages.register} />
                    </NavItem>
                  </LinkContainer > : null}
                  {!isLogin ? <LinkContainer to="/login">
                    <NavItem eventKey={uuidv1()}>
                      <FormattedMessage {...messages.login} />
                    </NavItem>
                  </LinkContainer >
                    : null}
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
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'app', reducer });
const withSaga = injectSaga({ key: 'app', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(App);
