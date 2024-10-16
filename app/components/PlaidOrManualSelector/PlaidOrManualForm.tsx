import { LightButton, SimpleButton } from "../ui/buttons";
import PlaidItemLoading from "./PlaidItemLoading";

interface Props {
  title: string;
  blurb: string;
  setShow: Function;
  open: Function;
  ready: boolean;
}

export default function PlaidOrManualForm({
  title,
  blurb,
  setShow,
  open,
  ready,
}: Props) {
  return (
    <>
      <div className="text-[#100d40] text-2xl font-semibold leading-[33.60px] mt-[46px] mb-[11px] text-center">
        {title}
      </div>
      <div className="text-[#747682] text-base font-normal mb-[41px] text-center">
        {blurb}
      </div>
      <div className="px-[31px]">
        <div className="text-[#03091d] text-xl font-medium text-center mb-[34px]">
          Enter your data:
        </div>
        <div className="mb-[80px]">
          <SimpleButton
            text="Manual"
            onClick={() => setShow(false)}
            className="mb-[8px]"
            loading={false}
          />

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
            }}
            onClick={() => open()}
            disabled={!ready}
          >
            <div
              style={{
                textAlign: "center",
                color: "#8833FF",
              }}
            >
              {ready ? "Plaid" : "Loading Plaid"}
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
