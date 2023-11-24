import { FormInstance } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { EventTypes, MAIN_DOP_HOST } from '../constants';
import { IMessageToExternalForm } from '../interfaces';
import { accountOptions, convertDateToFormat, findSimilar, vendorOptions, wellNameOptions } from '../utils';

type ValuesObject = {
  [key: string]: any;
};

type FormattedObject = {
  [key in keyof ValuesObject]: {
    value: ValuesObject[key];
  };
};

export function useForm() {
  const formRef = React.useRef<FormInstance>(null);
  const [disabled, setDisabled] = useState(false);
  const [initialData, setInitialData] = useState<any>();

  const onFinish = (values: ValuesObject) => {
    console.log('onFinish', values);
    
    const formattedObject: FormattedObject = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, { value }])
    );

    sendMessageToParent({
      action: EventTypes.SUBMIT,
      data: formattedObject,
    });
  };

  const handleCompleteTask = useCallback(() => {
    formRef.current?.submit();
  }, []);

  const handleSetFormStatus = useCallback((eventData: IMessageToExternalForm) => {
    console.log('FORM: handleSetFormStatus: ', eventData);
    
    setDisabled(true);
  }, []);

  const findInitOptionLabel = (name: string, options: any) => {
    const matchedOptions = findSimilar(name, options);

    if (matchedOptions.length === 1) {
      return `${matchedOptions[0].code}: ${matchedOptions[0].name}`;
    }

    return "";
  };

  const checkInitData = (name: string) => {
    const splitData = name.split(":");

    return splitData.length > 1 ? splitData[1].trim() : splitData[0];
  };

  const handleSetFormData = useCallback((eventData: IMessageToExternalForm) => {
    console.log('FORM: handleSetFormData: ', eventData);
    const receivedData = eventData.data;

    const formData = {
      account: receivedData?.account?.value
        ? findInitOptionLabel(
            checkInitData(receivedData?.account?.value),
            accountOptions
          )
        : "",
      vendor: findInitOptionLabel(
        checkInitData(receivedData?.vendor?.value),
        vendorOptions
      ),
      totalInvoice: isNaN(receivedData?.totalInvoice?.value)
        ? receivedData?.totalInvoice?.value.replace(/[^\d.]/g, "")
        : receivedData?.totalInvoice?.value,
      invoiceDate: receivedData?.invoiceDate?.value
        ? convertDateToFormat(receivedData?.invoiceDate?.value, "YYYY-MM-DD 00:00:00")
        : null,
      invoiceNumber: receivedData?.invoiceNumber?.value,
      transactionDate: receivedData?.transactionDate?.value
        ? convertDateToFormat(receivedData?.transactionDate?.value, "YYYY-MM-DD 00:00:00")
        : null,
      resultWellName: (receivedData?.resultWellName || []).map((item: any) =>
        findInitOptionLabel(checkInitData(item.value), wellNameOptions)
      ),
      items: (receivedData?.items || []).map((item: any) => ({
        itemName: item.itemName.value,
        amount: item.amount.value,
      })),
    }

    console.log('formData', formData);
    setInitialData(formData);
    // formRef.current?.setFieldsValue(eventData.data);
  }, []);

  const sendMessageToParent = useCallback((message: unknown) => {
    console.log('[CHILD] sendMessageToParent', message);
    window.parent.postMessage(message, MAIN_DOP_HOST);
  }, []);

  useEffect(() => {
    console.log('INIT CHILD');
    
    const handleMessage = (event: any) => {
      const eventData: IMessageToExternalForm= event.data;
      console.log('event.origin', event.origin);
      
      if (event.origin === MAIN_DOP_HOST && eventData.type === EventTypes.COMPLETE_TASK) {
        handleCompleteTask();
      }

      if (event.origin === MAIN_DOP_HOST && eventData.type === EventTypes.SET_FORM_STATUS) {
        handleSetFormStatus(eventData);
      }

      if (event.origin === MAIN_DOP_HOST && eventData.type === EventTypes.SET_DATA) {
        handleSetFormData(eventData);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return {
    formRef,
    initialData,
    disabled,
    onFinish,
  }
}
