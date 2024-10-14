import { DanteClient } from "src/dante";
import { v4 as uuidv4 } from "uuid";

type BotProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type ChatMessage = {
  role: "bot" | "user" | "preprompt";
  content: string;
  id: string;
  props?: Record<string, any>;
};

// example: { role: "user", content: "this should be in the context when it loads", id: "1"}

export interface BotPromptContext {
  title: string;
  route: string;
  id: string;
  activePrepromptContext: string;
  additionalPreprompt?: string;
  additionalCategoriesForPreprompt?: string[];
  additionalPromptRequired?: boolean;
  additionalPrompt?: string;
  additionalPromptContext?: string;
}

export interface BotState {
  wActive: boolean;
  messages: ChatMessage[];
  isOpen: boolean;
  loading: boolean;
  props: BotProps;
  promptContext: BotPromptContext;
  conversationId: string;
  botClient: DanteClient | undefined;
}

export type BotReducerAction =
  | { type: "SET_STATE"; payload: Partial<BotState> }
  | { type: "SET_OPEN"; props: BotProps }
  | { type: "SET_CLOSED" }
  | {
      type: "ADD_MESSAGE_TO_CHAT";
      payload: {
        role: "bot" | "user" | "preprompt";
        message: string;
        props?: Record<string, any>;
      };
    }
  | {
      type: "REPLACE_LAST_CHAT_MESSAGE";
      payload: {
        role: "bot" | "user" | "preprompt";
        message: string;
        props?: Record<string, any>;
      };
    }
  | {
      type: "APPEND_MESSAGE_TO_CHAT";
      payload: { message: string; messageIndex?: number };
    } //, role: 'bot' | 'user' | 'preprompt'; props?: Record<string, any> } }
  | { type: "RESET_MESSAGES" }
  | { type: "SET_PROMPT_CONTEXT"; payload: BotPromptContext }
  | { type: "SET_MESSAGES"; payload: { messages: ChatMessage[] } }
  | { type: "UPDATE_PROMPT_CONTEXT"; payload: Partial<BotPromptContext> }
  | {
      type: "UPDATE_MESSAGE_BY_INDEX";
      payload: {
        message: Partial<ChatMessage>;
        index: number;
        deleteRest: boolean;
      };
    }
  | { type: "SET_LOADING"; payload: { loading: boolean } };

export const initialState: BotState = {
  wActive: false,
  isOpen: false,
  messages: [],
  props: {},
  loading: false,
  promptContext: {
    title: "",
    route: "",
    id: "",
    activePrepromptContext: "",
    additionalPromptRequired: false,
    additionalPrompt: "",
    additionalPromptContext: "",
  },
  conversationId: "",
  botClient: undefined,
};

export function botReducer(
  state: BotState,
  action: BotReducerAction
): BotState {
  switch (action.type) {
    case "SET_STATE": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "SET_OPEN": {
      return {
        ...state,
        isOpen: true,
        props: action.props,
      };
    }

    case "SET_CLOSED": {
      return {
        ...state,
        isOpen: closed,
      };
    }

    case "SET_LOADING": {
      return {
        ...state,
        loading: action.payload.loading,
      };
    }

    case "ADD_MESSAGE_TO_CHAT": {
      const newMessages = [
        ...state.messages,
        {
          role: action.payload.role,
          content: action.payload.message,
          id: uuidv4(),
          props: action.payload.props,
        },
      ];

      if (action.payload?.props?.callback !== undefined) {
        action.payload.props.callback();
      }

      return {
        ...state,
        messages: newMessages,
      };
    }

    case "APPEND_MESSAGE_TO_CHAT": {
      const latestMessage =
        state.messages[
          action.payload.messageIndex ?? state.messages.length - 1
        ];

      return action.payload.messageIndex !== undefined
        ? {
            ...state,
            messages: [
              ...state.messages.slice(0, action.payload.messageIndex),
              {
                ...latestMessage,
                content: latestMessage?.content + action.payload.message,
              },
              ...state.messages.slice(action.payload.messageIndex + 1),
            ],
          }
        : {
            ...state,
            messages: [
              ...state.messages.slice(0, -1),
              {
                ...latestMessage,
                content: latestMessage?.content + action.payload.message,
              },
            ],
          };

      // return {
      //   ...state,
      //   messages: [
      //     ...state.messages.slice(0, -1),
      //     { ...latestMessage, content: latestMessage.content + action.payload.message },
      //   ],
      // };
    }

    case "REPLACE_LAST_CHAT_MESSAGE": {
      return {
        ...state,
        messages: [
          ...state.messages.slice(0, -1),
          {
            id: uuidv4(),
            content: action.payload.message,
            role: action.payload.role,
            props: action.payload.props,
          },
        ],
      };
    }

    case "UPDATE_MESSAGE_BY_INDEX": {
      const index = action.payload.index;
      const updatedMessage = {
        ...state.messages[index],
        ...action.payload.message,
      };
      return action.payload.deleteRest
        ? {
            ...state,
            messages: [...state.messages.slice(0, index), updatedMessage],
          }
        : {
            ...state,
            messages: [
              ...state.messages.slice(0, index),
              updatedMessage,
              ...state.messages.slice(index + 1),
            ],
          };
    }

    case "RESET_MESSAGES": {
      return {
        ...state,
        messages: [],
      };
    }

    case "SET_MESSAGES": {
      return {
        ...state,
        messages: action.payload.messages,
      };
    }

    case "SET_PROMPT_CONTEXT": {
      return {
        ...state,
        promptContext: action.payload,
      };
    }

    case "UPDATE_PROMPT_CONTEXT": {
      return {
        ...state,
        promptContext: { ...state.promptContext, ...action.payload },
      };
    }

    default: {
      throw new Error(`Unsupported action type: ${JSON.stringify(action)}`);
    }
  }
}
