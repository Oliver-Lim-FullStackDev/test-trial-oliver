export const fetchTableData = async (subgraphType: string) => {
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
    const queryResult = await response.json();
    return queryResult?.data?.pools;
  } catch (error) {
    console.log(error);
  }
};
