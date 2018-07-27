const update = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE':
      return [
        ...state, {
          height: action.height
        }
      ]
      case 'GET':
        return state
    default:
      return state
  }
};


export default update