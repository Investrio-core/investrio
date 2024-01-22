import { RateLimiter } from "limiter";

export const limiter = new RateLimiter({
    tokensPerInterval: 300,
    interval: "min",
    fireImmediately: true,
})