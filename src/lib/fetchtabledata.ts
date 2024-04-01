import { fetchTableData } from "@/app/api/thegraphs/fetchData";

export async function getStaticProps() {
  const UNISWAP_URL = "uniswap/uniswap-v3";
  const PANCAKESWAP_URL = "pancakeswap/exchange-v3-eth";
  // Fetch data for Uniswap and Pancakeswap
  const uniswapData = await fetchTableData(UNISWAP_URL);
  const pancakeswapData = await fetchTableData(PANCAKESWAP_URL);

  return {
    props: {
      uniswapData,
      pancakeswapData,
    },
    // Revalidate at most once every 10 seconds
    revalidate: 30,
  };
}
