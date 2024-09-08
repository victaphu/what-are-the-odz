import { IProvider } from "@web3auth/base";
import { ethers } from "ethers";
import { PublicClient, WalletClient, createPublicClient, createWalletClient, custom, formatEther, parseEther } from "viem";
import { arbitrumSepolia, sepolia } from "viem/chains";

export default class EthereumRPC {
  readonly walletClient: WalletClient;
  readonly publicClient: PublicClient;
  readonly provider: IProvider;

  constructor(provider: IProvider) {
    this.publicClient = createPublicClient({
      chain: arbitrumSepolia,
      transport: custom(provider)
    })

    this.walletClient = createWalletClient({
      chain: arbitrumSepolia,
      transport: custom(provider),
    });

    this.provider = provider;
  }

  async getAccount(): Promise<any> {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider);
      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      return await address;
    } catch (error) {
      return error;
    }
  }

  async getWalletClient(): Promise<WalletClient> {
    return this.walletClient;
  }

  async getPublicClient(): Promise<PublicClient> {
    return this.publicClient;
  }

  async fetchBalance(): Promise<string> {
    const address = await this.getAccount();
    const balance = await this.publicClient.getBalance({ address: address as any });
    return formatEther(balance);
  }

  async signMessage(message: string): Promise<string> {

    const address = await this.getAccount();
    console.log('signing using', address);
    // Sign the message
    const hash = await this.walletClient.signMessage({
      account: address as any,
      message: message
    });

    return hash;
  }

  async sendTransaction(): Promise<string> {
    const amount = parseEther("0.0001");
    const address = await this.getAccount();

    // Submit transaction to the blockchain
    const response = await this.walletClient.sendTransaction({
      account: address as any,
      to: address as any,
      value: amount,
      chain: arbitrumSepolia,
    });

    return response;
  }
}