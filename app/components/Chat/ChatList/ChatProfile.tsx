import { useAuth } from "@/app/context/AuthContext";
import { Avatar, Button, Col, Row, Space, Statistic, Typography } from "antd";
import { useRouter } from "next/navigation";
import { CloseOutlined } from "@ant-design/icons";

interface ChatProfile {
  closeProfile: () => void;
}

const { Text } = Typography;

const odzBalance = 1000; // Replace with actual balance fetching logic
const stakedAmount = 500; // Replace with actual staked amount fetching logic


export const ChatProfile = (props: ChatProfile) => {

  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const capitalize = (str: string, lower = true) => {
    return (lower ? str.toLowerCase() : str).replace(
      /(?:^|\s|["'([{])+\S/g,
      (match) => match.toUpperCase()
    );
  };

  const onDisconnect = () => {
    logout();
    router.push('/connect');
  }

  if (loading || !user) {
    return <div className="loading-image main-loader"><img src={'/images/loading.svg'} alt="" /></div>
  }

  return (
    <div className="chat-profile-container" style={{ 'padding': '10px', 'height': '600px' }}>
      <Row gutter={[16, 16]} justify="center">
        <Col span={24} style={{ textAlign: 'center', position: 'relative' }}>
          <Avatar
            src={user!.profileImage || '/images/empty.png'}
            alt={user!.name}
            size={120}
          />

          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={props.closeProfile}
            style={{ position: 'absolute', top: 0, right: 10 }}
          />
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Typography.Title level={2} style={{ color: 'var(--active-title)' }}>
            {capitalize(decodeURIComponent(user!.name || 'Fren'))}
          </Typography.Title>
          <Typography.Text style={{ color: 'var(--active-subtitle)' }}>
            {(user!.evmAddress)}
          </Typography.Text>
        </Col>

        <Col span={24} style={{ textAlign: 'center' }}>
          <Space direction="horizontal" size="small" style={{ flex: 1, gap: '8px' }}>
            <Statistic
              className='chat-card-activity-time'
              title={<Text strong style={{ fontSize: '10px' }} className='chat-card-activity-time'>ODZ Balance</Text>}
              value={odzBalance}
              prefix="ᙇ"
              precision={2}
              valueStyle={{ fontSize: '16px', color: 'var(--active-title)' }}
            />
            <Statistic
              className='chat-card-activity-time'
              title={<Text strong style={{ fontSize: '10px' }} className='chat-card-activity-time'>Staked</Text>}
              value={stakedAmount}
              prefix="ᙇ"
              precision={2}
              valueStyle={{ fontSize: '16px', color: 'var(--active-title)' }}
            />
          </Space>
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button>Claim ᙇ1000.000</Button>
        </Col>


        <Col span={24} style={{ textAlign: 'center' }}>
          <Space>
            <Button type="primary" onClick={() => {/* Implement explorer details view */ }}>
              View Explorer
            </Button>
            <Button danger onClick={onDisconnect}>Disconnect</Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
}  