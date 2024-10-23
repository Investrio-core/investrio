import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import {
  contentReducer,
  ContentReducerAction,
  ContentState,
  ContentProps,
  initialState,
} from "./reducer";

type ContextValue = [ContentState, React.Dispatch<ContentReducerAction>];

const TabContext = createContext<ContextValue>([initialState, () => null]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TabContextProvider = (props: any) => {
  //   // const [state, dispatch] = useReducer(botReducer, { ...initialState });
  const [state, dispatch] = useReducer(contentReducer, {
    props: {},
    currentTab: "",
    currentSubTab: "",
    showPlaidConnect: false,
    isDarkMode: false,
  });

  const value = useMemo(() => [state, dispatch], [state]) as ContextValue;
  return <TabContext.Provider value={value} {...props} />; // {props.children}</TabContext.Provider>
};

function useTabContext() {
  const context = useContext(TabContext);

  if (!context) {
    throw new Error("useTabContext must be used within a BotProvider");
  }

  const [state, dispatch] = context;

  const setSubTab = (subTab: string) => {
    dispatch({
      type: "SET_SUB_TAB",
      payload: {
        currentSubTab: subTab,
      },
    });
  };

  const setTabs = (tab: string, subTab: string) => {
    dispatch({
      type: "SET_TABS",
      payload: {
        currentSubTab: subTab,
        currentTab: tab,
      },
    });
  };

  const setShowPlaidConnect = (showPlaidConnect: boolean) => {
    dispatch({
      type: "SET_BOOLEAN_FIELD",
      field: "showPlaidConnect",
      payload: showPlaidConnect,
    });
  };

  return {
    state,
    subTab: state.currentSubTab,
    tab: state.currentTab,
    showPlaidConnect: state.showPlaidConnect,
    isDarkMode: state.isDarkMode,
    setSubTab,
    setTabs,
    setShowPlaidConnect,
  };
}

export { TabContextProvider, useTabContext };
