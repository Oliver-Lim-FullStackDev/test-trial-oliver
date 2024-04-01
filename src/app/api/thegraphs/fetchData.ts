import NodeCache from "node-cache";
export const fetchTableData = async (subgraphType: string) => {
  const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
  const cacheKey = `subgraph-data-${subgraphType}`;
  let cachedData = await myCache.get(cacheKey);

  if (cachedData) {
    return cachedData; // Return the cached data if it exists
  }

  try {
    const uniswapGraphQuery = `query {
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
        query: uniswapGraphQuery,
      }),
    };
    const queryURL = `https://api.thegraph.com/subgraphs/name/${subgraphType}`;
    const response = await fetch(queryURL, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const queryResult = await response.json();
    const data = queryResult?.data?.pools;

    // Cache the fetched data
    myCache.set(cacheKey, data);

    return data;
  } catch (error) {
    console.error(error);
  }
};
