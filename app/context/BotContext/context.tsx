import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  BotPromptContext,
  botReducer,
  BotReducerAction,
  BotState,
  ChatMessage,
  initialState,
} from "./reducer";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
// import { DanteClient } from 'src/dante';
// import { AuthContext } from '../auth/context';

type BotContextValue = [BotState, React.Dispatch<BotReducerAction>];

const BotContext = createContext<BotContextValue>([initialState, () => null]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BotProvider = (props: any) => {
  // const [state, dispatch] = useReducer(botReducer, { ...initialState });
  const [state, dispatch] = useReducer(botReducer, {
    wActive: false,
    isOpen: false,
    loading: false,
    messages: [],
    props: {},
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
  });

  const value = useMemo(() => [state, dispatch], [state]) as BotContextValue;

  // Init new DanteClient once the user has loaded:
  //   const { user } = useContext(AuthContext);
  const { data } = useSession();
  const { user } = data!;

  //   useEffect(() => {
  //     if (user.firstName) {
  //       const botClient = new DanteClient(user.firstName);
  //       dispatch({ type: 'SET_STATE', payload: { botClient } });
  //     }
  //   }, [user.firstName]);

  return <BotContext.Provider value={value} {...props} />;
};

function useBotContext() {
  const context = useContext(BotContext);
  const router = useRouter();

  if (!context) {
    throw new Error("useBotContext must be used within a BotProvider");
  }

  const [state, dispatch] = context;

  const setLoading = (loading: boolean) =>
    dispatch({ type: "SET_LOADING", payload: { loading } });

  const setConversationId = (conversationId: string) =>
    dispatch({ type: "SET_STATE", payload: { conversationId } });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setOpen = (props?: any) => dispatch({ type: "SET_OPEN", props });

  const setClosed = () => dispatch({ type: "SET_CLOSED" });

  const resetMessages = () => dispatch({ type: "RESET_MESSAGES" });

  const _appendMessageToChat = (message: string, nextMessageIndex?: number) => {
    dispatch({
      type: "APPEND_MESSAGE_TO_CHAT",
      payload: { message, messageIndex: nextMessageIndex },
    });
  };

  const _addMessageToChat = (
    message: string,
    role: ChatMessage["role"] = "user",
    props?: Record<string, any>
  ) => {
    dispatch({
      type: "ADD_MESSAGE_TO_CHAT",
      payload: { message, role, props },
    });
  };

  const setMessages = (messages: ChatMessage[]) => {
    dispatch({ type: "SET_MESSAGES", payload: { messages } });
  };

  const replaceLastChatMessage = (
    newMessage: string,
    role: ChatMessage["role"] = "user",
    props?: Record<string, any>
  ) => {
    dispatch({
      type: "REPLACE_LAST_CHAT_MESSAGE",
      payload: { message: newMessage, role, props },
    });
  };

  const updateMessageByIndex = (
    updatedMessage: Partial<ChatMessage>,
    index: number,
    deleteRest = false
  ) => {
    dispatch({
      type: "UPDATE_MESSAGE_BY_INDEX",
      payload: {
        message: updatedMessage,
        index: index,
        deleteRest,
      },
    });
  };

  const updateState = (newState: Partial<BotState>) => {
    dispatch({
      type: "SET_STATE",
      payload: newState,
    });
  };

  const setBotContext = (
    title: string,
    route: string,
    idOfAsset: string,
    preprompt: string,
    additionalPreprompt?: string,
    additionalCategoriesForPreprompt?: string[],
    additionalPromptRequired?: boolean,
    additionalPrompt?: string,
    additionalPromptContext?: string
  ) => {
    dispatch({
      type: "SET_PROMPT_CONTEXT",
      payload: {
        title: title,
        route: route,
        id: idOfAsset || "",
        activePrepromptContext: preprompt,
        additionalPreprompt: additionalPreprompt,
        additionalCategoriesForPreprompt: additionalCategoriesForPreprompt,
        additionalPromptRequired: additionalPromptRequired,
        additionalPrompt: additionalPrompt,
        additionalPromptContext: additionalPromptContext,
      },
    });
  };

  const updateBotContext = (botContextUpdate: Partial<BotPromptContext>) => {
    dispatch({
      type: "UPDATE_PROMPT_CONTEXT",
      payload: botContextUpdate,
    });
  };

  const resetContext = () => {
    dispatch({
      type: "SET_PROMPT_CONTEXT",
      payload: {
        title: "",
        route: "",
        id: "",
        activePrepromptContext: "",
        additionalPreprompt: "",
        additionalCategoriesForPreprompt: [],
      },
    });
  };

  const resetAdditionalContextRequired = () => {
    dispatch({
      type: "UPDATE_PROMPT_CONTEXT",
      payload: {
        activePrepromptContext: "",
        additionalPromptRequired: false,
        additionalPrompt: "",
        additionalPromptContext: "",
      },
    });
  };

  return {
    state,
    context: state.promptContext,
    botClient: state.botClient,
    conversationId: state.conversationId,
    setConversationId,
    updateState,
    dispatch,
    setOpen,
    setClosed,
    setLoading,
    _appendMessageToChat,
    _addMessageToChat,
    setMessages,
    replaceLastChatMessage,
    updateMessageByIndex,
    resetMessages,
    setBotContext,
    updateBotContext,
    resetContext,
    resetAdditionalContextRequired,
  };
}

export { BotProvider, useBotContext };
