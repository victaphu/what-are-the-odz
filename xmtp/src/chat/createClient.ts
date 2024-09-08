// this API is experimental and may change in the future

import { createWalletClient, http, toBytes } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import { Client } from "@xmtp/mls-client";
import { NapiGroupPermissionsOptions } from '@xmtp/mls-client-bindings-node';

// create a wallet for signing
const key = generatePrivateKey();
const account = privateKeyToAccount(key);
const wallet = createWalletClient({
  account,
  chain: arbitrumSepolia,
  transport: http(),
});

class XMTPClient {
  private client: Client | undefined;
  private initialised: boolean = false;

  constructor(private account: string, private env: "dev" | "production", private dbPath: string) {
    this.initialize();
  }

  async initialize() {
    if (this.initialised) {
      return;
    }

    this.client = await Client.create(this.account, {
      env: this.env,
      dbPath: this.dbPath,
    });
    this.initialised = true;
  }

  async register(signature: string) {
    const signatureBytes = toBytes(signature);
    this.client!.addEcdsaSignature(signatureBytes);
    await this.client!.registerIdentity();
  }

  async postMessage(topic: string, content: string) {
    // Implement message posting logic here
  }

  async getClientSignature() {
    return this.client!.signatureText!;
  }

  async getMessages() {
    // Implement message retrieval logic here
    await this.client!.conversations.sync();
    return await this.client?.conversations.list();
  }

  async canMessage(address: string) {
    console.log(await this.client!.canMessage([address]));
  }

  async newGroup(addresses: string[]) {
    return await this.client?.conversations.newConversation(addresses, {permissions: NapiGroupPermissionsOptions.AdminOnly});
  }

  // Add more methods as needed for various XMTP operations
}

export async function getClientSignature(address: string) {
  const xmtpClient = new XMTPClient(address, "dev", "./db/" + address + ".db3");
  await xmtpClient.initialize();
  return await xmtpClient.getClientSignature();
}

export async function register(address: string, signature: string) {
  const xmtpClient = new XMTPClient(address, "dev", `./db/${address}.db3`);
  await xmtpClient.initialize();
  await xmtpClient.register(signature);
}

export async function postMessage(address: string, topic: string, content: string) {
  const xmtpClient = new XMTPClient(address, "dev", `./db/${address}.db3`);
  await xmtpClient.initialize();
  await xmtpClient.postMessage(topic, content);
}

export async function getMessages(address: string) {
  const xmtpClient = new XMTPClient(address, "dev", `./db/${address}.db3`);
  await xmtpClient.initialize();
  return await xmtpClient.getMessages();
}

export async function canMessage(address: string, targetAddress: string) {
  const xmtpClient = new XMTPClient(address, "dev", `./db/${address}.db3`);
  await xmtpClient.initialize();
  await xmtpClient.canMessage(targetAddress);
}

export async function newGroup(address: string, groupAddresses: string[]) {
  const xmtpClient = new XMTPClient(address, "dev", `./db/${address}.db3`);
  await xmtpClient.initialize();
  return await xmtpClient.newGroup(groupAddresses);
}
