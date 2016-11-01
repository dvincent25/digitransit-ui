import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import connectToStores from 'fluxible-addons-react/connectToStores';
import some from 'lodash/some';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import DepartureListHeader from '../component/departure/DepartureListHeader';
import DepartureListContainer from '../component/departure/DepartureListContainer';

const DepartureListContainerWithProps = mapProps(props => ({
  stoptimes: props.stop.stoptimes,
  key: 'departures',
  className: 'stop-page momentum-scroll',
  routeLinks: true,
  infiniteScroll: true,
  isTerminal: !(props.params.stopId),
  rowClasses: 'padding-normal border-bottom',
}))(DepartureListContainer);

const StopPage = getContext({ breakpoint: React.PropTypes.string.isRequired })(props => (
  some(props.routes, 'fullscreenMap') && props.breakpoint !== 'large' ? null : (
    <div className="stop-page-content-wrapper content">
      <DepartureListHeader />
      <DepartureListContainerWithProps {...props} />
    </div>
  )));

const StopPageContainer = Relay.createContainer(StopPage, {
  fragments: {
    stop: () => Relay.QL`
      fragment on Stop {
        stoptimes: stoptimesForServiceDate(date: $date) {
          ${DepartureListContainer.getFragment('stoptimes')}
        }
      }
    `,
  },

  initialVariables: {
    date: moment().format('YYYYMMDD'),
  },
});

export default connectToStores(StopPageContainer, ['TimeStore', 'FavouriteStopsStore'],
  ({ getStore }) => ({
    date: getStore('TimeStore').getCurrentTime().format('YYYYMMDD'),
  }));
