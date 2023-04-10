import { UIState } from "./";

type UIActionType = | { type: '[UI] - ToggleMenu' };

export const uiReducer = (state: UIState, action: UIActionType): UIState => {
  if (action.type === "[UI] - ToggleMenu") {
    return {
      ...state,
      isMenuOpen: !state.isMenuOpen,
    };
  } else {
    return state;
  }
};
