let id = "abcdef0123456789";
let Commands={
    STOP:{"ID":id, "Command":"STOP"},
    UP:{"ID":id, "Command":"UP"},
    DOWN:{"ID":id, "Command":"DOWN"},
    SAVE_POS1:{"ID":id, "Command":"SAVE_POS1"},
    SAVE_POS2:{"ID":id, "Command":"SAVE_POS2"},
    SAVE_POS3:{"ID":id, "Command":"SAVE_POS3"},
    SAVE_POS4:{"ID":id, "Command":"SAVE_POS4"},
    POS1:{"ID":id, "Command":"POS1"},
    POS2:{"ID":id, "Command":"POS2"},
    POS3:{"ID":id, "Command":"POS3"},
    POS4:{"ID":id, "Command":"POS4"},
    SET_HEIGHT:{"ID":id, "Command":"SET_HEIGHT","Height":"xx"}, // ex: xx la 300
    SET_USER_ID:{"ID":id, "Command":"SET_USER_ID"},
    RESET_USER_ID:{"ID":id, "Command":"RESET_USER_ID"},
    GET_STATE:{"ID":id, "Command":"GET_STATE"},
    GET_HEIGHT:{"ID":id, "Command":"GET_HEIGHT"},
    RESET:{"ID":id, "Command":"RESET"}
  }
  export {Commands};