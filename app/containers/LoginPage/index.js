/**
 *
 * LoginPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row, Col, InputGroup, Glyphicon, FormControl, InputGroupAddon, Button, Modal } from 'react-bootstrap';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectLoginPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import messagesApp from '../App/messages';
import { Card } from 'global-styles';
import './styles.scss';
import Spinner from 'components/Spinner';
import LoadingIndicator from 'components/LoadingIndicator';
import SmallLoadingIndicator from 'components/SmallLoadingIndicator';
import { loginRequest } from './actions';
import { LOGIN_RESET, LOGIN_FACEBOOK_REQUEST } from './constants';
import Error from 'components/Error';
import makeSelectApp from '../App/selectors';
import { Redirect } from 'react-router-dom';
//import Modal from 'react-modal';
import FacebookLogin from 'react-facebook-login';


export class LoginPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  onInputChange = () => {
    this.props.dispatch({
      type: LOGIN_RESET
    });
  }
  responseFacebook = (response) => {
    console.log(response);
    if (response.accessToken) {
      this.props.dispatch({ type: LOGIN_FACEBOOK_REQUEST, access_token: response.accessToken });
    }
  }

  loginWithFaceBookClick = () => {
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("password ", this.password.value);
    console.log("email ", this.email.value);
    if (this.form.checkValidity()) {
      this.props.dispatch(loginRequest({
        email: this.email.value,
        password: this.password.value,
      }));
    }
  }

  render() {

    if (this.props.app.access_token) {
      return <Redirect to={{ pathname: '/', state: { from: this.props.location } }} />;
    }
    const { formatMessage } = this.props.intl;

    var error = this.props.loginpage.error;

    var isDisable = this.props.loginpage.currentlySending;
    var errorLabel = undefined;
    if (error) {
      if (error.form) {
        errorLabel = error.form.reduce((accu, item) => {
          accu = accu + item.msg;
          return accu;
        }, "");
      }
      if (error.msg) {
        errorLabel = error.msg;
      }
    }

    return (
      <div>
        <Helmet>
          <title>LoginPage</title>
          <meta name="description" content="Description of LoginPage" />
        </Helmet>

        <div className="containerfullheight">
          <div className="container flex-row align-items-center">
            <form
              onSubmit={this.handleSubmit}
              ref={(form) => { this.form = form }}>
              <Row className="justify-content-center">
                <Col md={8} mdOffset={2} sm={12}>
                  <div className="card-group">
                    <div className="card">
                      <div className="card-body">
                        <h1><FormattedMessage {...messages.login} /></h1>
                        <p className="text-muted"><FormattedMessage {...messages.connect_to_account} /></p>
                        <InputGroup className="mb-3">
                          <InputGroup.Addon>
                            <Glyphicon glyph="user" />
                          </InputGroup.Addon>
                          <FormControl type="email" required
                            placeholder={formatMessage(messagesApp.email)}
                            disabled={isDisable}
                            onChange={this.onInputChange}
                            inputRef={(email) => { this.email = email; }}
                          />
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroup.Addon>
                            <Glyphicon glyph="lock" />
                          </InputGroup.Addon>
                          <FormControl type="password" placeholder={formatMessage(messagesApp.password)}
                            disabled={isDisable}
                            onChange={this.onInputChange}
                            inputRef={(password) => { this.password = password; }}
                            required />
                        </InputGroup>
                        <Row>
                          <Col sm={6} >
                            <Button bsStyle="primary" className="mt-3" block
                              type="submit"
                              disabled={isDisable}>
                              {this.props.loginpage.currentlySending ? <Spinner /> : null}
                              {"  "}
                              <FormattedMessage {...messagesApp.login} /></Button>
                          </Col>
                          <Col sm={6}>
                            <Button bsStyle="link" className="mt-3"
                              disabled={isDisable}
                              block><FormattedMessage {...messagesApp.forgotpassword} /></Button>
                          </Col>
                        </Row>

                        {errorLabel ? <Error>  {errorLabel}  </Error> : null}

                      </div>
                    </div>
                    <div className="card text-white bg-primary">
                      <div className="card-body">
                        <div className="text-center">
                          <div>
                            <h2><FormattedMessage {...messagesApp.register} /></h2>
                            <h3>
                              <p><FormattedMessage {...messages.not_register_yet} /></p>
                            </h3>
                            <Button
                              disabled={isDisable}
                              bsStyle="primary" className="active mt-3"><FormattedMessage {...messages.register_now} /> !</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </form>
            <Row>
              <Col>
                <FacebookLogin
                  appId="1962217017377151"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={this.responseFacebook}
                  textButton="Facebook"
                  cssClass="btn-lg btn-block btn-social btn-facebook mt-3"
                  icon="fa-facebook"
                />
              </Col>
            </Row>

          </div>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loginpage: makeSelectLoginPage(),
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'loginPage', reducer });
const withSaga = injectSaga({ key: 'loginPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl
)(LoginPage);
