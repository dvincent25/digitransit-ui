import React from 'react';
import { intlShape, FormattedMessage } from 'react-intl';
import range from 'lodash/range';
import xor from 'lodash/xor';
import without from 'lodash/without';

import Slider from '../util/Slider';
import ToggleButton from '../util/ToggleButton';
import ModeFilter from '../util/ModeFilter';
import Select from '../util/select';
import config from '../../config';

class CustomizeSearch extends React.Component {

  static contextTypes = {
    intl: intlShape.isRequired,
    router: React.PropTypes.shape({
      replace: React.PropTypes.func.isRequired,
    }).isRequired,
    location: React.PropTypes.shape({
      query: React.PropTypes.object.isRequired,
    }).isRequired,
  };

  static propTypes = {
    open: React.PropTypes.bool,
    params: React.PropTypes.shape({
      from: React.PropTypes.string,
      to: React.PropTypes.string,
    }).isRequired,
  };

  /*
      This function is used to map our desired min, max, and default values to a standard
      amount of steps on the UI sliders. This allows us to always keep the default values
      in the slider midpoint.

      The ranges below and above the default value are divided into even steps, after which
      the two ranges are combined into a single array of desired values.
  */
  getSliderStepsArray(min, max, defaultValue, stepCount = 20) {
    const denom = stepCount / 2;
    const lowStep = (defaultValue - min) / denom;
    const lowRange = range(min, defaultValue, lowStep);
    const highStep = (max - defaultValue) / denom;
    const highRange = range(defaultValue, max, highStep);
    const sliderSteps = lowRange.concat(highRange.concat(max));
    return sliderSteps;
  }

  getWalkReluctanceSlider = () => {
    // TODO: connect to this.context.getStore('ItinerarySearchStore').getWalkReluctance()

    const walkReluctanceSliderValues = this.getSliderStepsArray(0.8, 10, 2).reverse();

    return (<section className="offcanvas-section">
      <Slider
        headerText={this.context.intl.formatMessage({
          id: 'walking',
          defaultMessage: 'Walking',
        })}
        defaultValue={10}
        onSliderChange={e => this.updateSettings(
          'walkReluctance',
          walkReluctanceSliderValues[e.target.value]
        )}
        min={0}
        max={20}
        step={1}
        minText={this.context.intl.formatMessage({
          id: 'avoid-walking',
          defaultMessage: 'Avoid walking',
        })}
        maxText={this.context.intl.formatMessage({
          id: 'prefer-walking',
          defaultMessage: 'Prefer walking',
        })}
      />
    </section>);
  }

  getWalkBoardCostSlider = () => {
    // TODO: connect to this.context.getStore('ItinerarySearchStore').getWalkBoardCost()

    const walkBoardCostSliderValues = this.getSliderStepsArray(1, 1800, 600).reverse().map(
      num => Math.round(num));

    return (
      <section className="offcanvas-section">
        <Slider
          headerText={this.context.intl.formatMessage({
            id: 'transfers',
            defaultMessage: 'Transfers',
          })}
          defaultValue={10}
          onSliderChange={e => this.updateSettings(
            'walkBoardCost',
            walkBoardCostSliderValues[e.target.value]
          )}
          min={0}
          max={20}
          step={1}
          minText={this.context.intl.formatMessage({
            id: 'avoid-transfers',
            defaultMessage: 'Avoid transfers',
          })}
          maxText={this.context.intl.formatMessage({
            id: 'transfers-allowed',
            defaultMessage: 'Transfers allowed',
          })}
        />
      </section>);
  }

  getTransferMarginSlider = () => {
    // TODO: connect to this.context.getStore('ItinerarySearchStore').getMinTransferTime()

    const transferMarginSliderValues = this.getSliderStepsArray(60, 660, 180).map(
      num => Math.round(num));

    return (
      <section className="offcanvas-section">
        <Slider
          headerText={this.context.intl.formatMessage({
            id: 'transfers-margin',
            defaultMessage: 'Transfer margin',
          })}
          defaultValue={10}
          onSliderChange={e => this.updateSettings(
            'minTransferTime',
            transferMarginSliderValues[e.target.value]
          )}
          min={0}
          max={20}
          step={1}
          minText={this.context.intl.formatMessage({
            id: 'no-transfers-margin',
            defaultMessage: 'None',
          })}
          maxText={this.context.intl.formatMessage({
            id: 'long-transfers-margin',
            defaultMessage: 'Very long',
          })}
        />
      </section>);
  }

  getWalkSpeedSlider = () => {
    // TODO: connect to this.context.getStore('ItinerarySearchStore').getWalkSpeed()

    const walkingSpeedSliderValues = this.getSliderStepsArray(0.5, 3, 1.2);

    return (
      <section className="offcanvas-section">
        <Slider
          headerText={this.context.intl.formatMessage({
            id: 'walking-speed',
            defaultMessage: 'Walking speed',
          })}
          defaultValue={10}
          onSliderChange={e => this.updateSettings(
            'walkSpeed',
            walkingSpeedSliderValues[e.target.value]
          )}
          min={0}
          max={20}
          step={1}
          minText={this.context.intl.formatMessage({
            id: 'slow',
            defaultMessage: 'Slow',
          })}
          maxText={this.context.intl.formatMessage({
            id: 'run',
            defaultMessage: 'Run',
          })}
        />
      </section>);
  }

