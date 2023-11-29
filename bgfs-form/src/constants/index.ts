export enum EventTypes {
  COMPLETE_TASK = 'COMPLETE_TASK',
  SET_DATA = 'SET_DATA',
  SET_FORM_STATUS = 'SET_FORM_STATUS',
  SUBMIT = 'SUBMIT',
}

// export const MAIN_DOP_HOST = 'https://dop-v3-dev.vbpo-st.com';
export const MAIN_DOP_HOST = 'http://localhost:8000';

export const DATE_FORMAT='YYYY-MM-DDTHH:mm:ss.SSSZZ';

export enum VariableType {
  BOOLEAN = 'Boolean',
  BYTE = 'Byte',
  FILE = 'File',
  DATE = 'Date',
  DOUBLE = 'Double',
  INTEGER = 'Integer',
  LONG = 'Long',
  OBJECT = 'Object',
  SHORT = 'Short',
  STRING = 'String',
  JSON = 'Json',
  XML = 'Xml',
  NULL = 'Null',
  USER_DEFINED = 'UserDefined'
}