import { Steps } from "../../components/steps";

export default function Dashboard() {
  return (
    <div className="m-2 mx-3 rounded-lg p-3 bg-white text-center">
      <div className="border-b-2 border-gray-100 p-3">
        <h1 className="title text-left text-[#03091D]">Repayment Strategy</h1>
        <h2 className="text-left text-[#747682]">
          We do the hard work, so you can focus on what matters most.
        </h2>
      </div>

      <Steps />
    </div>
  );
}
