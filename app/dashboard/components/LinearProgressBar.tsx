import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  //   width: "57.83px",
  width: "30%",
  borderRadius: 100,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#d9d9d9",
    //   theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    // backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    backroundColor: "#00bb00 !important",
  },
  //   .css-5xe99f-MuiLinearProgress-bar1
}));

export default function LinearProgressBar({
  stepsCompleted,
  totalSteps,
  value,
}: {
  value?: number;
  stepsCompleted?: number;
  totalSteps?: number;
}) {
  const progressValue =
    stepsCompleted && totalSteps ? (stepsCompleted / totalSteps) * 100 : value;

  return (
    <BorderLinearProgress
      variant="determinate"
      value={progressValue}
      style={{ color: "#00bb00" }}
    />
  );
}
