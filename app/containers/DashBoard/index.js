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
import Spinner from 'components/Spinner';
import injectReducer from 'utils/injectReducer';
//import Img from 'components/Img';
import makeSelectDashBoard from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import messagesApp from './../App/messages';
import DefaultImage from 'images/icon-default.png';
import { SHOW_MODAL, HIDE_MODAL, CLEAR_PHOTO_ERROR, GET_PHOTOS_REQUEST, SET_ID_USER } from './constants';
import { CLEAR_NOTIFICATION } from '../App/constants';
import Error from 'components/Error';
import { addPhotoRequest, deletePhotoRequest } from './actions';
import { votePhotoRequest } from '../App/actions';
import LoadingIndicator from 'components/LoadingIndicator';
import Gallery from 'components/Gallery';
import './styles.scss';
import { loadLocalStorage } from 'localStorage';


export class DashBoard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(...args) {
    super(...args);
    this.state = {
      imgUrl: ""
    };
  }
  componentDidMount() {
    const cacheState = loadLocalStorage();
    const id_user = cacheState.id_user;
    this.props.dispatch({type: SET_ID_USER, id_user});

    this.props.dispatch({ type: GET_PHOTOS_REQUEST });
  }
  handleClose = () => {
    if (!this.props.dashboard.loading)
      this.props.dispatch({ type: HIDE_MODAL });
  }

  handleShow = () => {
    this.setState({
      imgUrl: ""
    });
    this.props.dispatch({ type: SHOW_MODAL });
  }
  onFormSubmit = (event) => {
    if (this.form.checkValidity()) {
      this.props.dispatch(addPhotoRequest(this.imgUrl.value, this.descriptionInput.value));
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
  vote = (photoId) => {
    this.props.dispatch(votePhotoRequest(photoId));
  }

  delete = (photoId) => {
    this.props.dispatch(deletePhotoRequest(photoId));
  }

  render() {
    //var defaultImage 
    var errorUrl = null;
    if (this.props.dashboard.error && this.props.dashboard.error.form) {
      this.props.dashboard.error.form.forEach(function (error) {
        if (error.param === "url") {
          errorUrl = error.msg;
        }
      });
    }
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
          <br />
          {this.props.dashboard.loading ? <LoadingIndicator /> : null}
          {
            this.props.dashboard.photos.length === 0 ? <h1 className="text-center"><FormattedMessage {...messages.userHaveNoPhoto} /></h1> :
              <Gallery elements={this.props.dashboard.photos}
                onVote={this.vote} onDelete={this.delete} />
          }
          <Modal show={this.props.dashboard.showModal} onHide={this.handleClose}>
            <form ref={(form) => { this.form = form }}
              onSubmit={this.onFormSubmit}>

              <Modal.Header>
                <Modal.Title><FormattedMessage {...messages.addPhotoTitle} /></Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <div className="photoContainer">
                  <img className="center-cropped" src={this.state.imgUrl} alt="" onError={(error) => {
                    console.log("loading image error", error);
                    this.setState({
                      imgUrl: DefaultImage
                    });
                  }} />
                </div>
                <FormGroup required>
                  <ControlLabel><FormattedMessage {...messages.photoUrl} /></ControlLabel>
                  <FormControl type="url" inputRef={(imgUrl) => { this.imgUrl = imgUrl }} required
                    onChange={(event) => { this.setState({ imgUrl: event.target.value }) }}
                    disabled={this.props.dashboard.loading} />
                  {errorUrl ? <Error> {errorUrl} </Error> : null}
                </FormGroup>
                <FormGroup>
                  <ControlLabel><FormattedMessage {...messages.description} /></ControlLabel>
                  <FormControl
                    type="textarea" inputRef={(descriptionInput) => { this.descriptionInput = descriptionInput }} required
                    onChange={(event) => { this.props.dispatch({ type: CLEAR_PHOTO_ERROR }) }}
                    disabled={this.props.dashboard.loading} />
                </FormGroup>

              </Modal.Body>

              <Modal.Footer>
                <Button onClick={this.handleClose} disabled={this.props.dashboard.loading}><FormattedMessage {...messagesApp.cancel} /></Button>
                <Button bsStyle="primary" type="submit" disabled={this.props.dashboard.loading}>
                  {this.props.dashboard.loading ? <Spinner /> : null}
                  <FormattedMessage {...messagesApp.valid} />
                </Button>
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
