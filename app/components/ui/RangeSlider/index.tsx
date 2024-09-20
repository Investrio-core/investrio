import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import SliderThumbIcon from "@/public/icons/slider-thumb.svg";

interface Props {
  value?: number;
  iconAsThumb?: React.ReactNode;
  valueSetter: Function;
  min?: number;
  max?: number;
  step?: number;
}

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: "#100D40", // "#3a8589",
  height: 12,
  // padding: "13px 0",
  "& .MuiSlider-thumb": {
    height: 27,
    width: 27,
    backgroundColor: "#fff",
    // border: "1px solid currentColor",
    "&:hover": {
      boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
    },
    "& .bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  "& .MuiSlider-track": {
    height: 3,
  },
  "& .MuiSlider-rail": {
    color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
    opacity: theme.palette.mode === "dark" ? undefined : 1,
    height: 3,
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
  },
}));

interface ThumbComponentProps extends React.HTMLAttributes<unknown> {}

function ThumbComponent(props: ThumbComponentProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      {/* <span className="bar" />
      <span className="bar" />
      <span className="bar" /> */}
      <SliderThumbIcon />
    </SliderThumb>
  );
}

export default function RangeSlider({
  value,
  iconAsThumb,
  valueSetter,
  min = 0,
  max = 20000,
  step = 50,
}: Props) {
  const handleChange = (event: Event, newValue: number | number[]) => {
    valueSetter(newValue as number[]);
  };

  return (
    <CustomSlider
      slots={{ thumb: ThumbComponent }}
      aria-label={"Set income"}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
    />
  );
}
