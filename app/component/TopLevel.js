import React from 'react';
import Helmet from 'react-helmet';
import { intlShape } from 'react-intl';
import meta from '../meta';
import configureMoment from '../util/configure-moment';
import AppBarContainer from './navigation/AppBarContainer';
import MobileView from './MobileView';
import DesktopView from './DesktopView';
import MessageBar from './navigation/MessageBar';

class TopLevel extends React.Component {
  static propTypes = {
    location: React.PropTypes.object.isRequired,
    children: React.PropTypes.node,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    header: React.PropTypes.node,
    map: React.PropTypes.node,
    content: React.PropTypes.node,
    title: React.PropTypes.node,
    meta: React.PropTypes.node,
    routes: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        topBarOptions: React.PropTypes.object,
      }).isRequired
    ).isRequired,
  }

  static contextTypes = {
    getStore: React.PropTypes.func.isRequired,
    intl: intlShape,
  };

  static childContextTypes = {
    location: React.PropTypes.object,
    breakpoint: React.PropTypes.string.isRequired,
  };

  getChildContext() {
    return {
      location: this.props.location,
      breakpoint: this.getBreakpoint(),
    };
  }

  getBreakpoint = () =>
    (!this.props.width && 'none') ||
    (this.props.width < 400 && 'small') ||
    (this.props.width < 900 && 'medium') ||
    'large'

  render() {
    configureMoment(this.context.intl.locale);
    const metadata = meta(this.context.intl.locale);
    const topBarOptions = Object.assign({}, ...this.props.routes.map(route => route.topBarOptions));

    let content;

    if (this.props.children || !(this.props.map || this.props.header)) {
      content = this.props.children || this.props.content;
    } else if (this.props.width < 900) {
      content = (
        <MobileView
          map={this.props.map}
          content={this.props.content}
          header={this.props.header}
        />
     );
    } else if (this.props.width >= 900) {
      content = (
        <DesktopView
          map={this.props.map}
          content={this.props.content}
          header={this.props.header}
        />
      );
    }

    return (
      <div className="fullscreen flex-vertical">
        <AppBarContainer title={this.props.title} {...topBarOptions} />
        <MessageBar />
        <Helmet {...metadata} />
        <section ref="content" className="content">
          {this.props.meta}
          { content }
        </section>
      </div>
    );
  }
}

export default TopLevel;
