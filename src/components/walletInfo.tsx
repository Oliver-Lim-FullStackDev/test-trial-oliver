import { useConnect, useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { normalize } from "viem/ens";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export function WalletInfo() {
  const { error } = useConnect();
  const { isConnected, address, connector } = useAccount();

  // Fetch ENS name
  const ensName = useEnsName({
    address: address,
  });

  // Fetch ENS avatar
  const ensAvatar = useEnsAvatar({
    name: normalize("vitalik.eth"),
  });

  return (
    <div className="my-3">
      {isConnected && (
        <div className=" items-center justify-center flex flex-col">
          <Avatar className="w-32 h-32 mb-3 border mt-12">
            <AvatarImage
              src={ensAvatar.data ? ensAvatar.data : ""}
              alt="ensAvatar"
            />
            <AvatarFallback>ENS Avatar</AvatarFallback>
          </Avatar>
          <span className="font-bold text-black dark:text-gray-500">
            {connector?.name} / {ensName.data ? ensName.data : "vitalik.eth"}
          </span>
        </div>
      )}
      {error && <div>{error.message}</div>}
    </div>
  );
}
