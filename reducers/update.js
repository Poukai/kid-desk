const initialState = {height:0};
const update = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case 'UPDATE':
      return {
          ...state, 
          height: action.height
      }
      case 'GET':
      console.log("GET Called");
        return state
    default:
      return state
  }
};


export default update