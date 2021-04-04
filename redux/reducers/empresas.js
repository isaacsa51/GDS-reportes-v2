import { EMPRESA_STATE_CHANGE, CLEAR_DATA, EMPRESA_DATA_STATE_CHANGE } from '../constants';

const initialState = {
  empresas: [],
};

export const empresas = (state = initialState, action) => {
  switch (action.type) {
    case EMPRESA_DATA_STATE_CHANGE:
      return {
        ...state,
        empresas: [...state.empresas, action.empresas],
      };
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
