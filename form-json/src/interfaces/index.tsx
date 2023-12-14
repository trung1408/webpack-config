import { Rule } from 'antd/es/form';
import { ComponentType, EventTypes, SubFieldType } from '../constants';
import { ValidateStatus } from 'antd/es/form/FormItem';

export interface IMessageToExternalForm {
  type: EventTypes;
  data?: any;
}

export interface IFormBuilder {
  components: IFormComponent[];
}

export interface IFormComponent {
  id: string;
  key?: string; // field key
  type: ComponentType;
  subtype?: SubFieldType;
  label?: string;
  dateLabel?: string;
  text?: string;
  description?: string;
  placeholder?: string;
  source?: string;
  alt?: string;
  disabled?: boolean;
  searchable?: boolean;
  initialValue?: any;
  values?: IOptionValue[];
  rules?: Rule[];
  hasFeedback?: boolean;
  validateStatus?: ValidateStatus;
  hidden?: boolean;
  layout: IFormLayout;
  items?: IFormComponent[];
}

export interface IFormLayout {
  row: string;
  columns?: number | null;
}

export interface IFormValidate {
  required: boolean;
}

export interface IOptionValue {
  label: string;
  value: string;
}
