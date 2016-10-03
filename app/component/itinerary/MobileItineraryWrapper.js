import React from 'react';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { FormattedMessage } from 'react-intl';
import { supportsHistory } from 'history/lib/DOMUtils';
import SwipeableViews from 'react-swipeable-views';

import { getRoutePath } from '../../util/path';

export default class MobileItineraryWrapper extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
  };

  state = {
    lat: undefined,
    lon: undefined,
    fullscreen: false,
  };

  getTabs(itineraries, selectedIndex) {
    return itineraries.map((itinerary, i) => (
      <Tab
        selected={i === selectedIndex}
        key={i}
        label="•"
        value={i}
        className={i === selectedIndex ? 'itinerary-tab-root--selected' : 'itinerary-tab-root'}
        style={{
          height: 'auto',
          color: i === selectedIndex ? '#007ac9' : '#ddd',
          fontSize: '34px',
          padding: '0px',
        }}
      />
    ));
  }

  getFullscreen = () => {
    if (typeof window !== 'undefined' && supportsHistory()) {
      const state = this.context.location.state;
      return state && state.fullscreen;
    }

    return this.state && this.state.fullscreen;
  };

  toggleFullscreenMap = () => {
    if (supportsHistory()) {
      if (this.context.location.state && this.context.location.state.fullscreen) {
        return this.context.router.goBack();
      }
      return this.context.router.push({
        state: {
          fullscreen: true,
        },
        pathname: this.context.location.pathname,
      });
    }
    return this.setState({ fullscreen: !this.state.fullscreen });
  };

  focusMap = (lat, lon) => this.setState({ lat, lon })

  switchSlide = (index) => {
    this.context.router.replace({
      state: { summaryPageSelected: index },
      pathname: `${getRoutePath(this.props.params.from, this.props.params.to)}/${index}` });
    const itineraryTab = this.refs[`itineraryTab${index}`];

    if (itineraryTab && itineraryTab.state) {
      this.focusMap(itineraryTab.state.lat, itineraryTab.state.lon);
    }
  }

  render() {
    const index = parseInt(this.props.params.hash, 10) || 0;

    if (!this.props.children) {
      return (
        <div className="itinerary-no-route-found">
          <FormattedMessage
            id="no-route-msg"
            defaultMessage={`
              Unfortunately no route was found between the locations you gave.
              Please change origin and/or destination address.
            `}
          />
        </div>
      );
    }

    const swipe = this.getFullscreen() ? undefined : (
      <SwipeableViews
        index={index}
        key="swipe"
        className="itinerary-swipe-views-root"
        slideStyle={{ minHeight: '100%' }}
        containerStyle={{ minHeight: '100%' }}
        onChangeIndex={(idx) => setTimeout(this.switchSlide, 500, idx)}
      >
        {this.props.children}
      </SwipeableViews>);
    const tabs = this.getFullscreen() ? undefined : (
      <div className="itinerary-tabs-container" key="tabs">
        <Tabs
          onChange={this.switchSlide}
          value={index}
          tabItemContainerStyle={{
            backgroundColor: '#eef1f3',
            lineHeight: '18px',
            width: '60px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          inkBarStyle={{ display: 'none' }}
        >
          {this.getTabs(this.props.children, index)}
        </Tabs>
      </div>);

    return (
      <ReactCSSTransitionGroup
        transitionName="itinerary-container-content"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
        component="div"
        className="itinerary-container-content"
        onTouchStart={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      >
        {swipe}
        {tabs}
      </ReactCSSTransitionGroup>
    );
  }
}