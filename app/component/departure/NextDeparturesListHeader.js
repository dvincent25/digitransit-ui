import React from 'react';
import { FormattedMessage } from 'react-intl';

const NextDeparturesListHeader = () => (
  <div className="next-departures-list-header padding-vertical-small border-top">
    <span className="time-header">
      <FormattedMessage id="next" defaultMessage="Next" />
    </span>
    <span className="time-header">
      <FormattedMessage id="leaves" defaultMessage="Leaves" />
    </span>
    <span className="distance-header">
      <FormattedMessage id="to-stop" defaultMessage="To stop" />
    </span>
    <span className="route-number-header">
      <FormattedMessage id="line" defaultMessage="Line" />
    </span>
    <span className="route-destination-header">
      <FormattedMessage id="destination" defaultMessage="Destination" />
    </span>
  </div>
);

NextDeparturesListHeader.displayName = 'NextDeparturesListHeader';

export default NextDeparturesListHeader;
