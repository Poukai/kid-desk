
export const updateHeight = value => ({
  type: 'UPDATE',
  height: value,
})

export const getHeight = () => ({
    type: 'GET',
  })

export const updatePos = (flag) => ({
  type: 'UPDATE_POS',
  POS_OK:flag
})