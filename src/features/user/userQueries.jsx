export const userDetailedQuery = ({ auth, userUid, match }) => {
  if (userUid !== null) {
    return [
      {
        collection: 'users',
        doc: userUid,
        storeAs: 'profile'
      },
      {
        collection: 'users',
        doc: userUid,
        subcollections: [{ collection: 'photos' }],
        storeAs: 'photos'
      },
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [{ collection: 'following', doc: match.params.id }],
        storeAs: 'following'
      }
    ];
  } else {
    console.log('this part is not used! because userUid is always needed!');
    return [
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [{ collection: 'photos' }],
        storeAs: 'photos'
      }
    ];
  }
};
