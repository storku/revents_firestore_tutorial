import React, { Component } from 'react';
import { connect } from 'react-redux';
import Script from 'react-load-script';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import { Button } from 'semantic-ui-react';
import { googleApiKey } from '../../app/common/keys';
import { openModal } from '../modals/modalActions';

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

  clickHandler = (modalType, dataInfo) => () => {
    this.props.openModal(modalType, dataInfo);
  };

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange
    };

    const { openModal } = this.props;

    return (
      <div>
        <Script
          onLoad={this.handlescriptLoad}
          url={`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`}
        />
        {this.state.scriptLoaded && (
          <form onSubmit={this.handleFormSubmit}>
            <PlacesAutocomplete inputProps={inputProps} />
            <button type="submit">Submit</button>
          </form>
        )}
        <Button
          color="teal"
          content="Open Modal"
          onClick={this.clickHandler('TestModal', { data: 43 })}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.test.data
});

const actions = {
  openModal
};

export default connect(
  mapStateToProps,
  actions
)(TestComponent);
