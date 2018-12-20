const initialState = { height: 0, POS_OK: false };
const update = (state = initialState, action) => {
  console.log(`update.js : ${JSON.stringify(action)}`, ` store state == ${JSON.stringify(state)}`);
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        height: Math.floor(Number(action.height)),
      };
    case 'GET':
      console.log('GET Called');
      return state;

    case 'UPDATE_POS':
      return {
        ...state,
        POS_OK: action.POS_OK,
      };
    default:
      return state;
  }
};

export default update;
