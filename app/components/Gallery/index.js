/**
*
* Gallery
*
*/

import React from 'react';
// import styled from 'styled-components';
import Masonry from 'react-masonry-component';

import { FormattedMessage } from 'react-intl';
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

  render() {
    var childElements = this.props.elements.map(function (element, index) {
      return (
        <div key={index} className="grid-item">
          <img src={element.url} />
          <div className="description">{element.description}</div>
        </div>
      );
    });
    return (
      <div>
        <Masonry
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
