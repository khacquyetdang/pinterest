/**
 *
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectHomePage from './selectors';
import { makeSelectLocale } from './../LanguageProvider/selectors';
import LoadingIndicator from 'components/LoadingIndicator';
import Gallery from 'components/Gallery';

import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { getPhotoRequest } from './actions';
import { votePhotoRequest } from './../App/actions';
export class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    console.log("HomePage did mount");
    this.props.dispatch(getPhotoRequest(this.props.locale));
  }

  vote = (photoId) => {
    this.props.dispatch(votePhotoRequest(photoId));
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>HomePagechange</title>
          <meta name="description" content="Description of HomePage" />
        </Helmet>
        <div className="container">
          {this.props.homepage.loading ? <LoadingIndicator /> : null}
          <Gallery elements={this.props.homepage.photos}
            onVote={this.vote} />
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  homepage: makeSelectHomePage(),
  locale: makeSelectLocale()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'homePage', reducer });
const withSaga = injectSaga({ key: 'homePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
