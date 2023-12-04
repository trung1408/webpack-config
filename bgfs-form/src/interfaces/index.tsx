import { EventTypes, VariableType } from '../constants';


export interface IMessageToExternalForm {
  type: EventTypes;
  data?: any;
  extra?: ExtraFormField;
}

export interface ExtraFormField {
  isTaskCompleted?: boolean;
}

export interface ITaskVariable {
  [key: string]: ITaskVariableInfo;
}

export interface ITaskVariableInfo {
  type: VariableType;
  value: number | string | boolean;
  valueInfo: Record<string, unknown>;
}

export interface IDopOption {
  code: string;
  name: string;
}

const invoiceKeys = [
  'account',
  'vendor',
  'totalInvoice',
  'invoiceDate',
  'invoiceNumber',
  'transactionDate',
  'resultWellName',
  'items',
] as const;

type InvoiceKey = typeof invoiceKeys[number];

export interface ITaskWithConfidence {
  value: number | string | boolean;
  confidence?: number;
}

export type IInvoiceData = {
  [key in InvoiceKey]: ITaskWithConfidence;
} & {
  [key: string]: ITaskWithConfidence;
};

export interface IInvoiceFormData {
  account:         string;
  vendor:          string;
  totalInvoice:    string;
  invoiceDate:     Date;
  invoiceNumber:   string;
  transactionDate: Date;
  resultWellName:  string[];
  items:           IItem[];
}

export interface IItem {
  itemName: string;
  amount:   string;
}

export interface CompletedTaskVariable {
  type: string;
  value: boolean|number|string;
  valueInfo: any;
  id: string;
  name: string;
  processDefinitionKey: string;
  processDefinitionId: string;
  processInstanceId: string;
  executionId: string;
  activityInstanceId: string;
  caseDefinitionKey: string;
  caseDefinitionId: string;
  caseInstanceId: string;
  caseExecutionId: string;
  taskId: string;
  errorMessage: string;
  tenantId: string;
  state: string;
  createTime: Date;
  removalTime: Date;
  rootProcessInstanceId: string;
}
