import { EventTypes, VariableType } from '../constants';


export interface IMessageToExternalForm {
  type: EventTypes;
  data?: any;
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
