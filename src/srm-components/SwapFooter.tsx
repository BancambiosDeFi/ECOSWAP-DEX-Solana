import { Col, Layout, Row } from 'antd';
import { ReactComponent as FacebookIcon } from '../assets/icons/facebook.svg';
import { ReactComponent as TwitterIcon } from '../assets/icons/twitter.svg';
import { ReactComponent as TelegramIcon } from '../assets/icons/telegram.svg';
import { ReactComponent as DiscordIcon } from '../assets/icons/discord.svg';
import { ReactComponent as InstagramIcon } from '../assets/icons/instagram.svg';
import { ReactComponent as LinkedInIcon } from '../assets/icons/linkedin.svg';
import { useScreenSize } from '../utils/screenSize';
import Link from './Link';

const { Footer } = Layout;

const footerElements = [
  { description: 'Facebook', icon: <FacebookIcon />, link: 'https://www.facebook.com/bancambios' },
  { description: 'Twitter', icon: <TwitterIcon />, link: 'https://twitter.com/bancambios' },
  { description: 'Telegram', icon: <TelegramIcon />, link: 'https://t.me/bancambiosx' },
  { description: 'Discord', icon: <DiscordIcon />, link: 'https://discord.com/invite/BXcommunity' },
  {
    description: 'Instagram',
    icon: <InstagramIcon />,
    link: 'https://www.instagram.com/bancambiosx',
  },
  {
    description: 'LinkedIn',
    icon: <LinkedInIcon />,
    link: 'https://www.linkedin.com/company/bancambios',
  },
];

export const SwapFooter = () => {
  const { isMobile } = useScreenSize();

  return (
    <Footer
      role="isExistFooterComponent"
      style={{
        height: '59px',
        background: '#1B2341',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Row
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
        }}
      >
        {footerElements.map((elem, index) => {
          return (
            <Col key={index + ''}>
              <Link
                style={{
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontFamily: 'Saira',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontStyle: 'normal',
                }}
                external
                to={elem.link}
              >
                {!isMobile ? elem.description : elem.icon}
              </Link>
            </Col>
          );
        })}
      </Row>
    </Footer>
  );
};
