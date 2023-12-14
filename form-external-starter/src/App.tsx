import { Form } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LocaleData from 'dayjs/plugin/localeData';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import WeekDay from 'dayjs/plugin/weekday';
import React from 'react';
import { InformationForm } from './components';
import { useForm } from './hooks/useForm';

dayjs.extend(WeekDay);
dayjs.extend(LocaleData);
dayjs.extend(LocalizedFormat);
dayjs.extend(customParseFormat);

export default function App() {
  const { formRef, onFinish, disabled, initialData } = useForm();

  return (
    <Form
      layout="vertical"
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      disabled={disabled}
      scrollToFirstError
      autoComplete="off"
      style={{ padding: 16 }}
    >
      <InformationForm initialData={initialData} formRef={formRef} />
    </Form>
  );
}
