export enum EventTypes {
  INIT_FORM = 'INIT_FORM',
  COMPLETE_TASK = 'COMPLETE_TASK',
  SET_DATA = 'SET_DATA',
  SET_FORM_STATUS = 'SET_FORM_STATUS',
  SUBMIT = 'SUBMIT',
}

// export const MAIN_DOP_HOST = 'https://dop-v3-dev.vbpo-st.com';
export const MAIN_DOP_HOST = 'http://localhost:8000';

export enum ComponentType {
  IMAGE = 'image',  // just show image
  TEXT = 'text',   // just show text
  TEXT_FIELD = 'textField', // field input text
  TEXTAREA_FIELD = 'textareaField', // field input textarea
  SELECT = 'select',  // field select
  DATE_TIME = 'dateTime', // field date time
  RADIO = 'radio', // field radio
  CHECKBOX = 'checkbox', // field checkbox
  NUMBER_FIELD = 'numberField', // field input number
  SWITCH = 'switch', // field switch
  LIST = 'list', // field list
}

export enum SubFieldType {
  DATE = 'date',
  TIME = 'time',
}