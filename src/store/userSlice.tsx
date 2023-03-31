import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: window.localStorage.getItem('name') || undefined,
    email: window.localStorage.getItem('email') || undefined,
    token: window.localStorage.getItem('token') || undefined
  },
  reducers: {
    signIn: (state, {payload}) => {
        state.name = payload.name
        state.email = payload.email
        state.token = payload.token
        window.localStorage.setItem('name', payload.name)
        window.localStorage.setItem('email', payload.email)
        window.localStorage.setItem('token', payload.token)

    },
    signOut: (state) => {
        state.name = undefined
        state.email = undefined
        state.token = undefined
        window.localStorage.removeItem('name')
        window.localStorage.removeItem('email')
        window.localStorage.removeItem('token')
    }
  }
})

export const userActions = userSlice.actions
export default userSlice