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
