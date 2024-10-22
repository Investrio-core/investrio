import CircularProgress from "@mui/material/CircularProgress";
import { LightButton, SimpleButton } from "../ui/buttons";
import PlaidItemLoading from "./PlaidItemLoading";
import PlaidLogo from "./PlaidLogo";

interface Props {
  title: string;
  blurb: string;
  setShow: Function;
  open: Function;
  ready: boolean;
  showManualOption: boolean;
}

export default function PlaidOrManualForm({
  title,
  blurb,
  setShow,
  open,
  ready,
  showManualOption,
}: Props) {
  const plaidButtonStyles = !showManualOption
    ? { position: "relative", top: "1.2rem" }
    : {};
  return (
    <>
      {showManualOption ? (
        <div className="text-[#100d40] text-2xl font-semibold leading-[33.60px] mt-[46px] mb-[11px] text-center">
          {title}
        </div>
      ) : null}
      {showManualOption ? (
        <div className="text-[#747682] text-base font-normal mb-[41px] text-center">
          {blurb}
        </div>
      ) : null}
      <div className="px-[31px]">
        {showManualOption ? (
          <div className="text-[#03091d] text-xl font-medium text-center mb-[34px]">
            Enter your data
          </div>
        ) : null}
        <div
          className={`${
            showManualOption ? "mb-[80px]" : "mb-[12px] mt-[12px]"
          }`}
        >
          {showManualOption ? (
            <SimpleButton
              text="Manual"
              onClick={() => setShow(false)}
              className="mb-[8px]"
              loading={false}
            />
          ) : null}

          <button
            style={{
              width: "100%",
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 8,
              paddingBottom: 8,
              borderRadius: 8,
              border: "1px #8833FF solid",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              display: "inline-flex",
              ...plaidButtonStyles,
            }}
            onClick={() => open()}
            disabled={!ready}
          >
            <div
              style={{
                textAlign: "center",
                color: "#8833FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                justifyItems: "center",
                gap: 6,
              }}
            >
              {/* <PlaidLogo width={22} height={22} /> */}

              {ready ? (
                <>
                  <PlaidLogo width={22} height={22} />
                  <span className="text-black font-bold">
                    {showManualOption ? "Plaid Connect" : "Add Account"}
                    {/* Plaid */}
                  </span>
                </>
              ) : (
                <>
                  <CircularProgress size="22px" />
                  <span>Loading Plaid</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
