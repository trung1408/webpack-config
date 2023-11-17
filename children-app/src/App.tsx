import { Button, Col, Form, FormInstance, Input, Row } from 'antd';
import React, { useCallback, useEffect } from 'react';

// const MAIN_DOP_HOST = 'http://localhost:8000';
const MAIN_DOP_HOST = 'https://dop-v3-dev.vbpo-st.com';

export default function App() {
  const formRef = React.useRef<FormInstance>(null);

  const onFinish = (values: any) => {
    const { firstName, lastName, address } = values;
    sendMessageToParent({
      action: 'SUBMIT',
      data: {
        firstName: {
          value: firstName,
          type: 'String',
        },
        lastName: {
          value: lastName,
          type: 'String',
        },
        address: {
          value: address,
          type: 'String',
        },
      },
    });
  };

  const handleCompleteTask = useCallback(() => {
    formRef.current?.submit();
  }, []);

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.origin === MAIN_DOP_HOST && event.data === 'COMPLETE_TASK') {
        handleCompleteTask();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const sendMessageToParent = useCallback((message: unknown) => {
    console.log('[CHILD] sendMessageToParent', message);
    window.parent.postMessage(message, MAIN_DOP_HOST);
  }, []);

  return (
    <Form
      layout="vertical"
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
    >
      <Form.Item
        label="First name"
        name="firstName"
        rules={[{ required: true, message: 'Please input your first name!' }]}
      >
        <Input placeholder="input first name" />
      </Form.Item>
      <Form.Item
        label="Last name"
        name="lastName"
        rules={[{ required: true, message: 'Please input your last name!' }]}
      >
        <Input placeholder="input last name" />
      </Form.Item>
      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: 'Please input your address!' }]}
      >
        <Input placeholder="input address" />
      </Form.Item>
    </Form>
  );
}
