const millisecondsPerDay = 24 * 60 * 60 * 1000;

const japaneseDayOfWeek = ["日", "月", "火", "水", "木", "金", "土"] as const;

const parseLocalDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};

export const formatDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getJapaneseDayOfWeek = (date: string) => {
  const parsedDate = parseLocalDate(date);

  if (!parsedDate) {
    return "";
  }

  return japaneseDayOfWeek[parsedDate.getDay()];
};

export const addDaysToDateInputValue = (date: string, daysToAdd: number) => {
  const parsedDate = parseLocalDate(date);

  if (!parsedDate) {
    return "";
  }

  const nextDate = new Date(parsedDate.getTime() + daysToAdd * millisecondsPerDay);
  return formatDateInputValue(nextDate);
};

export const calculateInclusiveDateCount = (startDate: string, endDate: string) => {
  const parsedStartDate = parseLocalDate(startDate);
  const parsedEndDate = parseLocalDate(endDate);

  if (!parsedStartDate || !parsedEndDate) {
    return 0;
  }

  const diff = parsedEndDate.getTime() - parsedStartDate.getTime();

  if (diff < 0) {
    return 0;
  }

  return Math.floor(diff / millisecondsPerDay) + 1;
};
