import Image from "next/image";
import { IoMdClose } from "react-icons/io";

export default function Suggestion({
  initialSuggestion,
  suggestion,
  onClose,
  idx,
  numSuggestions,
}: {
  initialSuggestion: string;
  suggestion: string;
  onClose: Function;
  idx: number;
  numSuggestions: number;
}) {
  return (
    <div
      style={{
        borderRadius: "18px",
        border: "0px solid #D2DAFF",
        background: "#EEF1FF",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        padding: "19px",
        paddingTop: "14px",
        paddingBottom: "14px",
        position: idx === 0 ? "relative" : "absolute",
        zIndex: 100 - idx,
        left: idx * 4,
        top: idx * 4,
        width: "100%",
        marginBottom: numSuggestions * 7,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          cursor: "pointer",
        }}
        onClick={() => onClose(suggestion)}
      >
        <IoMdClose style={{ fontSize: "1rem" }} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          //   justifyContent: "center",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        <div
          className="w-[25.79px] h-[27px] bg-white rounded-full shadow flex"
          style={{
            fill: "#FFF",
            filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
            width: "25.791px",
            height: "27px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src="/logo_white_bg.svg"
            alt="Investrio Logo"
            className="mb-2"
            width={16.881}
            height={17.673}
            style={{ position: "relative", top: "5px", left: "0px" }}
          />
        </div>
        <div className="text-black text-xl font-medium">Smart Suggest</div>
      </div>

      <div className="text-[#03091d] text-sm font-normal">
        {idx === 0 ? suggestion : initialSuggestion}
      </div>
    </div>
  );
}
