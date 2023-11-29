import { FormInstance } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { EventTypes } from '../constants';
import { IInvoiceFormData, IMessageToExternalForm } from '../interfaces';
import { accountOptions, checkInitData, convertInputData, findInitOptionLabel, formatDataWithConfidence, parseToDate, vendorOptions, wellNameOptions } from '../utils';

export function useForm() {
  const formRef = React.useRef<FormInstance>(null);
  const [disabled, setDisabled] = useState(false);
  const [initialData, setInitialData] = useState<any>();

  const onFinish = (values: IInvoiceFormData) => {
    const formattedObject = formatDataWithConfidence(values);

    sendMessageToParent({
      action: EventTypes.SUBMIT,
      data: {
        invoice_data: {
          value: JSON.stringify(formattedObject),
        },
        result: {
          value: 'true'
        }
      },
    });
  };

  const handleCompleteTask = useCallback(() => {
    formRef.current?.submit();
  }, []);

  const handleSetFormStatus = useCallback((eventData: IMessageToExternalForm) => {
    setDisabled(eventData.data || false);
  }, []);

  const getOptionValue = useCallback((value: string, options: any[]) => {
    return value
    ? findInitOptionLabel(
        checkInitData(value),
        options
      )
    : "";
  }, []);

  const handleSetFormData = useCallback((eventData: IMessageToExternalForm) => {
    const receivedData = convertInputData(eventData.data);
    console.log('formData', receivedData);

    if (receivedData?.invoice_data) {
      const invoiceData = JSON.parse(receivedData?.invoice_data || '{}');
      setInitialData(invoiceData);

      const fieldsData = {
        account: getOptionValue(invoiceData.account?.value, accountOptions),
        vendor: getOptionValue(invoiceData.vendor?.value, vendorOptions),
        totalInvoice: invoiceData.totalInvoice?.value,
        invoiceDate: parseToDate(invoiceData.invoiceDate.value),
        transactionDate: parseToDate(invoiceData.transactionDate.value),
        invoiceNumber: invoiceData.invoiceNumber?.value,
        resultWellName: (invoiceData.resultWellName || []).map((it: any) => getOptionValue(it.value, wellNameOptions)),
        items: invoiceData.items.map((item: any) => ({
          itemName: item.itemName.value,
          amount: item.amount.value,
        })),
      }

      formRef.current?.setFieldsValue(fieldsData);
    }
  }, []);

  const sendMessageToParent = useCallback((message: unknown) => {
    window.parent.postMessage(message, '*');
  }, []);

  useEffect(() => {
    const handleMessage = (event: any) => {
      const eventData: IMessageToExternalForm= event.data;
      console.log('event.origin', event.origin);
      console.log('IN_FORM eventData', eventData);
      
      if (eventData.type === EventTypes.COMPLETE_TASK) {
        handleCompleteTask();
      }

      if (eventData.type === EventTypes.SET_FORM_STATUS) {
        handleSetFormStatus(eventData);
      }

      if (eventData.type === EventTypes.SET_DATA) {
        handleSetFormData(eventData);
      }
    };

    window?.addEventListener('message', handleMessage);

    return () => {
      window?.removeEventListener('message', handleMessage);
    };
  }, [window]);

  return {
    formRef,
    initialData,
    disabled,
    onFinish,
  }
}
