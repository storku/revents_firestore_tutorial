import firebase from 'firebase';
import 'firebase/firestore';
import { firebaseConfig } from '../common/keys';

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
};
firestore.settings(settings);

export default firebase;
