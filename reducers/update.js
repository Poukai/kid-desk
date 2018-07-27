const update = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE':
      return [
        ...state, {
          height: action.height
        }
      ]
    default:
      return state
  }
};

export default update