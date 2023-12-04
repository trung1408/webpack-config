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
import { ValidateStatus } from 'antd/es/form/FormItem';

const { Panel } = Collapse;
const { confirm } = Modal;

interface InvoiceFormProps {
  initialData: any;
  formRef: any;
  onGetConfidence: (field: string, confidence: number) => ValidateStatus;
  validateOption: (
    name: string,
    options: IDopOption[],
    field: string | number,
    confidence?: number
  ) => any;
  onChangeInput: (name: string | number, value: any) => void;
  onHandleBlur: (name: string | number) => void;
}

export function InvoiceForm({
  initialData,
  formRef,
  onGetConfidence,
  validateOption,
  onChangeInput,
  onHandleBlur,
}: InvoiceFormProps) {
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
        validateStatus={onGetConfidence(
          'account',
          initialData?.account?.confidence
        )}
      >
        <Select
          showSearch
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())
          }
          placeholder="Select Account"
          options={renderOptions(accountOptions)}
          onBlur={() => onHandleBlur('account')}
          onChange={(_, option) =>
            onChangeInput('account', (option as any)?.value)
          }
        />
      </Form.Item>

      <Form.Item
        label="Vendor"
        name="vendor"
        hasFeedback
        {...validateOption(initialData?.vendor?.value, vendorOptions, 'vendor')}
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
          onBlur={() => onHandleBlur('vendor')}
          onChange={(_, option) =>
            onChangeInput('vendor', (option as any)?.value)
          }
        />
      </Form.Item>

      <Form.Item
        label="Total Invoice"
        name="totalInvoice"
        hasFeedback
        validateStatus={onGetConfidence(
          'totalInvoice',
          initialData?.totalInvoice?.confidence
        )}
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
        <Input
          placeholder="Total Invoice"
          onBlur={() => onHandleBlur('totalInvoice')}
          onChange={(e) => onChangeInput('totalInvoice', e.target.value)}
        />
      </Form.Item>

      <Form.Item
        label="Invoice Date"
        name="invoiceDate"
        hasFeedback
        validateStatus={onGetConfidence(
          'invoiceDate',
          initialData?.invoiceDate?.confidence
        )}
        rules={[
          {
            required: true,
            message: 'Invoice Date is required.',
          },
        ]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          style={{ width: '100%' }}
          onBlur={() => onHandleBlur('invoiceDate')}
          onChange={(value) => onChangeInput('invoiceDate', value)}
        />
      </Form.Item>

      <Form.Item
        label="Invoice Number"
        name="invoiceNumber"
        hasFeedback
        validateStatus={onGetConfidence(
          'invoiceNumber',
          initialData?.invoiceNumber?.confidence
        )}
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
        <Input
          placeholder="Invoice Number"
          onBlur={() => onHandleBlur('invoiceNumber')}
          onChange={(e) => onChangeInput('invoiceNumber', e.target.value)}
        />
      </Form.Item>

      <Form.Item
        label="Transaction Date"
        name="transactionDate"
        validateStatus={onGetConfidence(
          'transactionDate',
          initialData?.transactionDate?.confidence
        )}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Transaction Date is required.',
          },
        ]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          style={{ width: '100%' }}
          onBlur={() => onHandleBlur('transactionDate')}
          onChange={(value) => onChangeInput('transactionDate', value)}
        />
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
                            {...validateOption(
                              initialData?.resultWellName[name]?.value,
                              wellNameOptions,
                              name,
                              initialData?.resultWellName[name]?.confidence
                            )}
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
                              onBlur={() => onHandleBlur(name)}
                              onChange={(_, option) =>
                                onChangeInput(name, (option as any)?.value)
                              }
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
                        validateStatus={onGetConfidence(
                          [name, 'itemName'],
                          initialData?.items[name]?.itemName?.confidence
                        )}
                        rules={[
                          {
                            validator(_, value) {
                              const amountValue =
                                formRef?.current?.getFieldValue([
                                  'items',
                                  name,
                                  'amount',
                                ]);
                                console.log('amountValueamountValueamountValue', amountValue);
                                
                              if (!value && amountValue) {
                                return Promise.reject(
                                  new Error('Missing item name')
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input
                          placeholder="Item Name"
                          onBlur={() => onHandleBlur([name, 'itemName'])}
                          onChange={(e) =>
                            onChangeInput([name, 'itemName'], e.target.value)
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                        hasFeedback
                        validateStatus={onGetConfidence(
                          [name, 'amount'],
                          initialData?.items[name]?.amount?.confidence
                        )}
                        rules={[
                          {
                            validator(_, value) {
                              const itemName = formRef?.current?.getFieldValue([
                                'items',
                                name,
                                'itemName',
                              ]);

                              console.log('itemName', itemName);

                              if (!value && itemName) {
                                return Promise.reject(
                                  new Error('Missing amount')
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                          {
                            pattern: /^[0-9]*\.?[0-9]+$/,
                            message: 'Please enter a valid number.',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Amount"
                          onBlur={() => onHandleBlur([name, 'amount'])}
                          onChange={(e) =>
                            onChangeInput([name, 'amount'], e.target.value)
                          }
                        />
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
