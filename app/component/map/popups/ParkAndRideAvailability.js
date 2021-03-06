import React from 'react';
import mapProps from 'recompose/mapProps';
import { FormattedMessage } from 'react-intl';

import Availability from '../../card/Availability';
import ComponentUsageExample from '../../documentation/ComponentUsageExample';

const ParkAndRideAvailability = mapProps(({ realtime, maxCapacity, spacesAvailable }) => ({
  available: realtime ? spacesAvailable : 0,
  total: maxCapacity,
  fewAvailableCount: maxCapacity * 0.2,
  text: (
    <p className="sub-header-h4 availability-header">
      <FormattedMessage id="park-and-ride-availability" defaultMessage="Spaces available" />
      {'\u00a0'}
      ({!realtime || isNaN(spacesAvailable) ? '?' : spacesAvailable}/
       {isNaN(maxCapacity) ? 0 : maxCapacity})
    </p>
  ),
}))(Availability);

ParkAndRideAvailability.displayName = 'ParkAndRideAvailability';

ParkAndRideAvailability.description = (
  <div>
    <p>Renders information about park and ride availability</p>
    <ComponentUsageExample description="non-realtime">
      <ParkAndRideAvailability spacesAvailable={1} maxCapacity={3} />
    </ComponentUsageExample>
    <ComponentUsageExample description="realtime">
      <ParkAndRideAvailability realtime spacesAvailable={1} maxCapacity={3} />
    </ComponentUsageExample>
  </div>
);

ParkAndRideAvailability.propTypes = {
  realtime: React.PropTypes.bool,
  maxCapacity: React.PropTypes.number.isRequired,
  spacesAvailable: React.PropTypes.number.isRequired,
};

export default ParkAndRideAvailability;
