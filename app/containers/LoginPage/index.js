/**
 *
 * LoginPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row, Col, InputGroup, Glyphicon, FormControl, InputGroupAddon, Button } from 'react-bootstrap';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectLoginPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import messagesApp from '../App/messages';
import { Card } from 'global-styles';
import './styles.scss';

export class LoginPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet>
          <title>LoginPage</title>
          <meta name="description" content="Description of LoginPage" />
        </Helmet>
        <div className="containerfullheight">
          <div className="container flex-row align-items-center">
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
                          inputRef={(email) => { this.email = email; }}
                        />
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroup.Addon>
                          <Glyphicon glyph="lock" />
                        </InputGroup.Addon>
                        <FormControl type="password" placeholder="Password"
                          required />
                      </InputGroup>
                      <Row>
                        <Col sm={6} >
                          <Button bsStyle="primary"><FormattedMessage {...messagesApp.login} /></Button>
                        </Col>
                        <Col sm={6}>
                          <Button bsStyle="link"><FormattedMessage {...messagesApp.forgotpassword} /></Button>
                        </Col>
                      </Row>
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
                          <Button bsStyle="primary" className="active mt-3"><FormattedMessage {...messages.register_now} /> !</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
)(LoginPage);
