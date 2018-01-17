/**
*
* Gallery
*
*/

import React from 'react';
// import styled from 'styled-components';
import Masonry from 'react-masonry-component';
import Gravatar from 'react-gravatar';
import { FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap';
import messages from './messages';
import './styles.scss';

class Gallery extends React.Component { // eslint-disable-line react/prefer-stateless-function
  handleLayoutComplete = () => {

  }

  componentDidMount = () => {
    this.masonry.on('layoutComplete', this.handleLayoutComplete);
  };

  componentWillUnmount = () => {
    this.masonry.off('layoutComplete', this.handleLayoutComplete);
  }

  onVoteClick = (photoId) => {
    this.props.onVote(photoId);
  }
  render() {
    const onVote = this.props.onVote;
    var childElements = this.props.elements.map(function (element, index) {
      return (
        <div key={index} className="grid-item">
          <img className="grid-img" src={element.url} />
          <div className="description">{element.description}</div>
          <div className="toolbarphoto">
            <Gravatar
              default="https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png" className="img-responsive " email={element.owner.email} />
            <Button bsSize="small"
            onClick={() => { onVote(element._id) }}>
              <span className="glyphicon glyphicon-star"> </span>
              {element.likeCount}
            </Button>
          </div>
        </div>
      );
    });
    return (
      <div>
        <Masonry className="grid"
          ref={function (c) { this.masonry = this.masonry || c.masonry; }.bind(this)}
        >
          {childElements}
        </Masonry>
      </div>
    );
  }
}

Gallery.propTypes = {

};

export default Gallery;
