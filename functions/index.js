const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const newActivity = (type, event, id) => {
  return {
    type,
    eventDate: event.date,
    hostedBy: event.hostedBy,
    title: event.title,
    photoURL: event.hostPhotoURL,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    hostUid: event.hostUid,
    eventId: id
  };
};

exports.createActivity = functions.firestore
  .document('events/{eventId}')
  .onCreate(event => {
    let newEvent = event.data();

    console.log('newEvent', newEvent);

    const activity = newActivity('newEvent', newEvent, event.id);

    console.log('activity', activity);

    return admin
      .firestore()
      .collection('activity')
      .add(activity)
      .then(docRef => {
        return console.log('Activity created with ID: ', docRef.id);
      })
      .catch(error => {
        return console.log('Error adding activity', error);
      });
  });

exports.cancelActivity = functions.firestore
  .document(`events/{eventId}`)
  .onUpdate((event, context) => {
    const updatedEvent = event.after.data();
    const previousEvent = event.before.data();
    console.log({ event });
    console.log({ context });
    console.log({ updatedEvent });
    console.log({ previousEvent });

    if (
      !updatedEvent.cancelled ||
      updatedEvent.cancelled === previousEvent.cancelled
    )
      return false;

    const activity = newActivity(
      'cancelledEvent',
      updatedEvent,
      context.params.eventId
    );

    console.log({ activity });

    return admin
      .firestore()
      .collection('activity')
      .add(activity)
      .then(docRef => {
        return console.log('Activity created with ID: ', docRef.id);
      })
      .catch(error => {
        return console.log('Error adding activity', error);
      });
  });

exports.addFollower = functions.firestore
  .document(`users/{userId}/following/{followedUserId}`)
  .onCreate((event, context) => {
    console.log('v10');
    const newEvent = event.data();
    console.log({ newEvent });

    const followerId = context.params.userId;
    const followedUserId = context.params.followedUserId;
    console.log({ context });
    console.log({ followerId });
    console.log({ followedUserId });

    return admin
      .firestore()
      .collection('users')
      .doc(followerId)
      .get()
      .then(doc => {
        const followerInfo = doc.data();

        console.log({ followerInfo });

        return admin
          .firestore()
          .collection('users')
          .doc(followedUserId)
          .collection('followers')
          .doc(followerId)
          .set({
            displayName: followerInfo.displayName,
            city: followerInfo.city || 'unknown city',
            photoURL: followerInfo.photoURL
          });
      })
      .catch(error => console.log({ error }));
  });

exports.deleteFollower = functions.firestore
  .document(`users/{userId}/following/{followedUserId}`)
  .onDelete((event, context) => {
    console.log('v1');
    const newEvent = event.data();
    console.log({ newEvent });

    const followerId = context.params.userId;
    const followedUserId = context.params.followedUserId;
    console.log({ context });
    console.log({ followerId });
    console.log({ followedUserId });

    return admin
      .firestore()
      .collection('users')
      .doc(followedUserId)
      .collection('followers')
      .doc(followerId)
      .delete()
      .catch(error => console.log({ error }));
  });
