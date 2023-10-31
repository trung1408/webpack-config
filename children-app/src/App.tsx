import React, { useCallback, useEffect } from 'react';
import { Col, Row, Typography, Form, Input, Button } from 'antd';

const { Title } = Typography;

const MAIN_DOP_HOST = 'http://localhost:8000';

export default function App() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const { firstName, lastName } = values;
    sendMessageToParent({ firstName, lastName });
  };

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.origin === MAIN_DOP_HOST) {
        console.log('[Children] Received message from parent app:', event.data);
        const { firstName, lastName } = event.data;
        form.setFieldsValue({ firstName, lastName });
  
        // Send a response back to the parent
        if (event.source) {
          event.source.postMessage({ message: 'Children already received data' }, MAIN_DOP_HOST as any);
        }
      }
    });
  }, []);
  
  const sendMessageToParent = useCallback((message: unknown) => {
    console.log('[CHILD] sendMessageToParent', message);
    window.parent.postMessage(message, MAIN_DOP_HOST);
  }, []);

  return (
    <Row gutter={16}>
      <Col span={20} offset={2}>
        <Title level={4}>[Children] Building sample form</Title>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item label="First name" name="firstName">
            <Input placeholder="input first name" />
          </Form.Item>
          <Form.Item label="Last name" name="lastName">
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
