import { Button, Form } from 'antd';
import React from 'react';
import { InvoiceForm } from './components';
import { useForm } from './hooks/useForm';

export default function App() {
  const { formRef, initialData, onFinish, disabled } = useForm();

  return (
    <Form
      layout="vertical"
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      disabled={disabled}
      scrollToFirstError
      autoComplete="off"
    >
      <InvoiceForm
        form={formRef.current}
        initialData={initialData}
      />

      <Button htmlType="submit">SUBMIT</Button>
    </Form>
  );
}
