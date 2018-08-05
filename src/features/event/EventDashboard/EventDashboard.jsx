import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import { deleteEvent } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';

class EventDashboard extends Component {
  handleDeleteEvent = eventId => e => {
    this.props.deleteEvent(eventId);
  };

  render() {
    const { events, loading } = this.props;
    if (loading) return <LoadingComponent inverted={true} />;
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList deleteEvent={this.handleDeleteEvent} events={events} />
        </Grid.Column>
        <Grid.Column width={6}>Hello</Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = ({ events, async }) => ({
  events,
  loading: async.loading
});

const actions = {
  deleteEvent
};

export default connect(
  mapStateToProps,
  actions
)(EventDashboard);
