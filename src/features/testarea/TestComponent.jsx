import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleMapReact from 'google-map-react';
import Script from 'react-load-script';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import { Icon } from 'semantic-ui-react';
import { googleApiKey } from '../../app/common/keys';

const Marker = () => {
  return <Icon name="marker" size="big" color="red" />;
};

class TestComponent extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  state = {
    address: '',
    scriptLoaded: false
  };

  handlescriptLoad = () => {
    this.setState({ scriptLoaded: true });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
  };

  onChange = address => {
    this.setState({ address });
  };

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange
    };

    return (
      <div>
        {/* <Script
          onLoad={this.handlescriptLoad}
          url={`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`}
        /> */}
        {this.state.scriptLoaded && (
          <form onSubmit={this.handleFormSubmit}>
            <PlacesAutocomplete inputProps={inputProps} />
            <button type="submit">Submit</button>
          </form>
        )}
        <div style={{ height: '300px', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: googleApiKey }}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
          >
            <Marker lat={59.955413} lng={30.337844} text={'Kreyser Avrora'} />
          </GoogleMapReact>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.test.data
});

export default connect(mapStateToProps)(TestComponent);
