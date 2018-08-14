const initialState = {height:0};
const update = (state = initialState, action) => {
  console.log("update.js : "+action.height);
  switch (action.type) {
    case 'UPDATE':
      return {
          ...state, 
          height: Math.floor(Number(action.height))
      }
      case 'GET':
      console.log("GET Called");
        return state
    default:
      return state
  }
};


export default update