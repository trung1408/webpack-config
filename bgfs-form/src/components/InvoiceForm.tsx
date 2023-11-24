import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  DatePicker,
  Typography,
  Collapse,
  Col,
  Row,
  Modal,
  Select,
} from 'antd';
import {
  accountOptions,
  convertDateToFormat,
  findSimilar,
  vendorOptions,
  wellNameOptions,
} from '../utils';
import { PlusOutlined } from '@ant-design/icons';
import { ValidateStatus } from 'antd/lib/form/FormItem';

const { Panel } = Collapse;
const { confirm } = Modal;

type MasterDataType = {
  code: string;
  name: string;
};

interface InvoiceFormProps {
  initialData?: any;
  form?: any;
  threshold?: any;
  isSubmitted?: boolean;
  specialThreshold?: any;
}

export function InvoiceForm({
  initialData,
  form,
  threshold,
  isSubmitted = false,
  specialThreshold,
}: InvoiceFormProps) {
  const [blurredFields, setBlurredFields] = useState<any>({});
  const [submitted, setSubmitted] = useState<boolean>(isSubmitted);
  const [userInteractedFields, setUserInteractedFields] = useState<any>({});
  const [modifiedFields, setModifiedFields] = useState<any>({});

  useEffect(() => {
    setSubmitted(isSubmitted);
  }, [isSubmitted]);

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

  const handleBlur = (name: any) => {
    if (modifiedFields[name])
      setBlurredFields({
        ...blurredFields,
        [name]: true,
      });
  };

  const getStyle = (confidence: any, name: any) =>
    userInteractedFields[name] && blurredFields[name] && confidence < threshold
      ? { border: '2.5px solid gray' }
      : {};

  const handleChangeInput = (name: any, value: any) => {
    const initialValue = initialData && initialData[name]?.value || '';
    if (value !== initialValue) {
      setUserInteractedFields({
        ...userInteractedFields,
        [name]: true,
      });
    }

    if (value !== '') {
      setModifiedFields({
        ...modifiedFields,
        [name]: true,
      });
    }
  };

  const getStatusByConfidence = (confidence: any, name: any) => {
    if (submitted) {
      return '';
    }

    if (blurredFields[name] && modifiedFields[name]) {
      return 'success';
    }

    if (name === 'vendor') {
      if (confidence < specialThreshold || !confidence) return 'warning';

      return 'success';
    }

    if (confidence < threshold || !confidence) return 'warning';

    return 'success';
  };

  const validateOption = (
    name: string,
    options: MasterDataType[],
    field: string | number,
    confidence?: number
  ): { validateStatus: ValidateStatus; help?: string } => {
    console.log({ name, options, field, confidence });
    
    if (isSubmitted) return { validateStatus: '' };

    if (blurredFields[field] && modifiedFields[field]) {
      return { validateStatus: 'success' };
    }

    const matchedOptions = findSimilar(name, options);

    if (matchedOptions.length === 1 || !name) {
      return {
        validateStatus: getStatusByConfidence(
          confidence ?? initialData[field]?.confidence,
          field
        ),
      };
    } else if (matchedOptions.length > 1 && name) {
      return {
        validateStatus: 'warning',
        help: 'Multiple matches found.',
      };
    } else {
      return {
        validateStatus: 'error',
        help: `${name} not found.`,
      };
    }
  };

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Typography.Title level={4}>Review Form</Typography.Title>
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
            disabled={isSubmitted}
            placeholder="Select Account"
            options={accountOptions.map((acc) => {
              return {
                label: `${acc.code}: ${acc.name}`,
                value: `${acc.code}: ${acc.name}`,
              };
            })}
            onBlur={() => handleBlur('account')}
            onChange={(_, option) =>
              handleChangeInput('account', (option as any)?.value)
            }
          />
        </Form.Item>
        <Form.Item
          label="Vendor"
          name="vendor"
          hasFeedback
          // {...validateOption(
          //   initialData?.vendor?.value,
          //   vendorOptions,
          //   'vendor'
          // )}
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
            disabled={isSubmitted}
            placeholder="Select Vendor"
            options={vendorOptions.map((vendor) => {
              return {
                label: `${vendor.code}: ${vendor.name}`,
                value: `${vendor.code}: ${vendor.name}`,
              };
            })}
            onBlur={() => handleBlur('vendor')}
            onChange={(_, option) =>
              handleChangeInput('vendor', (option as any)?.value)
            }
            style={getStyle(initialData?.vendor?.confidence, 'vendor')}
          />
        </Form.Item>
        <Form.Item
          label="Total Invoice"
          name="totalInvoice"
          hasFeedback
          validateStatus={getStatusByConfidence(
            initialData?.totalInvoice?.confidence,
            'totalInvoice'
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
            disabled={isSubmitted}
            placeholder="Total Invoice"
            onBlur={() => handleBlur('totalInvoice')}
            onChange={(e) => handleChangeInput('totalInvoice', e.target.value)}
            style={getStyle(
              initialData?.totalInvoice?.confidence,
              'totalInvoice'
            )}
          />
        </Form.Item>
        <Form.Item
          label="Invoice Date"
          name="invoiceDate"
          hasFeedback
          validateStatus={getStatusByConfidence(
            initialData?.invoiceDate?.confidence,
            'invoiceDate'
          )}
          rules={[
            {
              required: true,
              message: 'Invoice Date is required.',
            },
          ]}
        >
          <DatePicker
            disabled={isSubmitted}
            format="YYYY-MM-DD"
            onBlur={() => handleBlur('invoiceDate')}
            onChange={(value) => handleChangeInput('invoiceDate', value)}
            style={{
              width: '100%',
              ...getStyle(initialData?.invoiceDate?.confidence, 'invoiceDate'),
            }}
          />
        </Form.Item>
        <Form.Item
          label="Invoice Number"
          name="invoiceNumber"
          hasFeedback
          validateStatus={getStatusByConfidence(
            initialData?.invoiceNumber?.confidence,
            'invoiceNumber'
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
            disabled={isSubmitted}
            placeholder="Invoice Number"
            onBlur={() => handleBlur('invoiceNumber')}
            onChange={(e) => handleChangeInput('invoiceNumber', e.target.value)}
            style={getStyle(
              initialData?.invoiceNumber?.confidence,
              'invoiceNumber'
            )}
          />
        </Form.Item>
        <Form.Item
          label="Transaction Date"
          name="transactionDate"
          hasFeedback
          validateStatus={getStatusByConfidence(
            initialData?.transactionDate?.confidence,
            'transactionDate'
          )}
          rules={[
            {
              required: true,
              message: 'Transaction Date is required.',
            },
          ]}
        >
          <DatePicker
            disabled={isSubmitted}
            format="YYYY-MM-DD"
            onBlur={() => handleBlur('transactionDate')}
            onChange={(value) => handleChangeInput('transactionDate', value)}
            style={{
              width: '100%',
              ...getStyle(
                initialData?.transactionDate?.confidence,
                'transactionDate'
              ),
            }}
          />
        </Form.Item>

        <Collapse bordered={false} ghost defaultActiveKey={['0', '1']}>
          <Panel header="Well Names" key="0">
            <Form.List name="resultWellName">
              {(fields, { add, remove }) => (
                <>
                  {(fields || []).map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={[8, 8]}>
                      <Col span={22}>
                        <Row gutter={[8, 8]}>
                          <Col span={23}>
                            <Form.Item
                              {...restField}
                              hasFeedback
                              {...validateOption(
                                initialData?.resultWellName[name]?.value,
                                wellNameOptions,
                                name,
                                initialData?.resultWellName[name]?.confidence
                              )}
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
                                disabled={isSubmitted}
                                placeholder="Select Well Name"
                                options={wellNameOptions.map((well) => {
                                  return {
                                    label: `${well.code}: ${well.name}`,
                                    value: `${well.code}: ${well.name}`,
                                  };
                                })}
                                onBlur={() => handleBlur(name)}
                                onChange={(_, option) =>
                                  handleChangeInput(
                                    name,
                                    (option as any)?.value
                                  )
                                }
                                style={getStyle(
                                  initialData?.resultWellName[name]?.confidence,
                                  name
                                )}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={1}>
                            <Button
                              type="default"
                              disabled={isSubmitted}
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
                        disabled={isSubmitted}
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
                    <Row key={key} gutter={[8, 8]} justify="center">
                      <Col span={16}>
                        <Form.Item
                          {...restField}
                          name={[name, 'itemName']}
                          hasFeedback
                          validateStatus={getStatusByConfidence(
                            initialData?.items[name]?.itemName?.confidence,
                            [name, 'itemName']
                          )}
                          rules={[
                            {
                              validator(_, value) {
                                const amountValue = form.getFieldValue([
                                  'items',
                                  name,
                                  'amount',
                                ]);
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
                            disabled={isSubmitted}
                            placeholder="Item Name"
                            onBlur={() => handleBlur([name, 'itemName'])}
                            onChange={(e) =>
                              handleChangeInput(
                                [name, 'itemName'],
                                e.target.value
                              )
                            }
                            style={getStyle(
                              initialData?.items[name]?.itemName?.confidence,
                              [name, 'itemName']
                            )}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'amount']}
                          hasFeedback
                          validateStatus={getStatusByConfidence(
                            initialData?.items[name]?.amount?.confidence,
                            [name, 'amount']
                          )}
                          rules={[
                            {
                              validator(_, value) {
                                const itemName = form.getFieldValue([
                                  'items',
                                  name,
                                  'itemName',
                                ]);
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
                            disabled={isSubmitted}
                            placeholder="Amount"
                            onBlur={() => handleBlur([name, 'amount'])}
                            onChange={(e) =>
                              handleChangeInput(
                                [name, 'amount'],
                                e.target.value
                              )
                            }
                            style={getStyle(
                              initialData?.items[name]?.amount?.confidence,
                              [name, 'amount']
                            )}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button
                          type="default"
                          disabled={isSubmitted}
                          onClick={() => showDeleteConfirm(() => remove(name))}
                        >
                          X
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Row>
                    <Col>
                      <Button
                        type="dashed"
                        // disabled={isSubmitted}
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                      >
                        Add Item
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
          </Panel>
        </Collapse>
      </Col>
    </Row>
  );
}
