import * as Redux from 'redux';

const InitState = {

}
interface InitState {

}
function users(state: InitState = InitState, action: Redux.Action): InitState {
  switch (action.type) {
    default:
      return state;
  }
}
export default users;