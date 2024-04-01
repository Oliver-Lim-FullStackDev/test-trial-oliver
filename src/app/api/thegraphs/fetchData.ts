import NodeCache from "node-cache";
import { setupRateLimiter } from "./rateLimiter";

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

export const fetchTableData = async (subgraphType: string) => {
  const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
  const cacheKey = `subgraph-data-${subgraphType}`;
  let cachedData = await myCache.get(cacheKey);

  if (cachedData) {
    return cachedData; // Return the cached data if it exists
  }

  const theGraphQuery = `query {
      pools(orderBy: id) {
        token0 {
          symbol
        }
        token1 {
          symbol
        }
        txCount
        volumeUSD
        liquidity
        totalValueLockedUSD
      }
    }`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: theGraphQuery,
    }),
  };
  const queryURL = `https://api.thegraph.com/subgraphs/name/${subgraphType}`;
  try {
    //Check rate limit before making the call
    await setupRateLimiter(subgraphType);
    // Fetch the data from the subgraph
    const response = await fetch(queryURL, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const queryResult = await response.json();
    const data = queryResult?.data?.pools;

    // Validate the fetched data
    if (!isValidData(data)) {
      throw new Error("Fetched data is not valid");
    }

    // Cache the fetched data
    myCache.set(cacheKey, data);

    return data;
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.log(`Please retry after ${error.retryAfter} seconds.`);
      return {
        error: `Please retry after ${error.retryAfter} seconds.`,
      };
    } else {
      console.error("An unexpected error occurred:", error);
      return {
        error: "An unexpected error occurred.",
      };
    }
  }
};

const isValidData = (data: any) => {
  // Implement your validation logic here
  // For example, you can check if the data is an array and each item has required properties
  if (!Array.isArray(data)) {
    return false;
  }

  for (const item of data) {
    if (
      !item ||
      typeof item !== "object" ||
      !item.token0 ||
      !item.token1 ||
      !item.txCount ||
      !item.volumeUSD ||
      !item.liquidity ||
      !item.totalValueLockedUSD
    ) {
      return false;
    }
  }

  return true;
};
