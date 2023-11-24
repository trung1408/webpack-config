import { EventTypes } from "../constants";

export interface IMessageToExternalForm {
  type: EventTypes;
  data?: any;
}
