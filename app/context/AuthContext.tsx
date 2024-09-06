
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider, UserInfo, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";

interface AuthContextType {
  user: UserInfo & { evmAddress: string } | null;
  provider: any | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  refresh: () => void;
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

  const getUser = async () => {
    const userInfo = await web3auth.getUserInfo() as UserInfo;
    const pregen = await fetch(`https://lookup.web3auth.io/lookup?verifier=${userInfo.verifier}&verifierId=${userInfo.verifierId}&web3AuthNetwork=sapphire_devnet&clientId=${clientId}&`);
    const userData = await pregen.json();
    setUser({ ...userInfo, evmAddress: userData.data.evmAddress });
  }

  const refresh = async () => {
    try {
      setLoading(true);
      await web3auth.initModal(MODAL_PROPS)
      setProvider(web3auth.provider);

      if (web3auth.connected) {
        await getUser();
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
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
      await getUser();
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
      await web3auth.logout()
      setProvider(null)
      setUser(null)
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, provider, login, logout, refresh, loading }}>
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

