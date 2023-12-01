import { ValidateStatus } from 'antd/es/form/FormItem';
import { IDopOption } from './../interfaces/index';
import { FormInstance } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { EventTypes } from '../constants';
import { IInvoiceFormData, IMessageToExternalForm } from '../interfaces';
import { accountOptions, checkInitData, convertInputData, findInitOptionLabel, findSimilar, formatDataWithConfidence, parseToDate, vendorOptions, wellNameOptions } from '../utils';

export function useForm() {
  const formRef = React.useRef<FormInstance>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(100);
  const [specialThreshold, setSpecialThreshold] = useState<number>(100);
  const [initialData, setInitialData] = useState<any>();

  const [blurredFields, setBlurredFields] = useState<any>({});
  const [userInteractedFields, setUserInteractedFields] = useState<any>({});
  const [modifiedFields, setModifiedFields] = useState<any>({});

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
    setDisabled(eventData.data?.disabled || false);
  }, []);

  const getOptionValue = useCallback((value: string, options: any[]) => {
    return value
    ? findInitOptionLabel(
        checkInitData(value),
        options
      )
    : "";
  }, []);

  const onGetConfidence = useCallback((field: string|number, confidence: number) => {
    if (disabled) {
      return "";
    }

    if (blurredFields[field] && modifiedFields[field]) {
      return "success";
    }

    if (field === "vendor") {
      if (confidence < specialThreshold || !confidence) return "warning";

      return "success";
    }

    if (confidence < threshold || !confidence) return "warning";

    return "success";
  }, [blurredFields, modifiedFields, threshold, specialThreshold]);

  const handleBlur = (name: string|number) => {
    if (modifiedFields[name])
      setBlurredFields({
        ...blurredFields,
        [name]: true,
      });
  };

  const handleChangeInput = (name: string|number, value: any) => {
    const initialValue = initialData ? initialData[name]?.value : "";
    if (value !== initialValue) {
      setUserInteractedFields({
        ...userInteractedFields,
        [name]: true,
      });
    }

    if (value !== "") {
      setModifiedFields({
        ...modifiedFields,
        [name]: true,
      });
    }
  };

  const validateOption = (
    name: string,
    options: IDopOption[],
    field: string | number,
    confidence?: number
  ): { validateStatus: ValidateStatus; help?: string } => {
    if (disabled) return { validateStatus: "" };

    if (blurredFields[field] && modifiedFields[field]) {
      return { validateStatus: "success" };
    }

    const matchedOptions = findSimilar(name, options);

    if (matchedOptions.length === 1 || !name) {
      return {
        validateStatus: onGetConfidence(
          field,
          confidence ?? (initialData ? initialData[field]?.confidence : 0),
        ),
      };
    } else if (matchedOptions.length > 1 && name) {
      return {
        validateStatus: "warning",
        help: "Multiple matches found.",
      };
    } else {
      return {
        validateStatus: "error",
        help: `${name} not found.`,
      };
    }
  };


  const handleSetFormData = useCallback((eventData: IMessageToExternalForm) => {
    const receivedData = convertInputData(eventData.data);
    console.log('formData', receivedData);
    setThreshold(Number(receivedData?.threshold || 100));
    setSpecialThreshold(Number(receivedData?.threshold_special_fields || 100));

    if (receivedData?.invoice_data) {
      const invoiceData = JSON.parse(receivedData?.invoice_data || '{}');
      setInitialData(invoiceData);

      const fieldsData = {
        account: getOptionValue(invoiceData.account?.value, accountOptions),
        vendor: getOptionValue(invoiceData.vendor?.value, vendorOptions),
        totalInvoice: (invoiceData.totalInvoice?.value || '').replace(/[^\d.]/g, ""),
        invoiceDate: parseToDate(invoiceData.invoiceDate.value),
        transactionDate: parseToDate(invoiceData.transactionDate.value),
        invoiceNumber: invoiceData.invoiceNumber?.value,
        resultWellName: (invoiceData.resultWellName || []).map((it: any) => getOptionValue(it.value, wellNameOptions)),
        items: (invoiceData.items || []).map((item: any) => ({
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
    onGetConfidence,
    validateOption,
    handleChangeInput,
    handleBlur,
  }
}
