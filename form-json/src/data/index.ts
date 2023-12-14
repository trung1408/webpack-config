import { ComponentType, SubFieldType } from "../constants";
import { IFormBuilder } from "../interfaces";

export const formComponentTemplate: IFormBuilder = {
  components: [
    {
      id: "Field_1",
      type: ComponentType.TEXT,
      text: "Fill invoice information",
      layout: {
        row: "Row_1"
      }
    },
    {
      id: "Field_2",
      key: "fullName",
      type: ComponentType.TEXT_FIELD,
      label: "Full name",
      description: "Enter your full name (first and last name)",
      disabled: false,
      rules: [
        { required: true, message: 'The Full name is required'}
      ],
      layout: {
        row: "Row_2"
      }
    },
    {
      id: "Field_3",
      key: "gender",
      type: ComponentType.SELECT,
      label: "Gender",
      description: "Select your gender",
      searchable: false,
      initialValue: "other",
      values: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
        {
          label: 'Other',
          value: 'other',
        }
      ],
      rules: [
        { required: true, message: 'The Gender is required' }
      ],
      layout: {
        columns: 8,
        row: "Row_3"
      }
    },
    {
      id: "Field_4",
      key: "birthday",
      type:ComponentType.DATE_TIME,
      subtype: SubFieldType.DATE,
      description: "Select the date your birthday",
      dateLabel: "Your Birthday",
      rules: [
        { required: true, message: 'The Birthday is required' }
      ],
      layout: {
        columns: 8,
        row: "Row_3"
      }
    },
    {
      id: "Field_5",
      key: "bio",
      type: ComponentType.TEXTAREA_FIELD,
      label: "Bio",
      description: "Add some information to your bio (not required)",
      layout: {
        row: "Row_4"
      }
    },
    {
      id: "Field_6",
      key: "checkbox",
      type: ComponentType.CHECKBOX,
      label: "Checkbox",
      description: "Select your answer",
      values: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
        {
          label: 'Other',
          value: 'other',
        }
      ],
      rules: [
        { required: true, message: 'The Checkbox is required' }
      ],
      layout: {
        row: "Row_5"
      }
    },
    {
      id: "Field_7",
      type: ComponentType.LIST,
      key: "wellNames",
      label: "Well Names",
      description: "Well Names",
      items: [
        {
          id: "Item_1",
          itemName: "Item 1",
          quantity: 5,
          layout: {
            row: "Row_6"
          }
        },
        {
          id: "Item_2",
          itemName: "Item 2",
          quantity: 3,
          layout: {
            row: "Row_7"
          }
        }
      ],
      rules: [
        { required: true, message: "Well Names is required" }
      ],
      layout: {
        row: "Row_8"
      }
    }
  ]
}