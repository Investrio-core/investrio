export type ContentProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export interface ContentState {
  currentTab: string;
  currentSubTab: string;
  props: ContentProps;
  showPlaidConnect: boolean;
  isDarkMode: boolean;
}

export type ContentReducerAction =
  | { type: "SET_FIELD"; field: string; payload: number }
  | { type: "SET_BOOLEAN_FIELD"; field: string; payload: boolean }
  | { type: "MERGE_PAYLOAD"; payload: ContentProps }
  | {
      type: "SET_SUB_TAB";
      payload: { currentSubTab: string };
      props?: ContentProps;
    }
  | {
      type: "SET_TABS";
      payload: { currentTab: string; currentSubTab: string };
      props?: ContentProps;
    }
  | { type: "UNSET_CONTENT" };

export const initialState: ContentState = {
  currentTab: "",
  currentSubTab: "",
  props: {},
  showPlaidConnect: false,
  isDarkMode: false,
};

export function contentReducer(
  state: ContentState,
  action: ContentReducerAction
): ContentState {
  switch (action.type) {
    case "SET_FIELD":
    case "SET_BOOLEAN_FIELD": {
      return {
        ...state,
        [action.field]: action.payload,
      };
    }

    case "SET_TABS": {
      return {
        ...state,
        currentSubTab: action.payload.currentSubTab,
        currentTab: action.payload.currentTab,
      };
    }

    case "SET_SUB_TAB": {
      return {
        ...state,
        currentSubTab: action.payload.currentSubTab,
      };
    }

    case "MERGE_PAYLOAD": {
      return {
        ...state,
        ...action.payload,
      };
    }

    case "UNSET_CONTENT": {
      return initialState;
    }
    default: {
      throw new Error(`Unsupported action type: ${JSON.stringify(action)}`);
    }
  }
}
