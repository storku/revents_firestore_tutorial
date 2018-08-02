import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';
import testReducer from './testReducer';
import eventReducer from '../../features/event/eventReducer';

const rootReducer = combineReducers({
  form: FormReducer,
  test: testReducer,
  events: eventReducer
});

export default rootReducer;
