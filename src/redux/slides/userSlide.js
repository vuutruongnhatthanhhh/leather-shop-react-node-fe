import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  phone: '',
  address:'',
  avatar:'',
  access_token: '',
  id: '',
  isAdmin: false,
  city:'',
  point:0
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Dùng redux để lấy ra thông tin của user, quản lý nó trên trình duyệt
    updateUser: (state, action)=>{
      const { name ='', email='', access_token='', address='', phone='', avatar='', _id ='', isAdmin, city='',
        refreshToken ='',point=0
       } = action.payload
      state.name = name;
      state.email = email;
      state.address = address;
      state.phone = phone;
      state.avatar = avatar;
      state.id = _id;
      state.access_token = access_token;
      state.isAdmin = isAdmin;
      state.city = city;
      state.refreshToken = refreshToken;
      state.point=point
    },
    partialUpdateUser: (state, action) => {
      const { name, email, access_token, address, phone, avatar, _id, isAdmin, city, refreshToken, point } = action.payload
      if (name !== undefined) state.name = name;
      if (email !== undefined) state.email = email;
      if (address !== undefined) state.address = address;
      if (phone !== undefined) state.phone = phone;
      if (avatar !== undefined) state.avatar = avatar;
      if (_id !== undefined) state.id = _id;
      if (access_token !== undefined) state.access_token = access_token;
      if (isAdmin !== undefined) state.isAdmin = isAdmin;
      if (city !== undefined) state.city = city;
      if (refreshToken !== undefined) state.refreshToken = refreshToken;
      if (point !== undefined) state.point = point;
    },
    // Để khi logout reset lại mấy cái này
    resetUser: (state)=>{
     
      state.name = '';
      state.email = '';
      state.address = '';
      state.phone = '';
      state.avatar = '';
      state.id = '';
      state.access_token = '';
      state.isAdmin= false;
      state.city = '';
      state.point=0
    },
   
  
  },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser, partialUpdateUser } = userSlide.actions

export default userSlide.reducer