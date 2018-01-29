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
import { FormattedMessage, injectIntl } from 'react-intl';
import RegisterPage from '../RegisterPage/Loadable';
import { LinkContainer } from 'react-router-bootstrap';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import DashBoard from 'containers/DashBoard/Loadable';
import Header from 'components/Header';
import PrivateRoute from 'components/PrivateRoute/index';
import Footer from 'components/Footer';

import Spinner from 'components/Spinner';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectApp from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { CLEAR_NOTIFICATION } from './constants';
import { Notification } from 'react-notification';
import { setAuth, logoutRequest } from './actions';
import { loadLocalStorage } from 'localStorage';
import { showProgressLog } from 'utils/logger';
import 'bootstrap-social/bootstrap-social.css';


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

  toggleNotification = () => {
    this.props.dispatch({ type: CLEAR_NOTIFICATION });
  }

  renderNotification = () => {
    const { formatMessage } = this.props.intl;

    if (this.props.app.shownotif) {
      return <Notification
        isActive={this.props.app.shownotif}
        activeBarStyle={{ left: "50%", zIndex : 1000 }}
        message={this.props.app.notifmessage}
        action={formatMessage(messages.dissmiss)}
        autoDismiss={5}
        level="success"
        onDismiss={this.toggleNotification}
        onClick={this.toggleNotification}
      />;
    }

    return null;
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
        {
           this.renderNotification()
        }
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
                <Nav>
                  {isLogin ? <LinkContainer to="/dashboard">
                    <NavItem eventKey={uuidv1()}>
                      <FormattedMessage {...messages.dashboard} />
                    </NavItem>
                  </LinkContainer> : null}
                </Nav>

                <Nav pullRight>
                  {isLogin ?
                    <NavItem eventKey={uuidv1()} onClick={this.onLogoutClick}>
                      {this.props.app.loading_logout ? <Spinner /> : null}
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
              {
                //<Route path="/dashboard" component={DashBoard} />
              }

              <PrivateRoute authenticated={isLogin} path="/dashboard" component={DashBoard} />

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
  injectIntl
)(App);
