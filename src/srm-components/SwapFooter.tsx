import React from 'react';
import { Layout, Row, Col } from 'antd';
import Link from './Link';
const { Footer } = Layout;

const footerElements = [
  { description: 'Blog', link: '#' },
  { description: 'Twitter', link: '#' },
  { description: 'Telegram', link: '#' },
  { description: 'Discord', link: '#' },
  { description: 'Instagram', link: '#' },
  { description: 'LinkedIn', link: '#' },
];

export const SwapFooter = () => {
  return (
    <Footer
      role="isExistFooterComponent"
      style={{
        height: '59px',
        background: '#1A1B1C',
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
                  fontFamily: '"Spy Agency", sans-serif',
                  fontSize: '14px',
                  fontStyle: 'normal',
                }}
                external
                to={elem.link}
              >
                {elem.description}
              </Link>
            </Col>
          );
        })}
      </Row>
    </Footer>
  );
};
