import React from 'react';
import cx from 'classnames';
import FavouritesTabLabelContainer from './FavouritesTabLabelContainer';
import NearbyTabLabelContainer from './NearbyTabLabelContainer';
import ComponentUsageExample from '../documentation/ComponentUsageExample';

const FrontPagePanelLarge = ({ selectedPanel, nearbyClicked,
   favouritesClicked, children }) => {
  const tabClasses = ['small-6', 'h4'];
  const nearbyClasses = ['nearby-routes'];
  const favouritesClasses = ['favourites'];

  if (selectedPanel === 1) {
    nearbyClasses.push('selected');
  } else {
    favouritesClasses.push('selected');
  }

  return (
    <div className={'fpcfloat no-select'}>
      <ul className="tabs-row bp-large cursor-pointer">
        <NearbyTabLabelContainer
          classes={cx(tabClasses, nearbyClasses)}
          onClick={nearbyClicked}
        />
        <FavouritesTabLabelContainer
          classes={cx(tabClasses, favouritesClasses)}
          onClick={favouritesClicked}
        />
      </ul>
      {children}
    </div>
); };

FrontPagePanelLarge.description = () => (
  <div>
    <p>
      Front page tabs for large display.
    </p>
    <div style={{ width: '340px' }}>
      <ComponentUsageExample description="Front page tabs">
        <FrontPagePanelLarge />
      </ComponentUsageExample>
    </div>
  </div>);

FrontPagePanelLarge.propTypes = {
  selectedPanel: React.PropTypes.number.isRequired,
  nearbyClicked: React.PropTypes.func.isRequired,
  favouritesClicked: React.PropTypes.func.isRequired,
  children: React.PropTypes.node,
};

export default FrontPagePanelLarge;
