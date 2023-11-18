import { Col, Form, Input, Row, Select } from 'antd';
import React from 'react';

export default function App() {
  const [form] = Form.useForm();

  return (
    <Form layout="vertical" form={form}>
      <Row gutter={[8, 8]} align="bottom">
        <Col md={12} sm={24} xs={24}>
          <Form.Item label="Status" name="status">
            <Select
              options={[
                ...['Assigned', 'Unassigned'].map((type) => ({
                  value: type,
                  label: type.toUpperCase(),
                })),
              ]}
              allowClear
              placeholder="Status"
            />
          </Form.Item>
        </Col>

        <Col md={12} sm={24} xs={24}>
          <Form.Item label="Sort By" name="sortBy">
            <Select
              options={[
                ...['Creation Date', 'Due Date'].map((type) => ({
                  value: type,
                  label: type.toUpperCase(),
                })),
              ]}
              allowClear
              placeholder="Sort By"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
