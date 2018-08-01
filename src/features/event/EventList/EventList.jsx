import React, { Component } from 'react';
import EventListItem from './EventListItem';

class EventList extends Component {
  render() {
    const { events, deleteEvent } = this.props;
    return (
      <div>
        <h1>Event List</h1>
        {events.map(event => {
          return (
            <EventListItem
              key={event.id}
              event={event}
              deleteEvent={deleteEvent}
            />
          );
        })}
      </div>
    );
  }
}

export default EventList;
