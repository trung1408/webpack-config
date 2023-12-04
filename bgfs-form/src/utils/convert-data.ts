import dayjs from "dayjs";
import { DATE_FORMAT, VariableType } from "../constants";
import { CompletedTaskVariable, IInvoiceFormData, ITaskVariable } from "../interfaces";
import { convertDateToFormat } from "./date-utils";
import { findSimilar } from "./levenshtein";

export const convertInputData = (variables: ITaskVariable) => {
  const result: Record<string, any> = {};

  for (const [key, item] of Object.entries(variables)) {
    if ('value' in item && 'type' in item) {
      result[key] = formatDataByType(item.type, item.value);
    }
  }

  return result;
}

interface OutputObject {
  [key: string]: string | number | boolean;
}

export const convertCompletedInputData = (data: CompletedTaskVariable[]): OutputObject => {
  const result: OutputObject = {};

  for (const item of data) {
    result[item.name] = item.value;
  }

  return result;
}


const formatDataByType = (type: VariableType, value: any) => {
  switch (type) {
    case VariableType.DATE:
      return dayjs(value, DATE_FORMAT);

    case VariableType.JSON:
      return JSON.parse(value);

    default:
      return value;
  }
}

const sanitizeData = (data: string[]) => {
  return data.map((str) => str.trim()).filter((str) => str !== "");
};

export const formatDataWithConfidence = (values: IInvoiceFormData) => {
  const invoiceDataWithConfidence = Object.keys(values).reduce(
    (acc, key) => {
      if (key !== "items") {
        if (key === "resultWellName") {
          acc[key] = sanitizeData(values[key] || []).map((item) => ({
            value: item,
            confidence: 100,
          }));
        } else if(['invoiceDate', 'transactionDate'].includes(key) && values[key]) {
          acc[key] = {
            value: convertDateToFormat(values[key]),
            confidence: 100,
          };
        } else {
          acc[key] = {
            value: values[key],
            confidence: 100,
          };
        }
      } else {
        acc[key] = (values[key] || []).map((item) => ({
          itemName: {
            value: item.itemName,
            confidence: 100,
          },
          amount: {
            value: Number(item.amount),
            confidence: 100,
          },
        }));
      }
      return acc;
    },
    {}
  );

  return invoiceDataWithConfidence;
}

export const findInitOptionLabel = (name: string, options: any[]) => {
  const matchedOptions = findSimilar(name, options);

  if (matchedOptions.length === 1) {
    return `${matchedOptions[0].code}: ${matchedOptions[0].name}`;
  }

  return "";
};

export const checkInitData = (name: string) => {
  const splitData = name.split(":");

  return splitData.length > 1 ? splitData[1].trim() : splitData[0];
};