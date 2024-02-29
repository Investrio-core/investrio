import { Tooltip } from "../../ui/Tooltip";

export const StrategyFormTooltip = () => {
  return (
    <Tooltip
      text="Where do I find this info?"
      containerClassName="self-end"
    >
      <div className="text-left text-purple-2 text-sm">
        <h2 className="mb-4 text-base font-bold">Where do I find this info?</h2>
        <div className="flex flex-col gap-13 mt-3">
          <h3 className="font-bold">Check your statement</h3>
          <div>
          You can find this information on your latest credit card statement or your mobile app. Providing this information here allows Investrio to calculate your debt-free plan. Your data is not shared or used for any other purpose.
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-3">
          <h3 className="font-bold">Name Your Debt</h3>
          <div>
          Assign a descriptive name to each credit card or loan account for easy tracking.
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-3">
          <h3 className="font-bold">Debt Type</h3>
          <div>Currently we only support credit cards. Additional debt types coming soon!</div>
        </div>
        <div className="flex flex-col gap-1 mt-3">
          <h3 className="font-bold">Interest Rate (APR)</h3>
          <div>This is the amount that it costs you to borrow money. (Did you know: the average APR in the US is 24.99%!)</div>
        </div>
        <div className="flex flex-col gap-1 mt-3">
          <h3 className="font-bold">Outstanding Balance</h3>
          <div>This is the full amount that's owed on your card.</div>
        </div>
        <div className="flex flex-col gap-1 mt-3">
          <h3 className="font-bold">Minimum Payment</h3>
          <div>
          Enter your most recent monthly minimum.
          </div>
        </div>
      </div>
    </Tooltip>
  );
};
