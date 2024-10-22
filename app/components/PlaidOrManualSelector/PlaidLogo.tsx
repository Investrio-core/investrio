import PlaidSvg from "/public/icons/plaid-icon.svg";

export default function PlaidLogo({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return <PlaidSvg width={width} height={height} />;
}

// import Image from "next/image";

// export default function ({ width, height }: { width: number; height: number }) {
//   return (
//     <Image
//       src={"/icons/plaid-icon.png"}
//       alt="Plaid Logo"
//       width={width}
//       height={height}
//     />
//   );
// }
