import { toastr } from 'react-redux-toastr';
import { FETCH_EVENTS } from './eventConstants';
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from '../async/asyncActions';
import { createNewEvent } from '../../app/common/util/helpers';
import moment from 'moment';
import compareAsc from 'date-fns/compare_asc';
import firebase from '../../app/config/firebase';

export const fetchEvents = events => {
  return {
    type: FETCH_EVENTS,
    payload: events
  };
};

export const createEvent = event => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  const photoURL = getState().firebase.profile.photoURL;
  const newEvent = createNewEvent(user, photoURL, event);
  try {
    let createdEvent = await firestore.add(`events`, newEvent);
    await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
      eventId: createdEvent.id,
      userUid: user.uid,
      eventDate: firestore.Timestamp.fromDate(event.date),
      host: true
    });
    toastr.success('Success', 'Event has been created!');
  } catch (error) {
    toastr.error('Oops', 'Something went wrong');
  }
};

export const updateEvent = event => async (dispatch, getState) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  if (event.date !== getState().firestore.ordered.events[0].date) {
    event.date = moment(event.date).toDate();
  }
  try {
    const eventDocRef = firestore.collection('events').doc(event.id);
    const dateEqual = compareAsc(
      getState().firestore.ordered.events[0].date.toDate(),
      event.date
    );
    if (dateEqual !== 0) {
      const batch = firestore.batch();
      await batch.update(eventDocRef, event);

      const eventAttendeeRef = firestore.collection('event_attendee');
      const eventAttendeeQuery = eventAttendeeRef.where(
        'eventId',
        '==',
        event.id
      );
      const eventAttendeeQuerySnap = await eventAttendeeQuery.get();

      for (let i = 0; i < eventAttendeeQuerySnap.docs.length; i++) {
        const eventAttendeeDocRef = firestore
          .collection('event_attendee')
          .doc(eventAttendeeQuerySnap.docs[i].id);
        console.log({ eventAttendeeDocRef });
        await batch.update(eventAttendeeDocRef, {
          eventDate: event.date
        });
      }

      await batch.commit();
    } else {
      await eventDocRef.update(event);
    }
    dispatch(asyncActionFinish());
    toastr.success('Success', 'Event has been updated!');
  } catch (error) {
    dispatch(asyncActionFinish());
    toastr.error('Oops', 'Something went wrong');
  }
};

export const cancelToggle = (cancelled, eventId) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const message = cancelled
    ? 'Are you sure you want to cancel the event?'
    : 'This will reactivate the event - are you sure?';
  try {
    toastr.confirm(message, {
      onOk: () => {
        firestore.update(`events/${eventId}`, {
          cancelled: cancelled
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const getEventForDashboard = lastEvent => async (dispatch, getState) => {
  const today = new Date(Date.now());
  const firestore = firebase.firestore();
  const eventsRef = firestore.collection('events');
  try {
    dispatch(asyncActionStart());
    const startAfter =
      lastEvent &&
      (await firestore
        .collection('events')
        .doc(lastEvent.id)
        .get());

    let query;

    lastEvent
      ? (query = eventsRef
          .where('date', '>', today)
          .orderBy('date')
          .startAfter(startAfter)
          .limit(2))
      : (query = eventsRef
          .where('date', '>', today)
          .orderBy('date')
          .limit(2));

    let querySnap = await query.get();

    if (querySnap.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnap;
    }

    const events = [];

    for (let i = 0; i < querySnap.docs.length; i++) {
      const event = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      events.push(event);
    }
    dispatch({ type: FETCH_EVENTS, payload: { events } });
    dispatch(asyncActionFinish());
    return querySnap;
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const addEventComment = (eventId, values, parentId) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const profile = getState().firebase.profile;
  const user = firebase.auth().currentUser;
  const newComment = {
    parentId,
    displayName: profile.displayName,
    photoURL: profile.photoURL || '/assets/user.png',
    uid: user.uid,
    text: values.comment,
    date: Date.now()
  };
  try {
    await firebase.push(`event_chat/${eventId}`, newComment);
  } catch (error) {
    console.log(error);
    toastr.error('Oops', 'Problem adding comment');
  }
};
