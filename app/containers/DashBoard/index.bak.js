/**
 *
 * DashBoard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row, Col, Button, Modal, FormGroup, ControlLabel, FormControl, Image } from 'react-bootstrap';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
//import Img from 'components/Img';
import makeSelectDashBoard from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import messagesApp from './../App/messages';
import DefaultImage from 'images/icon-default.png';
//import { SHOW_MODAL, HIDE_MODAL } from './constants';
import './styles.scss';

export class DashBoard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(...args) {
    super(...args);
    this.state = {
      imgUrl: ""
    };
  }

  handleClose = () => {
    //this.props.dispatch({ type: HIDE_MODAL });
  }

  handleShow = () => {
    //this.props.dispatch({ type: SHOW_MODAL });
  }
  onFormSubmit = (event) => {
    if (this.form.checkValidity()) {

    }
    event.preventDefault();
  }

  render() {
    //var defaultImage 
    return (
      <div>

        <Helmet>
          <title>DashBoard</title>
          <meta name="description" content="Description of DashBoard" />
        </Helmet>
        <div className="container">
          <FormattedMessage {...messages.header} />
        </div>
      </div>);
  }
}

DashBoard.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dashboard: makeSelectDashBoard(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'dashBoard', reducer });
const withSaga = injectSaga({ key: 'dashBoard', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DashBoard);
