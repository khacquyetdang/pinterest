/**
*
* Gallery
*
*/

import React from 'react';
// import styled from 'styled-components';
import Masonry from 'react-masonry-component';
import Gravatar from 'react-gravatar';
import {FormattedMessage} from 'react-intl';
import {Button, Modal} from 'react-bootstrap';
import messages from './messages';
import messagesApp from './../../containers/App/messages';
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
import './styles.scss';

class Gallery extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    var images = props
      .elements
      .map((element, index) => {
        return {src: element.url, alt: element.description, id: element._id}
      });

    this.state = {
      deleteId: "",
      viewerVisible: false,
      activeIndex: 0,
      images: images
    };

  }
  handleLayoutComplete = () => {}

  componentDidMount = () => {
    this
      .masonry
      .on('layoutComplete', this.handleLayoutComplete);
  };
  componentWillReceiveProps(nextProps) {
    var images = nextProps
      .elements
      .map((element, index) => {
        return {src: element.url, alt: element.description, id: element._id}
      });

    this.setState({images: images});
  }
  componentWillUnmount = () => {
    this
      .masonry
      .off('layoutComplete', this.handleLayoutComplete);
  }

  onVoteClick = (photoId) => {
    this
      .props
      .onVote(photoId);
  }
  onDeleteClick = (photoId) => {
    this.setState({deleteId: photoId});
  }
  onDeleteConfirm = () => {
    this
      .props
      .onDelete(this.state.deleteId);
    this.setState({deleteId: ""});
  }

  handleHide = () => {
    this.setState({deleteId: ""});
  }
  handleClick = (imgId) => {
    console.log("mansory item click ", imgId);
    const activeIndex = this
      .state
      .images
      .findIndex(img => img.id === imgId);
    this.setState({viewerVisible: true, activeIndex: activeIndex});
  };
  render() {
    const onVote = this.props.onVote;
    const onDelete = this.props.onDelete;
    const onDeleteClick = this.onDeleteClick;

    var childElements = this
      .props
      .elements
      .map((element, index) => {
        return (
          <div key={index} className="grid-item">
            <img
              className="grid-img"
              onClick={() => this.handleClick(element._id)}
              src={element.url}/>
            <div className="description">{element.description}</div>
            <div className="toolbarphoto">
              <Gravatar
                default="https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"
                className="img-responsive "
                email={element.owner.email}/> {onDelete
                ? <Button
                    bsSize="small"
                    onClick={() => {
                    onDeleteClick(element._id)
                  }}>
                    <span className="glyphicon glyphicon-trash"></span>
                  </Button>
                : null}

              <Button
                bsSize="small"
                onClick={() => {
                onVote(element._id)
              }}>
                <span className="glyphicon glyphicon-star"></span>
                {element.likeCount}
              </Button>
            </div>
          </div>
        );
      });
    return (
      <div>
        <Masonry
          className="grid"
          ref={function (c) {
          this.masonry = this.masonry || c.masonry;
        }.bind(this)}>
          {childElements}
        </Masonry>
        <Viewer
          visible={this.state.viewerVisible}
          activeIndex={this.state.activeIndex}
          onClose={() => {
          this.setState({viewerVisible: false});
        }}
          images={this.state.images}/>
        <Modal show={this.state.deleteId !== ""} onHide={this.handleHide}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FormattedMessage {...messages.deleteTitle}/>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h1>
              <FormattedMessage {...messages.deleteConfirm }/>
            </h1>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.handleHide}>
              <FormattedMessage {...messagesApp.cancel }/>
            </Button>
            <Button bsStyle="danger" onClick={this.onDeleteConfirm}>
              <FormattedMessage {...messagesApp.valid }/>
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

Gallery.propTypes = {};

export default Gallery;