  getTicketSelector = () => (
    <section className="offcanvas-section">
      <Select
        headerText={this.context.intl.formatMessage({
          id: 'zones',
          defaultMessage: 'Zones',
        })}
        name="ticket"
        selected={this.context.location.query.ticketOption || '0'}
        options={config.ticketOptions}
        onSelectChange={e => this.updateSettings(
          'ticketOption',
          e.target.value
        )}
      />
    </section>);

  getAccessibilitySelector = () => (
    <section className="offcanvas-section">
      <Select
        headerText={this.context.intl.formatMessage({
          id: 'accessibility',
          defaultMessage: 'Accessibility',
        })}
        name="accessible"
        selected={this.context.location.query.accessibilityOption || '0'}
        options={config.accessibilityOptions}
        onSelectChange={e => this.updateSettings(
          'accessibilityOption',
          e.target.value
        )}
      />
    </section>);

  getModes() {
    if (this.context.location.query.modes) {
      return decodeURI(this.context.location.query.modes).split(',');
    }
    return this.getDefaultModes();
  }

  getMode(mode) {
    return this.getModes().includes(mode.toUpperCase());
  }

  getDefaultModes() {
    return [
      ...Object.keys(config.transportModes)
        .filter(mode => config.transportModes[mode].defaultValue).map(mode => mode.toUpperCase()),
      ...Object.keys(config.streetModes)
        .filter(mode => config.streetModes[mode].defaultValue).map(mode => mode.toUpperCase()),
    ];
  }

  updateSettings(name, value) {
    this.context.router.replace({
      ...this.context.location,
      pathname: `/reitti/${this.props.params.from}/${this.props.params.to}`,
      query: { ...this.context.location.query, [name]: value },
    });
  }

  toggleTransportMode(mode, otpMode) {
    this.context.router.replace({
      ...this.context.location,
      pathname: `/reitti/${this.props.params.from}/${this.props.params.to}`,
      query: {
        ...this.context.location.query,
        modes: xor(this.getModes(), [(otpMode || mode).toUpperCase()]).join(','),
      },
    });
  }

  toggleStreetMode(mode) {
    this.context.router.replace({
      ...this.context.location,
      pathname: `/reitti/${this.props.params.from}/${this.props.params.to}`,
      query: {
        ...this.context.location.query,
        modes:
          without(this.getModes(), ...Object.keys(config.streetModes).map(m => m.toUpperCase()))
            .concat(mode.toUpperCase())
            .join(','),
      },
    });
  }

  actions = {
    toggleBusState: () => this.toggleTransportMode('bus'),
    toggleTramState: () => this.toggleTransportMode('tram'),
    toggleRailState: () => this.toggleTransportMode('rail'),
    toggleSubwayState: () => this.toggleTransportMode('subway'),
    toggleFerryState: () => this.toggleTransportMode('ferry'),
    toggleCitybikeState: () => this.toggleTransportMode('citybike'),
    toggleAirplaneState: () => this.toggleTransportMode('airplane'),
  }

  render() {
    return (
      <div className="customize-search">
        <section className="offcanvas-section">
          <h4><FormattedMessage id="main-mode" defaultMessage="I'm travelling by" /></h4>
          <div className="row btn-bar">
            <ToggleButton
              icon="walk"
              onBtnClick={() => this.toggleStreetMode('walk')}
              state={this.getMode('walk')}
              checkedClass="walk"
              className="first-btn small-4"
            />
            <ToggleButton
              icon="bicycle-withoutBox"
              onBtnClick={() => this.toggleStreetMode('bicycle')}
              state={this.getMode('bicycle')}
              checkedClass="bicycle"
              className=" small-4"
            />
            <ToggleButton
              icon="car-withoutBox"
              onBtnClick={() => this.toggleStreetMode('car')}
              state={this.getMode('car')}
              checkedClass="car" className="last-btn small-4"
            />
          </div>
        </section>

        {config.customizeSearch.walkReluctance.available ? this.getWalkReluctanceSlider() : null}
        {config.customizeSearch.walkingSpeed.available ? this.getWalkSpeedSlider() : null}

        <section className="offcanvas-section">
          <h4><FormattedMessage id="using-modes" defaultMessage="Using" /></h4>
          <ModeFilter
            action={this.actions}
            buttonClass="mode-icon"
            selectedModes={this.getModes()}
          />
        </section>

        {config.customizeSearch.walkBoardCost.available ? this.getWalkBoardCostSlider() : null}
        {config.customizeSearch.transferMargin.available ? this.getTransferMarginSlider() : null}
        {config.customizeSearch.ticketOptions.available ? this.getTicketSelector() : null}
        {config.customizeSearch.accessibility.available ? this.getAccessibilitySelector() : null}
      </div>);
  }
}

export default CustomizeSearch;
