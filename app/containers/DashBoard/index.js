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
import { SHOW_MODAL, HIDE_MODAL } from './constants';
import './styles.scss';

export class DashBoard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(...args) {
    super(...args);
    this.state = {
      imgUrl: ""
    };
  }

  handleClose = () => {
    this.props.dispatch({ type: HIDE_MODAL });
  }

  handleShow = () => {
    this.props.dispatch({ type: SHOW_MODAL });
  }
  onFormSubmit = (event) => {
    if (this.form.checkValidity()) {

    }
    event.preventDefault();
  }

  renderTest() {
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

  render() {
    //var defaultImage 
    return (
      <div>

        <Helmet>
          <title>DashBoard</title>
          <meta name="description" content="Description of DashBoard" />
        </Helmet>
        <div className="container">
          <Row>
            <Col mdOffset={3} md={6}>
              <Button bsStyle="primary" block
                onClick={this.handleShow}
              ><FormattedMessage {...messages.addPhoto} /></Button>
            </Col>
          </Row>
          <Modal show={this.props.dashboard.showModal} onHide={this.handleClose}>
            <form ref={(form) => { this.form = form }}
              onSubmit={this.onFormSubmit}>

              <Modal.Header>
                <Modal.Title><FormattedMessage {...messages.addPhotoTitle} /></Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <div className="photoContainer">
                  <img className="img-responsive" src={this.state.imgUrl} alt="" onError={(error) => {
                    console.log("loading image error", error);
                    this.setState({
                      imgUrl: DefaultImage
                    });
                  }} />
                </div>
                <FormGroup required>
                  <ControlLabel><FormattedMessage {...messages.photoUrl} /></ControlLabel>
                  <FormControl type="url" inputRef={(imgUrl) => { this.imgUrl = imgUrl }} required
                    onChange={(event) => { this.setState({ imgUrl: event.target.value }) }} />
                </FormGroup>
              </Modal.Body>

              <Modal.Footer>
                <Button onClick={this.handleClose}><FormattedMessage {...messagesApp.cancel} /></Button>
                <Button bsStyle="primary" type="submit"><FormattedMessage {...messagesApp.valid} /></Button>
              </Modal.Footer>
            </form>
          </Modal>
        </div>
      </div>
    );
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
