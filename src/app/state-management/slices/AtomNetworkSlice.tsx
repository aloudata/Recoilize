import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: any = {
  searchValue: '',
  isShowLabels: false,
};

export const atomNetworkSlice = createSlice({
  name: 'atomNetwork',
  initialState,
  reducers: {
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
    setIsShowLabels: (state, action: PayloadAction<boolean>) => {
      state.isShowLabels = action.payload;
    },
  },
});

export const {setSearchValue, setIsShowLabels} = atomNetworkSlice.actions;

export default atomNetworkSlice.reducer;
