import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
} from 'antd';
import React, { useCallback } from 'react';
import { IDopOption } from '../interfaces';
import { accountOptions, vendorOptions, wellNameOptions } from '../utils';

const { Panel } = Collapse;
const { confirm } = Modal;

interface InvoiceFormProps {
  initialData?: any;
  disabled?: boolean;
}

export function InvoiceForm({ disabled }: InvoiceFormProps) {
  const showDeleteConfirm = (removeFn: any) => {
    confirm({
      title: 'Are you sure you want to remove this entry?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        removeFn();
      },
      onCancel() {},
    });
  };

  const renderOptions = useCallback((data: IDopOption[]) => {
    return (data || []).map((item: any) => ({
      label: `${item.code}: ${item.name}`,
      value: `${item.code}: ${item.name}`,
    }));
  }, []);

  return (
    <>
      <Form.Item
        label="Account"
        name="account"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Account is required.',
          },
        ]}
      >
        <Select
          showSearch
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())
          }
          placeholder="Select Account"
          options={renderOptions(accountOptions)}
        />
      </Form.Item>

      <Form.Item
        label="Vendor"
        name="vendor"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Vendor is required.',
          },
        ]}
      >
        <Select
          showSearch
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())
          }
          placeholder="Select Vendor"
          options={renderOptions(vendorOptions)}
        />
      </Form.Item>

      <Form.Item
        label="Total Invoice"
        name="totalInvoice"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Total Invoice is required.',
          },
          {
            pattern: /^[0-9]*\.?[0-9]+$/,
            message: 'Please enter a valid number.',
          },
        ]}
      >
        <Input placeholder="Total Invoice" />
      </Form.Item>

      <Form.Item
        label="Invoice Date"
        name="invoiceDate"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Invoice Date is required.',
          },
        ]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Invoice Number"
        name="invoiceNumber"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Invoice Number is required.',
          },
          {
            max: 20,
            message: 'Invoice Number should not exceed 20 characters.',
          },
        ]}
      >
        <Input placeholder="Invoice Number" />
      </Form.Item>

      <Form.Item
        label="Transaction Date"
        name="transactionDate"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Transaction Date is required.',
          },
        ]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
      </Form.Item>

      <Collapse bordered={false} ghost defaultActiveKey={['0', '1']}>
        <Panel header="Well Names" key="0">
          <Form.List name="resultWellName">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={[8, 8]}>
                    <Col span={22}>
                      <Row gutter={[8, 8]}>
                        <Col span={23}>
                          <Form.Item
                            {...restField}
                            hasFeedback
                            name={name}
                            rules={[
                              {
                                required: true,
                                message: 'Missing well name',
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              filterOption={(input, option) =>
                                (option?.label.toLowerCase() ?? '').includes(
                                  input.toLowerCase()
                                )
                              }
                              placeholder="Select Well Name"
                              options={renderOptions(wellNameOptions)}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={1}>
                          <Button
                            type="default"
                            onClick={() =>
                              showDeleteConfirm(() => remove(name))
                            }
                          >
                            X
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Col>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add Well Name
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Panel>

        <Panel header="Items and Amounts" key="1">
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={[8, 8]}>
                    <Col span={16}>
                      <Form.Item
                        {...restField}
                        name={[name, 'itemName']}
                        hasFeedback
                      >
                        <Input placeholder="Item Name" />
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                        hasFeedback
                      >
                        <Input placeholder="Amount" />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <Button
                        type="default"
                        onClick={() => showDeleteConfirm(() => remove(name))}
                      >
                        X
                      </Button>
                    </Col>
                  </Row>
                ))}

                <Row>
                  <Col>
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                      >
                        Add Item
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Panel>
      </Collapse>
    </>
  );
}
