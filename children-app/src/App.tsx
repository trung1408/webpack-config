import { Form, Input } from 'antd';
import React from 'react';
import { useForm } from './hooks/useForm';

export default function App() {
  const { formRef, onFinish, disabled } = useForm();

  return (
    <Form
      layout="vertical"
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      disabled={disabled}
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
