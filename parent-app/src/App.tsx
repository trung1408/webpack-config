import { Col, Row, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

export default function App() {
  return (
    <Row gutter={16}>
      <Col span={20} offset={2}>
        <Title level={4}>Parent app</Title>
        
        <iframe src="http://127.0.0.1:50023/dist/index.html" width="100%" height={500} frameBorder="0" />
      </Col>
    </Row>
  );
}
