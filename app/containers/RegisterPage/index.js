/**
 *
 * RegisterPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { Row, Col, FormGroup, FormControl, ControlLabel, Glyphicon, InputGroup, Button } from 'react-bootstrap';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectRegisterPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import messagesApp from '../App/messages';
import styled from 'styled-components';
import './styles.scss';
import 'bootstrap-social/bootstrap-social.css';
import LoadingIndicator from 'components/LoadingIndicator';
import SmallLoadingIndicator from 'components/SmallLoadingIndicator';
import { registerRequest } from './actions';
import { REGISTER_RESET } from './constants';
import Error from 'components/Error';

const RowWrapper = styled.div`
  padding: 4em;
  background: papayawhip;
`;


export class RegisterPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    this.state = {
      passwordnotmatch: false
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: REGISTER_RESET
    });
    this.setState({ passwordnotmatch: false });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    console.log("password ", this.password.value);
    console.log("confirm password ", this.confirmpassword.value);
    if (this.password.value !== this.confirmpassword.value) {
      this.setState({ passwordnotmatch: true });
      return;
    }
    this.props.dispatch(registerRequest({
      password: this.password.value,
      confirmPassword: this.confirmpassword.value,
      email: this.email.value,
    }));
  }
  onInputChange = () => {
    this.props.dispatch({
      type: REGISTER_RESET
    });
    this.setState({ passwordnotmatch: false });
  }

  renderCreateAccountOk = () => {
    const { formatMessage } = this.props.intl;

    return (<div className="App">
      <div className="container">

        <h1>
          <FormattedMessage {...messages.account_created_title} />
        </h1>
        <p>
          <FormattedMessage {...messages.account_created_body } />
          <Link to="/login"> {formatMessage(messagesApp.login)} </Link>
        </p>

      </div>
    </div>);
  }

  render() {
    const { formatMessage } = this.props.intl;
    var { currentlySending } = this.props.registerpage;
    var error = this.props.registerpage.error;
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
    if (this.props.registerpage.accountCreated)
    {
      return this.renderCreateAccountOk();
    }

    return (
      <div>
        <Helmet>
          <title>RegisterPage</title>
          <meta name="description" content="Description of RegisterPage" />
        </Helmet>
        <div className="container">
          <form ref={(form) => { this.form = form; }}
            onSubmit={this.handleSubmit}>
            <Row>
              <Col className="registerContainer" md={6} mdOffset={3} sm={12}>
                {currentlySending ? <SmallLoadingIndicator /> : null}
                <FormGroup>
                  <ControlLabel><FormattedMessage {...messagesApp.email} /></ControlLabel>
                  <InputGroup>
                    <InputGroup.Addon>
                      <Glyphicon glyph="user" />
                    </InputGroup.Addon>
                    <FormControl type="email" required
                      inputRef={(email) => { this.email = email; }}
                      disabled={currentlySending}
                      onChange={this.onInputChange} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <ControlLabel><FormattedMessage {...messagesApp.password} /></ControlLabel>
                  <InputGroup>
                    <InputGroup.Addon>
                      <Glyphicon glyph="lock" />
                    </InputGroup.Addon>
                    <FormControl type="password" required
                      inputRef={(password) => { this.password = password; }}
                      disabled={currentlySending}
                      onChange={this.onInputChange} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <ControlLabel><FormattedMessage {...messagesApp.confirmpassword} /></ControlLabel>
                  <InputGroup>
                    <InputGroup.Addon>
                      <Glyphicon glyph="lock" />
                    </InputGroup.Addon>
                    <FormControl type="password" required
                      inputRef={(confirmpassword) => { this.confirmpassword = confirmpassword; }}
                      disabled={currentlySending}
                      onChange={this.onInputChange} />
                  </InputGroup>
                </FormGroup>
                {this.state.passwordnotmatch ? <Error> <FormattedMessage {...messages.passwordnotmatch} /> </Error> : null}
                { errorLabel ? <Error>  {errorLabel}  </Error> : null}
                <Button bsSize="large" block type="submit"
                  disabled={currentlySending}>
                  {formatMessage(messagesApp.createaccount)}
                </Button>
                <br />
                <Row>
                  <Col md={6}>
                    <button className="btn-lg btn-block btn-social btn-facebook"
                      disabled={currentlySending}>
                      <span className="fa fa-facebook"></span>
                      Facebook
                    </button>
                  </Col>
                  <Col md={6}>
                    <button className="btn-social btn-lg btn-twitter btn-block"
                      disabled={currentlySending}>
                      <span className="fa fa-twitter"></span>
                      Twitter
                  </button>
                  </Col>
                </Row>
              </Col>

            </Row>
          </form>
        </div>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  registerpage: makeSelectRegisterPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'registerPage', reducer });
const withSaga = injectSaga({ key: 'registerPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl
)(RegisterPage);
