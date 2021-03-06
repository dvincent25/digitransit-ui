import React, { Component, PropTypes } from 'react';
import GeolocationBar from './GeolocationBar';
import SearchInputContainer from './SearchInputContainer';

export default class GeolocationOrInput extends Component {
  static propTypes = {
    useCurrentPosition: PropTypes.bool,
    initialValue: SearchInputContainer.propTypes.initialValue,
    type: SearchInputContainer.propTypes.type,
    onSuggestionSelected: SearchInputContainer.propTypes.onSuggestionSelected,
  }

  state = {
    geolocation: false,
  };

  componentWillMount() {
    this.setState({ geolocation: this.props.useCurrentPosition });
  }

  disableGeolocation = () => {
    this.setState({ geolocation: false });
    this.searchInput.focus();
  };

  render() {
    const child = this.state.geolocation === false ? null :
      <GeolocationBar
        geolocation={{ hasLocation: true }}
        onClick={this.disableGeolocation}
      />;

    return (
      <SearchInputContainer
        ref={(c) => { this.searchInput = c; }}
        {...this.props}
      >
        {child}
      </SearchInputContainer>
    );
  }
}
