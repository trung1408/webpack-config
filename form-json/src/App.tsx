import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Switch,
  Typography,
} from 'antd';
import React, { useCallback } from 'react';
import { useForm } from './hooks/useForm';
import { formComponentTemplate } from './data';
import { ComponentType } from './constants';

const { Text } = Typography;
const { Option } = Select;

export default function App() {
  const { formRef, onFinish, disabled } = useForm();

  const initialFormComponent = useCallback(() => {
    console.log('formComponentTemplate.components', formComponentTemplate.components);
    return (formComponentTemplate.components || []).map((element) => {

      // TODO: Handle to group item by layout row => show by columns

      if (element.type === ComponentType.TEXT) {
        return <Text>{element.text}</Text>;
      }

      if (element.type === ComponentType.TEXT_FIELD) {
        return (
          <Form.Item
            label={element.label || element.dateLabel}
            name={element.key}
            rules={element.rules}
          >
            <Input placeholder={element.description} />
          </Form.Item>
        );
      }

      if (element.type === ComponentType.TEXTAREA_FIELD) {
        return (
          <Form.Item
            label={element.label || element.dateLabel}
            name={element.key}
            rules={element.rules}
          >
            <Input.TextArea placeholder={element.description} showCount />
          </Form.Item>
        );
      }

      if (element.type === ComponentType.SELECT) {
        return (
          <Form.Item
            label={element.label}
            name={element.key}
            rules={element.rules}
          >
            <Select placeholder={element.description} allowClear>
              {element.values?.map((it) => (
                <Option value={it.value}>{it.label}</Option>
              ))}
            </Select>
          </Form.Item>
        );
      }

      if (element.type === ComponentType.DATE_TIME) {
        return (
          <Form.Item
            label={element.label || element.dateLabel}
            name={element.key}
            rules={element.rules}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        );
      }

      if (element.type === ComponentType.SWITCH) {
        return (
          <Form.Item
            label={element.label || element.dateLabel}
            name={element.key}
            rules={element.rules}
          >
            <Switch />
          </Form.Item>
        );
      }

      if (element.type === ComponentType.CHECKBOX) {
        return (
          <Form.Item
            label={element.label || element.dateLabel}
            name={element.key}
            rules={element.rules}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                {element.values?.map((it) => (
                  <Col span={8}>
                    <Checkbox value={it.value}>
                      {it.label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        );
      }

      return (
        <Form.Item
          label={element.label || element.dateLabel}
          name={element.key}
          rules={element.rules}
        >
          <Input.TextArea placeholder={element.description} showCount />
        </Form.Item>
      );
    });
  }, [formComponentTemplate]);

  return (
    <Form
      layout="vertical"
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      disabled={disabled}
    >
      {initialFormComponent()}

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}
