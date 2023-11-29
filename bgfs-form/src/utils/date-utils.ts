import dayjs from 'dayjs';

export const convertDateToFormat = (
  date: any,
  format = 'YYYY-MM-DDTHH:mm:ss.SSSZZ'
) => (date ? dayjs(date).format(format) : '--');

export const parseToDate = (
  date: string,
  format = 'YYYY-MM-DD 00:00:00'
) => (date ? dayjs(date, format) : null);

