"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SvgLogo from "@/public/logo-background-svg.svg";
import PngLogo from "@/public/logo-background-png.png";
import Image from "next/image";
import { ValidLoadSteps } from "@/app/hooks/plaid/usePlaidItem";

const logo = <Image src={PngLogo} width={12} height={12} alt="Logo" />;
const svgLogo = (
  <SvgLogo style={{ width: "12px", height: "12px", color: "white" }} />
);

const loadingStates = [
  "Creating Link",
  "Loading Accounts",
  "Loading Debts",
  "Loading Transactions",
  "All bank information loaded",
];

interface Props {
  linkCreating: boolean;
  linkSuccessful: boolean;
  loadStepInProgress: ValidLoadSteps;
  loadingData: boolean;
}

export default function PlaidItemLoading({
  linkCreating,
  linkSuccessful,
  loadStepInProgress,
  loadingData,
}: Props) {
  const [currentState, setCurrentState] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentState((prevState) => (prevState + 1) % loadingStates.length);
    }, 3000); // Change state every 2 seconds

    return () => clearTimeout(timer);
  }, [currentState]);

  //   useEffect(() => {
  //     if (linkCreating) {
  //       setCurrentState(0);
  //     } else if (linkSuccessful && loadingData) {
  //       if (loadStepInProgress === "accounts") {
  //         setCurrentState(1);
  //       } else if (loadStepInProgress === "debts") {
  //         setCurrentState(2);
  //       } else if (loadStepInProgress === "transactions") {
  //         setCurrentState(3);
  //       }
  //     }
  //   }, [linkCreating, linkSuccessful, loadStepInProgress, loadingData]);

  //  background: "linear-gradient(135deg, #00d1c4 0%,   #8833ff 100%)",
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#8833ff] to-[#00d1c4] rounded-[50px]">
      {/* <Image
        src={PngLogo}
        width={120}
        height={120}
        style={{ position: "absolute", bottom: 0, right: 250 }}
        alt="Logo"
      /> */}

      <div className="relative w-64 h-64">
        {/* Background pulse animation */}
        <SvgLogo
          style={{
            width: "260px",
            height: "260px",
            position: "absolute",
            top: 80,
            left: 50,
            zIndex: 500,
            // top: 800,
            // right: 350,
          }}
          //   className="top-18 left-12"
        />
        <motion.div
          className="absolute inset-0 bg-blue-500 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Rotating circle */}
        <motion.div
          className="absolute inset-0 border-4 border-blue-300 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Text animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentState}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-white text-lg font-bold text-center"
            >
              <div className="z-500">{logo}</div>
              {loadingStates[currentState]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Financial symbols */}
        <FinancialSymbols />
      </div>
    </div>
  );
}

function FinancialSymbols() {
  const symbols = ["$", "€", "£", "¥", "%"]; //, "📊", "💹"];
  return (
    <>
      {symbols.map((symbol, index) => (
        <motion.div
          key={index}
          className="absolute text-blue-300 text-2xl"
          initial={{
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.5,
          }}
        >
          {symbol}
        </motion.div>
      ))}
    </>
  );
}
