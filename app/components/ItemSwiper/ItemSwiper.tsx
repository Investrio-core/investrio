"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Home,
  BarChart2,
  User,
  CreditCard,
  Briefcase,
  ArrowBigRightDash,
  Merge,
} from "lucide-react";
import confetti from "canvas-confetti";
import SwipeRightIcon from "@/public/icons/material-symbols_swipe-right.svg";
import SwipeLeftIcon from "@/public/icons/material-symbols_swipe-left.svg";

const expenses = [
  {
    id: 1,
    name: "Notion",
    type: "Subscription",
    amount: 25.0,
    logo: "N",
    category: "Software",
    date: "September 10th, 2024",
    recurring: "Issued every 10th each month",
    tags: ["Software", "Have tax deduction", "Recurring expense"],
    note: "Notion from September subscriptions",
  },
  {
    id: 2,
    name: "Spotify",
    type: "Subscription",
    amount: 9.99,
    logo: "S",
    category: "Entertainment",
    date: "September 15th, 2024",
    recurring: "Issued every 15th each month",
    tags: ["Entertainment", "Recurring expense"],
    note: "Monthly music streaming service",
  },
  {
    id: 3,
    name: "Adobe",
    type: "Subscription",
    amount: 52.99,
    logo: "A",
    category: "Software",
    date: "September 20th, 2024",
    recurring: "Issued every 20th each month",
    tags: ["Software", "Have tax deduction", "Recurring expense"],
    note: "Creative Cloud subscription",
  },
];

interface Props<T> {
  extraCategory: { label: string; value: string };
  label: string;
  persistHandleSwipe?: (
    direction: "left" | "right" | "MIXED",
    account: T,
    customCategory?: string
  ) => void;
  itemsToClassify: T[];
  RenderToFront?: (item: T) => JSX.Element;
  RenderToBack?: (item: T) => JSX.Element;
  cardHeight?: string | number;
  maxHeight?: string | number;
}

