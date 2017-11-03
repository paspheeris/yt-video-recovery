import * as Redux from 'redux';
import { ReduxStore } from '.././global.d';

import auth from './auth';

const rootReducer: Redux.Reducer<ReduxStore> = Redux.combineReducers({ auth });

export default rootReducer;
