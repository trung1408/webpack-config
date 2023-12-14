import { FormInstance } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { EventTypes, MAIN_DOP_HOST } from '../constants';
import { IMessageToExternalForm } from '../interfaces';

export function useForm() {
  const formRef = React.useRef<FormInstance>(null);
  const [disabled, setDisabled] = useState(false);

  const onFinish = (values: any) => {
    console.log('onFinish Form: ', values);
    
    // const { firstName, lastName, address } = values;
    // sendMessageToParent({
    //   action: EventTypes.SUBMIT,
    //   data: {
    //     firstName: {
    //       value: firstName,
    //       type: 'String',
    //     },
    //     lastName: {
    //       value: lastName,
    //       type: 'String',
    //     },
    //     address: {
    //       value: address,
    //       type: 'String',
    //     },
    //   },
    // });
  };

  const handleCompleteTask = useCallback(() => {
    formRef.current?.submit();
  }, []);

  const handleSetFormStatus = useCallback((eventData: IMessageToExternalForm) => {
    console.log('FORM: handleSetFormStatus: ', eventData);
    
    setDisabled(true);
  }, []);

  const handleSetFormData = useCallback((eventData: IMessageToExternalForm) => {
    console.log('FORM: handleSetFormData: ', eventData);
    formRef.current?.setFieldsValue(eventData.data);
  }, []);

  const handleInitForm = useCallback((eventData: IMessageToExternalForm) => {
    console.log('FORM: Initial form component', eventData);
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

      if (event.origin === MAIN_DOP_HOST && eventData.type === EventTypes.INIT_FORM) {
        handleInitForm(eventData);
      }
      
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
    disabled,
    onFinish,
  }
}
