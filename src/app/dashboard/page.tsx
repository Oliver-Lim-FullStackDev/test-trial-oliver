"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { WagmiProvider, useDisconnect } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyTable } from "@/components/tables/table";
import { Button } from "@/components/ui/button";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WalletInfo } from "../../components/walletInfo";

import "@rainbow-me/rainbowkit/styles.css";

const config = getDefaultConfig({
  appName: "dexScreener",
  projectId: "6b15723b212d87a13e4354221564be26",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

const queryClient = new QueryClient();

const SignOutButton = () => {

  const { disconnect } = useDisconnect();
  const signOutHandler = async () => {
    try {
      await signOut({
        callbackUrl: "/login",
      });
      disconnect();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return <Button className="w-24 bg-blue-500 mx-auto mt-60" onClick={signOutHandler}>Log Out</Button>;
};

export default function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      {user && (
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
                  <div className="flex h-full max-h-screen flex-col gap-2">
                    <WalletInfo />
                    <div className="flex items-center justify-center mt-28">
                      <Image
                        src="/images/ethereum-logo.svg"
                        alt="logo"
                        width={100}
                        height={100}
                      />
                      <p className="text-2xl font-semibold text-center">
                        <span className="text-blue-600 text-3xl">DEX</span>
                        <br />
                        Dashboard
                      </p>
                    </div>
                    <SignOutButton />
                  </div>
                </div>
                <div className="flex flex-col">
                  <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="uniswap">Uniswap</TabsTrigger>
                        <TabsTrigger value="pancakeswap">Pancakeswap</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all">
                        <MyTable tabvalue="All" />
                      </TabsContent>
                      <TabsContent value="uniswap">
                        <MyTable tabvalue="Uniswap" />
                      </TabsContent>
                      <TabsContent value="pancakeswap">
                        <MyTable tabvalue="Pancakeswap" />
                      </TabsContent>
                    </Tabs>
                  </main>
                </div>
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      )}
    </>
  );
}
