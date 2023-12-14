import React from 'react';
import { Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';

const { Text } = Typography;

interface DopTextProps extends TextProps {
  value: string;
}

export function DopText({ value, ...props }: DopTextProps) {
  return <Text>{value}</Text>;
}
