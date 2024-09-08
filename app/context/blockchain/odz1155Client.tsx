import { Account, getContract, PublicClient } from 'viem';
import { WalletClient } from 'viem';
import abi from '@/app/abi/contracts/Odz1155.sol/Odz1155.json';


export class Odz1155Client {
  private contract: any;
  private publicClient: PublicClient;
  private account: any;

  constructor(contractAddress:  `0x${string}`, walletClient: WalletClient, publicClient: PublicClient) {
    this.contract = getContract({
      address: contractAddress,
      abi: abi.abi,
      client: { wallet: walletClient, public: publicClient },
    });

    this.publicClient = publicClient;
    walletClient.getAddresses().then(addresses => this.account = addresses[0]);
  }

  async createEvent(startTime: number, endTime: number): Promise<void> {

    // console.log('contract account is', this.account);
    const { request } = await this.publicClient.simulateContract({
      address: this.contract.address,
      abi: abi.abi,
      functionName: 'createEvent',
      args: [startTime, endTime],
      account: this.account
    });
    await this.contract.write.writeContract(request);
  }

  async proposeQuestion(eventId: number, choiceCount: number): Promise<void> {

    const { request } = await this.publicClient.simulateContract({
      address: this.contract.address,
      abi: abi.abi,
      functionName: 'proposeQuestion',
      args: [eventId, choiceCount],
      account: this.account
    });
    await this.contract.wallet.writeContract(request);
  }

  async joinEvent(eventId: number): Promise<void> {

    const { request } = await this.publicClient.simulateContract({
      address: this.contract.address,
      abi: abi.abi,
      functionName: 'joinEvent',
      args: [eventId],
      account: this.account
    });
    await this.contract.wallet.writeContract(request);
  }

  async placeBet(eventId: number, questionId: number, choiceId: number): Promise<void> {

    const { request } = await this.publicClient.simulateContract({
      address: this.contract.address,
      abi: abi.abi,
      functionName: 'placeBet',
      args: [eventId, questionId, choiceId],
      account: this.account
    });
    await this.contract.wallet.writeContract(request);
  }

  async getEventDetails(eventId: number) {
    return await this.contract.read.getEventDetails([eventId]);
  }

  async getEvents() {
    return await this.contract.read.getEvents();
  }
}