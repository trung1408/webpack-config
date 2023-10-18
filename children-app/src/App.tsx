import React from 'react';
import { Col, Row, Typography, Form, Input, Button } from 'antd';

const { Title } = Typography;

export default function App() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row gutter={16}>
      <Col span={20} offset={2}>
        <Title level={4}>Building sample form - children</Title>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item label="First name" name="firstname">
            <Input placeholder="input first name" />
          </Form.Item>
          <Form.Item label="Last name" name="lastname">
            <Input placeholder="input last name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
