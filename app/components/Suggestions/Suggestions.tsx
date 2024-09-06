import { useEffect, useState } from "react";
import Suggestion from "./Suggestion";
import useSuggestions from "@/app/hooks/useSuggestions";

const suggestions = [
  "You could have an investment portfolio worth $200k! Click here to learn more.",
  "You could have an investment portfolio worth $200,000 dollars in 10 years. Based on your monthly savings, we noticed a potential opportunity.",
];

export type PageType = "dashboard" | "debt" | "budget" | "wealth";

interface Props {
  context: PageType;
}

export default function Suggestions({ context }: Props) {
  const { getSuggestions, suggestions } = useSuggestions(context);

  const onCloseClicked = (suggestion: String) => {
    console.log(suggestion);
    setRenderSuggestions((prevState) =>
      prevState.filter((s) => s !== suggestion)
    );
  };

  const [renderSuggestions, setRenderSuggestions] = useState(suggestions);

  useEffect(() => {
    const _suggestions = getSuggestions();
    console.log("-- got suggestions --");
    console.log(_suggestions);
    setRenderSuggestions(_suggestions);
  }, [suggestions]);

  return (
    <div
      className="my-[20px]"
      style={{ position: "relative", height: "fit-content" }}
    >
      {renderSuggestions?.map((suggestion: string, idx: number) => (
        <Suggestion
          initialSuggestion={renderSuggestions?.[0]}
          suggestion={suggestion}
          onClose={onCloseClicked}
          idx={idx}
          numSuggestions={renderSuggestions?.length}
        />
      )) || null}
    </div>
  );
}
