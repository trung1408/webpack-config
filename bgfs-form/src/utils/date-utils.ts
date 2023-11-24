import dayjs from 'dayjs';

export const convertDateToFormat = (
  date: any,
  format = 'DD/MM/YY HH:mm:ss'
) => (date ? dayjs(date).format(format) : '--');
