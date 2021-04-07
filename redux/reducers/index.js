import { combineReducers } from 'redux';
import { user } from './user';
import { users } from './users';
import { empresas } from './empresas';

const Reducers = combineReducers({
  userState: user,
  usersState: users,
  empresasState: empresas,
});

export default Reducers;

