
import { Odz1155, Odz1155__factory } from '@/app/typechain-types';
import { ethers } from 'ethers';


export class Odz1155Client {
  private contract: Odz1155;

  constructor(contractAddress: string, provider: ethers.Provider) {
    this.contract = Odz1155__factory.connect(contractAddress, provider);
  }

  async createEvent(startTime: number, endTime: number): Promise<void> {
    const tx = await this.contract.createEvent(startTime, endTime);
    await tx.wait();
  }

  async proposeQuestion(eventId: number, choiceCount: number): Promise<void> {
    const tx = await this.contract.proposeQuestion(eventId, choiceCount);
    await tx.wait();
  }

  async joinEvent(eventId: number): Promise<void> {
    const tx = await this.contract.joinEvent(eventId);
    await tx.wait();
  }

  async placeBet(eventId: number, questionId: number, choiceId: number,): Promise<void> {
    const tx = await this.contract.placeBet(eventId, questionId, choiceId);
    await tx.wait();
  }

  async getEventDetails(eventId: number): Promise<Odz1155.ActiveEventInfoStructOutput> {
    return await this.contract.getEventDetails(eventId);
  }

  async getEvents(): Promise<Odz1155.ActiveEventInfoStructOutput[]> {
    return await this.contract.getEvents();
  }
}
