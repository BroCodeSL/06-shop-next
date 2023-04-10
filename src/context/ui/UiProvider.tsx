import { FC, useMemo, useReducer } from "react";
import { UIContext, uiReducer } from "./";

export interface UIState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UIState = {
  isMenuOpen: false,
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const UIProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({ type: '[UI] - ToggleMenu' });
}

  const providerValue = useMemo(
    () => ({
      ...state,
      // Methods
      toggleSideMenu
    }),
    [state]
  );

  return (
    <UIContext.Provider value={providerValue}>{children}</UIContext.Provider>
  );
};
