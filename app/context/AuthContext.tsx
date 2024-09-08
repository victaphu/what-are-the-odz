
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider, UserInfo, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import EthereumRPC from "@/app/context/blockchain/ethRPC";
import { useXMTP } from './blockchain/xmtpClient';

export interface UserBalance {
  balance: number;
  staked: number;
  claimable: number;
}

interface AuthContextType {
  user: UserInfo & { evmAddress: string } | null;
  userBalance: UserBalance;
  provider: any | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  claim: () => void;
  refresh: () => void;
  refreshBalance: () => void;
  claiming: boolean;
  updateBalance: (balance: number, staked: number) => void;
  ethRPC: EthereumRPC | undefined;
}

const clientId = "BMDRGb6RMIj_u4k8FEmrjUTVyUTOs-xP_nQIcCfX9FAoS98ZLUo1hWeLdDYU_MM_a99l31FiJPQgS8SqCx6KHlw"; // Get this from Web3Auth Dashboard
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
  uiConfig: {
    appName: "What are the Odz?",
    mode: "dark",
    loginMethodsOrder: ["google"],
    logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
    logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
  },
});

const MODAL_PROPS = {
  modalConfig: {
    [WALLET_ADAPTERS.OPENLOGIN]: {
      label: "openlogin",
      loginMethods: {
        google: {
          name: "google login",
          logoDark: "url to your custom logo which will shown in dark mode",
        },
        twitter: {
          name: 'twitter',
          showOnModal: true,
        },
        facebook: {
          name: 'facebook',
          showOnModal: true,
        },
        github: {
          name: 'github',
          showOnModal: false,
        },
        reddit: {
          name: 'reddit',
          showOnModal: false,
        },
        discord: {
          name: 'discord',
          showOnModal: false,
        },
        twitch: {
          name: 'twitch',
          showOnModal: false,
        },
        apple: {
          name: 'apple',
          showOnModal: true,
        },
        line: {
          name: 'line',
          showOnModal: false,
        },
        kakao: {
          name: 'kakao',
          showOnModal: false,
        },
        linkedin: {
          name: 'linkedin',
          showOnModal: false,
        },
        weibo: {
          name: 'weibo',
          showOnModal: false,
        },
        wechat: {
          name: 'wechat',
          showOnModal: false,
        },
        email_passwordless: {
          name: 'email_passwordless',
          showOnModal: false,
        },
        farcaster: {
          name: 'farcaster',
          showOnModal: false,
        }
      },
      // setting it to false will hide all social login methods from modal.
      showOnModal: true,
    },
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo & { evmAddress: string } | null>(null)
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [loading, setLoading] = useState(true);
  const [userBalance, setUserBalance] = useState<UserBalance>({ balance: 1000, staked: 100, claimable: 920 });
  const [claiming, setClaiming] = useState(false);
  const [ethRPC, setEthRPC] = useState<EthereumRPC | undefined>();

  const { register, getMessageToSign } = useXMTP();

  const getUser = async () => {
    const userInfo = await web3auth.getUserInfo() as UserInfo;
    const pregen = await fetch(`https://lookup.web3auth.io/lookup?verifier=${userInfo.verifier}&verifierId=${userInfo.verifierId}&web3AuthNetwork=sapphire_devnet&clientId=${clientId}&`);
    const userData = await pregen.json();
    setUser({ ...userInfo, evmAddress: userData.data.evmAddress });
  }

  const registerUser = async (ethRPC: EthereumRPC) => {

    // user may or maynot be registered ...
    const message = await getMessageToSign(await ethRPC.getAccount());
    console.log(message);
    const signature = await ethRPC.signMessage(message);

    console.log(message, signature, await ethRPC.getAccount());

    const result = await register(await ethRPC.getAccount(), signature);
    console.log(result);
  }

  const updateBalance = async (balance: number, staked: number) => {
    setUserBalance({ balance, staked, claimable: userBalance.claimable });
  }

  const refresh = async () => {
    try {
      setLoading(true);
      await web3auth.initModal(MODAL_PROPS)
      setProvider(web3auth.provider);
      const ethRPC = new EthereumRPC(web3auth.provider!);
      setEthRPC(ethRPC);
      if (web3auth.connected) {
        await getUser();
        await registerUser(ethRPC);
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  const refreshBalance = async () => {
    setUserBalance({ balance: userBalance.balance, staked: 100, claimable: 920 });
  }

  const claim = async () => {
    setClaiming(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      setUserBalance({ balance: userBalance.balance + userBalance.claimable, staked: 100, claimable: 0 });
    }
    finally {
      setClaiming(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [])

  const login = async () => {
    try {
      setLoading(true);
      const web3authProvider = await web3auth.connect()
      setProvider(web3authProvider)
      const ethRPC = new EthereumRPC(web3auth.provider!);
      setEthRPC(ethRPC);
      if (web3auth.connected) {
        await getUser();
        await registerUser(ethRPC);
      }
    } catch (error) {
      console.error(error)
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    setLoading(true);
    try {
      await web3auth.logout();
      setProvider(null);
      setEthRPC(undefined);
      setUser(null);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ ethRPC, updateBalance, user, provider, login, logout, refresh, loading, userBalance, refreshBalance, claim, claiming }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

