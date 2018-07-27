import { createStore, combineReducers, applyMiddleware, compose } from 'redux';


import history from '@/services/history';
import appReducer from '@/reducers/app';
import authReducer from '@/reducers/auth';
import reducers from '@/reducers';

firebase.initializeApp(process.env.firebase);

const AppReducers = combineReducers({
  app: appReducer,
  auth: authReducer,
  firebase: firebaseReducer,
  router: routerReducer,
  ...reducers,
});

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, process.env.firebase),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk)),
)(createStore);

const store = createStoreWithFirebase(AppReducers);

export default store;
