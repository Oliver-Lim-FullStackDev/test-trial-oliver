"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { useEffect, useRef } from "react";

const config = getDefaultConfig({
  appName: "dexScreener",
  projectId: "6b15723b212d87a13e4354221564be26",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const WalletStatus = () => {
  const { isConnected } = useAccount();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const router = useRouter();
  const isConnectedRef = useRef(false); // Ref to track if redirection has occurred

  useEffect(() => {
    if (isConnected && !isConnectedRef.current) {
      isConnectedRef.current = true; // Update ref to prevent multiple redirects
      router.push(callbackUrl);
    }
  }, [isConnected, router, callbackUrl]);

  return isConnected ? <div>Wallet Connected</div> : <></>;
};

export default function ConnectWallet() {
  const { data: session } = useSession(); 
  const user = session?.user;

  return (
    <>
      {user &&<WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <section className="bg-ct-blue-600  min-h-screen pt-20">
              <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
                <div>
                  <p className="mb-3 text-5xl text-center font-semibold">
                    Connect your wallet
                  </p>
                  <div className="flex justify-center mt-12">
                  <ConnectButton />
                  </div>
                </div>
              </div>
            </section>
            <WalletStatus />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>}
    </>
  );
}
