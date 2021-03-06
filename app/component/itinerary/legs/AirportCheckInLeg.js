import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import RouteNumber from '../../departure/RouteNumber';
import Icon from '../../icon/Icon';

function AirportCheckInLeg(props) {
  return (
    <div style={{ width: '100%' }} className="row itinerary-row">
      <div className="small-2 columns itinerary-time-column">
        <div className="itinerary-time-column-time">
          {moment(props.startTime).format('HH:mm')}
        </div>
        <RouteNumber mode="wait" vertical />
      </div>
      <div
        onClick={props.focusAction}
        className="small-10 columns itinerary-instruction-column wait"
      >
        <div className="itinerary-leg-first-row">
          <FormattedMessage
            id="airport-check-in"
            values={{ agency: props.leg.agency && props.leg.agency.name }}
            defaultMessage="Optionally check in your luggage with {agency}"
          />
          <Icon img="icon-icon_search-plus" className="itinerary-search-icon" />
        </div>
        <div className="itinerary-leg-intermediate-stops">
          <FormattedMessage
            id="airport-security-check-go-to-gate"
            defaultMessage="Walk through the security check and go to gate"
          />
        </div>
      </div>
    </div>
  );
}

AirportCheckInLeg.propTypes = {
  leg: React.PropTypes.shape({
    agency: React.PropTypes.shape({
      name: React.PropTypes.string,
    }),
  }).isRequired,
  startTime: React.PropTypes.number.isRequired,
  focusAction: React.PropTypes.func.isRequired,
};

export default AirportCheckInLeg;