export default function ItemSwiper<T>({
  extraCategory,
  label,
  persistHandleSwipe,
  itemsToClassify,
  RenderToFront,
  RenderToBack,
  cardHeight,
  maxHeight,
}: Props<T>) {
  const [items, setItems] = useState(itemsToClassify ?? expenses);
  const [flipped, setFlipped] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const constraintsRef = useRef(null);

  const x1 = useMotionValue(0);
  const rotate1 = useTransform(x1, [-300, 0, 300], [-30, 0, 30]);
  const opacity1 = useTransform(x1, [-300, 0, 300], [0, 1, 0]);

  const x2 = useMotionValue(0);
  const rotate2 = useTransform(x2, [-300, 0, 300], [-30, 0, 30]);
  const opacity2 = useTransform(x2, [-300, 0, 300], [0, 1, 0]);

  const handleSwipe = (
    direction: "left" | "right" | undefined,
    account: T,
    customCategory?: string
  ) => {
    persistHandleSwipe &&
      persistHandleSwipe(direction, account, customCategory);

    nextItem();
  };

  const nextItem = () => {
    setItems((prevState) => prevState.slice(1));
    setFlipped(false);
    setActiveIndex((prevIndex) => (prevIndex + 1) % 2);
    if (items.length === 1) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 300);
    }
  };

  useEffect(() => {
    x1.set(0);
    rotate1.set(0);
    x2.set(0);
    rotate2.set(0);
  }, [items]);

  const flipCard = () => {
    setFlipped(!flipped);
  };

  const getMotionValues = (index: number) => {
    if (index === 0) {
      return {
        x: activeIndex % 2 === 0 ? x1 : x2,
        rotate: activeIndex % 2 === 0 ? rotate1 : rotate2,
        opacity: activeIndex % 2 === 0 ? opacity1 : opacity2,
      };
    }
    return { x: 0, rotate: index % 2 === 0 ? -4.453 : 4.782, opacity: 1 };
  };

  const calculateTopPosition = (cardHeight: string | number) => {
    if (cardHeight === undefined) return 0;
    if (typeof cardHeight === "number") {
      return cardHeight / 2;
      // return `calc(50% - ${cardHeight / 2}px)`;
    }
    const [height] = cardHeight.split("px");
    const topPosition = parseInt(height, 10) / 2;
    return topPosition;
    // return `calc(50% - ${parseInt(height, 10) / 2}px)`;
  };

  const noItems = items?.length === 0 || items?.[0] === undefined;

  return (
    // <div className="min-h-screen bg-gradient-to-b from-[#7F3DFF] via-[#9966FF] to-[#7F3DFF] text-white p-4 sm:p-6 flex flex-col">
    <div
      className="relative flex flex-col py-4"
      // className={`relative ${
      //   maxHeight
      //     ? `min-h-[${maxHeight}] max-h-[${maxHeight}]`
      //     : `min-h-[465px] max-h-[465px]`
      // } flex flex-col`}
      style={{
        maxHeight: maxHeight ? maxHeight : "100%",
        minHeight: maxHeight ? maxHeight : "100%",
      }}

      // className={`
      //   min-h-${maxHeight ? `[${maxHeight}]` : "screen"} max-h-${
      //   maxHeight ? `[${maxHeight}]` : "screen"
      // }
      // }] flex flex-col`}
    >
      {/* <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Good Morning Larry! 👋
        </h1>
      </header> */}

      {/* <nav className="flex space-x-2 sm:space-x-4 mb-4 sm:mb-6">
        <button className="bg-white text-[#7F3DFF] px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-sm sm:text-base">
          Expenses
        </button>
        <button className="text-white/70 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
          Cashflow
        </button>
        <button className="text-white/70 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base">
          Tax
        </button>
      </nav> */}

      <p
        className="text-center text-xl text-[#8833ff]"
        style={{ fontSize: "1.5rem", fontWeight: "bold", lineHeight: "2rem" }}
      >
        {items.length > 0 ? (
          <div className="mb-6">
            Swipe Your {label !== undefined ? label : "Accounts"}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div>🎉</div>
            <div>Classification Complete</div>
            <div>🎉</div>
          </div>
        )}
      </p>

      <div className="absolute top-[20%] right-0 w-[524px] h-[724px] bg-[#b9b0e6]/75 rounded-full blur-[200px]" />
      <div
        ref={constraintsRef}
        className="relative w-full max-w-[300px] h-[500px] mx-auto flex items-center justify-center overflow-visible"
      >
        <div className="absolute inset-0 bg-transparent opacity-50 rounded-3xl" />
        <AnimatePresence mode="popLayout">
          {items.length > 0 ? (
            items.map((item, index) => {
              // console.log("item");
              // console.log(item);

              const isCurrentItem = index === 0;
              const { x, rotate, opacity } = getMotionValues(index);
              return (
                <motion.div
                  key={item.id}
                  className={`absolute h-[${
                    cardHeight ?? "425px"
                  }] w-full bg-white rounded-3xl shadow-lg cursor-pointer`}
                  style={{
                    zIndex: items.length - index,
                    opacity: isCurrentItem ? 1 : 1 - index * 0.4,
                    rotate: isCurrentItem
                      ? rotate
                      : index % 2 === 0
                      ? "-4.453deg"
                      : "4.782deg",
                    y: index * -3,
                    x: isCurrentItem ? x : 0,
                    top: -calculateTopPosition(cardHeight),
                  }}
                  animate={
                    isCurrentItem
                      ? { x, rotate, opacity }
                      : { x: 0, rotate: index % 2 === 0 ? -4.453 : 4.782 }
                  }
                  drag={isCurrentItem ? "x" : false}
                  dragConstraints={constraintsRef}
                  dragElastic={0.1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe =
                      offset.x > 25 ? "right" : offset.x < -25 ? "left" : null;
                    if (swipe) {
                      handleSwipe(swipe, item);
                    } else {
                      x.set(0);
                      rotate.set(0);
                    }
                  }}
                  onClick={isCurrentItem ? flipCard : undefined}
                  initial={isCurrentItem ? { scale: 0.8, opacity: 0 } : false}
                  animate={isCurrentItem ? { scale: 1, opacity: 1 } : {}}
                  exit={{
                    x: x,
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="w-full h-full w-fit h-fit rounded-3xl"
                    initial={false}
                    animate={{ rotateY: flipped && isCurrentItem ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front of the card */}
                    <motion.div
                      className="absolute w-full h-full w-fit h-fit backface-hidden"
                      style={{
                        opacity: flipped && isCurrentItem ? 0 : 1,
                        transition: "opacity 0.3s",
                      }}
                    >
                      {RenderToFront ? (
                        <RenderToFront {...item} />
                      ) : (
                        <div className="p-[8px] flex flex-col items-center justify-center h-full">
                          <img
                            src={`/placeholder.svg?height=80&width=80&text=${item.category}`}
                            alt={item.category}
                            className="w-[110%] h-[75%] mb-4 rounded-[25px] object-cover"
                          />
                          <h2 className="text-2xl font-bold text-[#333333] text-center self-start justify-self-start font-['Sora']">
                            {item.name}
                          </h2>
                          <p className="text-[32px] font-bold text-[#333333] self-start justify-self-start font-['Sora']">
                            {item?.amount?.toFixed
                              ? `$${item?.amount?.toFixed(2)}`
                              : ""}
                          </p>
                        </div>
                      )}
                    </motion.div>

                    {/* Back of the card */}
                    <motion.div
                      className="absolute w-full h-full min-h-full w-fit h-fit backface-hidden bg-white"
                      style={{
                        transform: "rotateY(180deg)",
                        opacity: flipped && isCurrentItem ? 1 : 0,
                        transition: "opacity 0.3s",
                      }}
                    >
                      {RenderToBack ? (
                        <RenderToBack {...item} />
                      ) : (
                        <div className="p-4 mx-[16px] bg-white">
                          <div className="flex items-center mb-2">
                            <div className="bg-[#7F3DFF] w-8 h-8 rounded-xl flex items-center justify-center mr-3">
                              <span className="text-base font-bold text-white">
                                {item.logo}
                              </span>
                            </div>
                            <h2 className="text-lg font-bold text-[#7F3DFF]">
                              {item.name} {item.type}
                            </h2>
                          </div>
                          <p className="text-gray-600 text-xs mb-2">
                            {item.date}
                          </p>
                          <p className="text-gray-600 text-xs mb-2">
                            {item.recurring}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {item?.note ? (
                            <p className="text-gray-700 text-xs mb-2">
                              Note: {item?.note}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-lg p-6 text-center"
            >
              <h2 className="text-2xl font-bold text-[#7F3DFF] mb-4">
                All Done!
              </h2>
              <p className="text-gray-600">
                You've classified all your {label}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-[24px] z-399 relative max-w-[100%]">
        {!noItems ? (
          <button
            className={`border-[#8833ff] border-[1px] shadow-lg h-12 px-4 py-3 bg-[#b9b0e6] bg-black/[0.66] ${
              noItems ? "/25" : ""
            } rounded-[100px] justify-start items-center gap-3 inline-flex`}
            onClick={() => handleSwipe("left", items?.[0])}
            disabled={noItems}
          >
            <SwipeLeftIcon size={16} className="sm:w-5 sm:h-5" />
            <span className="text-white text-sm font-bold font-['Sora']">
              Business
            </span>
          </button>
        ) : null}
        {noItems ? (
          <button
            className={`relative top-[-45px] h-12 px-4 py-3 bg-[#b9b0e6] rounded-[100px] justify-start items-center gap-3 inline-flex`}
            onClick={() =>
              handleSwipe(undefined, items?.[0], extraCategory.value)
            }
            disabled={noItems}
          >
            <ArrowBigRightDash
              size={24}
              className="sm:w-5 sm:h-5"
              color="white"
            />
            <span className="text-white text-sm font-bold font-['Sora']">
              Continue
            </span>
          </button>
        ) : null}
        {extraCategory && !noItems ? (
          <button
            className={`absolute top-[-60px] h-12 px-4 py-3 bg-[#b9b0e6] ${
              noItems ? "" : ""
            } rounded-[100px] justify-start items-center gap-3 inline-flex`}
            onClick={() =>
              handleSwipe(undefined, items?.[0], extraCategory.value)
            }
            disabled={noItems}
          >
            <Merge size={24} className="sm:w-5 sm:h-5" color="white" />
            <span className="text-white text-sm font-bold font-['Sora']">
              {extraCategory.label}
            </span>
          </button>
        ) : null}
        {!noItems ? (
          <button
            className={`border-[#352068] border-[2px] h-12 px-4 py-3 bg-[#b9b0e6] ${
              noItems ? "/25" : ""
            } rounded-[100px] justify-start items-center gap-3 inline-flex`}
            onClick={() => handleSwipe("right", items?.[0])}
            disabled={noItems}
            style={{
              background: "linear-gradient(135deg, #00d1c4 0%,   #8833ff 100%)",
            }}
          >
            <span className="text-white text-sm font-bold font-['Sora']">
              Personal
            </span>
            <SwipeRightIcon size={16} className="sm:w-5 sm:h-5" />
          </button>
        ) : null}
      </div>

      {/* <nav className="mt-auto flex justify-around py-4">
        <Home className="text-white w-5 h-5 sm:w-6 sm:h-6" />
        <BarChart2 className="text-white/70 w-5 h-5 sm:w-6 sm:h-6" />
        <User className="text-white/70 w-5 h-5 sm:w-6 sm:h-6" />
        <User className="text-white/70 w-5 h-5 sm:w-6 sm:h-6" />
      </nav> */}
    </div>
  );
}
