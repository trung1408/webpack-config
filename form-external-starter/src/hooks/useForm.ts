import { FormInstance } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { EventTypes } from '../constants';
import { IMessageToExternalForm } from '../interfaces';

export function useForm() {
  const formRef = React.useRef<FormInstance>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<any>();


  const onFinish = (values: any) => {
    // Submit data to main
    sendMessageToParent({
      action: EventTypes.SUBMIT,
      data: values,
    });
  };

  const onGetFileByPath = useCallback((path: string) => {
    sendMessageToParent({
      action: EventTypes.GET_FILE_BY_PATH,
      data: path,
    });
  }, []);

  const handleCompleteTask = useCallback(() => {
    formRef.current?.submit();
  }, []);

  const handleSetFormStatus = useCallback((eventData: IMessageToExternalForm) => {
    setDisabled(eventData.data?.disabled || false);
  }, []);


  const handleSetFormData = useCallback((eventData: IMessageToExternalForm) => {
    // eventData: The data received from main and we will use it to handled in the form
    // With invoice we will have the invoice file so we need to load file and show
    const filePath = 'path_to_file';
    onGetFileByPath(filePath);

    // Set initialize form data
    const initialData = {};
    setInitialData(initialData);

    // set current fields data (maybe need format data here before set)
    const fieldsData = {};
    formRef.current?.setFieldsValue(fieldsData);
  }, []);

  const sendMessageToParent = useCallback((message: unknown) => {
    window.parent.postMessage(message, '*');
  }, []);

  useEffect(() => {
    const handleMessage = (event: any) => {
      const eventData: IMessageToExternalForm= event.data;

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
    disabled,
    onFinish,
    initialData,
  }
}
