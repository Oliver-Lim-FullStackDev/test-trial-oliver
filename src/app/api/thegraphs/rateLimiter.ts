import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// const redis = Redis.fromEnv(); // Assumes you have REDIS_URL in your environment variables

const redis = new Redis({
  url: "https://usw1-natural-mako-34028.upstash.io",
  token:
    "AYTsACQgNzMxYmMzYjItNjYyZS00MjM5LWFiYjItZDQxMDBkNTc2NjMyZGFkZWI2YWM4NzQ1NDQ0NDg0MDYzZDI4ODNmMWUxMTk=",
});

class RateLimitError extends Error {
  retryAfter: number;

  constructor(message: string, retryAfter: number) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;

    //Set the prototype explicitly.
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

// Configure the rate limiter
const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"), // Allows 100 requests per hour
});

export const setupRateLimiter = async (key: any) => {
  const { success, reset } = await rateLimiter.limit(key);
  if (!success) {
    // If not successful, throw an error with the retry-after time
    const now = Date.now();
    const retryAfter = Math.floor((reset - now) / 1000);
    throw new RateLimitError(
      "Too many requests. Please try again later.",
      retryAfter
    );
  }
};
