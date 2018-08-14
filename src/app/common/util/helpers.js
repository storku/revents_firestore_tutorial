import moment from 'moment';

export const objectToArray = object => {
  if (object) {
    return Object.entries(object).map(entry =>
      Object.assign(entry[1], { id: entry[0] })
    );
  }
};

export const createNewEvent = (user, photoURL, event) => {
  //transforms moment date object into javascript date object
  event.date = moment(event.date).toDate();
  return {
    ...event,
    hostUid: user.uid,
    hostedBy: user.displayName,
    hostPhotoURL: photoURL || '/assets/user.png',
    created: Date.now(),
    attendees: {
      [user.uid]: {
        going: true,
        joinDate: Date.now(),
        photoURL: photoURL || '/assets/user.png',
        displayName: user.displayName,
        host: true
      }
    }
  };
};
