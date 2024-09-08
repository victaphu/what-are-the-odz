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

const key2 = generatePrivateKey();
const account2 = privateKeyToAccount(key2);
const wallet2 = createWalletClient({  
  account: account2,
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
    const conversations = await this.client!.conversations.list();
    const group = conversations.find(c=>c.name === topic);
    return await group?.send(content);
  }

  async getClientSignature() {
    return this.client!.signatureText!;
  }

  async getMessages(topic: string) {
    // Implement message retrieval logic here
    await this.client!.conversations.sync();
    const groups = await this.client?.conversations.list();
    const group = groups?.find(c=>c.name === topic);
    await group?.sync();
    return await group?.messages();
  }

  async canMessage(address: string) {
    return await this.client!.canMessage([address]);
  }

  async newGroup(addresses: string[], name: string) {
    return await this.client?.conversations.newConversation(addresses, {
      groupName: name,
      permissions: NapiGroupPermissionsOptions.AdminOnly
    });
  }

  async getGroupChats() {
    await this.client!.conversations.sync();
    return await this.client!.conversations.list();
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

export async function getMessages(address: string, topic: string) {
  const xmtpClient = new XMTPClient(address, "dev", `./db/${address}.db3`);
  await xmtpClient.initialize();
  return await xmtpClient.getMessages(topic);
}

export async function canMessage(address: string, targetAddress: string) {
  const xmtpClient = new XMTPClient(address, "dev", `./db/${address}.db3`);
  await xmtpClient.initialize();
  await xmtpClient.canMessage(targetAddress);
}

export async function newGroup(address: string, groupAddresses: string[]) {
  const xmtpClient = new XMTPClient(address, "dev", `./db/${address}.db3`);
  await xmtpClient.initialize();
  return await xmtpClient.newGroup(groupAddresses, 'bob');
}

// export async function symChat() {
//   const xmtpClient = new XMTPClient(account.address, "dev", "./db/" + account.address + ".db3");
//   const xmtpClient2 = new XMTPClient(account2.address, "dev", "./db/" + account2.address + ".db3");
//   await xmtpClient.initialize();
//   await xmtpClient2.initialize();
//   console.log('initialised both clients')
  
//   const sig = await wallet.signMessage({message: await xmtpClient.getClientSignature()})
//   await xmtpClient.register(sig);
//   const sig2 = await wallet2.signMessage({message: await xmtpClient2.getClientSignature()})
//   await xmtpClient2.register(sig2);

//   console.log('registered both');

//   console.log(await xmtpClient.canMessage(account2.address));
//   console.log(await xmtpClient2.canMessage(account.address));
//   const group = await xmtpClient.newGroup([account.address, account2.address], 'bob');
//   console.log(group!.name);

//   const msg = await xmtpClient.postMessage('bob', 'hello, world!');

//   console.log(msg);

//   console.log(await xmtpClient2.getMessages('bob'));
// }