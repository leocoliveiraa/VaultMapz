export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("pt-BR");
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString("pt-BR");
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const isValidDate = (date: string | Date): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
};

export const getDaysDifference = (
  startDate: string | Date,
  endDate: string | Date
): number => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const getFirstDayOfMonth = (): string => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  return firstDay.toISOString().split("T")[0];
};

export const getLastDayOfMonth = (): string => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.toISOString().split("T")[0];
};

export const getFirstDayOfYear = (): string => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), 0, 1);
  return firstDay.toISOString().split("T")[0];
};

export const getLastDayOfYear = (): string => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), 11, 31);
  return lastDay.toISOString().split("T")[0];
};

export const addDays = (date: string | Date, days: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const result = new Date(dateObj);
  result.setDate(result.getDate() + days);
  return result;
};

export const subtractDays = (date: string | Date, days: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const result = new Date(dateObj);
  result.setDate(result.getDate() - days);
  return result;
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return months[monthIndex];
};
export const getCurrentMonthName = (): string => {
  const now = new Date();
  return getMonthName(now.getMonth());
};

export const getDayName = (dayIndex: number): string => {
  const days = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  return days[dayIndex];
};

export const isDateInPast = (date: string | Date): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj < now;
};

export const isDateInFuture = (date: string | Date): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj > now;
};
export const isToday = (date: string | Date): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  return (
    dateObj.getDate() === now.getDate() &&
    dateObj.getMonth() === now.getMonth() &&
    dateObj.getFullYear() === now.getFullYear()
  );
};

export const formatDateFriendly = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  if (isToday(dateObj)) {
    return "Hoje";
  }

  const yesterday = subtractDays(now, 1);
  if (
    isToday(yesterday) &&
    dateObj.toDateString() === yesterday.toDateString()
  ) {
    return "Ontem";
  }

  const daysDiff = getDaysDifference(dateObj, now);
  if (daysDiff <= 7) {
    return `${daysDiff} ${daysDiff === 1 ? "dia" : "dias"} atrás`;
  }

  return formatDate(dateObj);
};
export const filterTransactionsByDateRange = <T extends { date: string }>(
  transactions: T[],
  startDate: string,
  endDate: string
): T[] => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return transactionDate >= start && transactionDate <= end;
  });
};

export const groupTransactionsByMonth = <T extends { date: string }>(
  transactions: T[]
): Record<string, T[]> => {
  return transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }

    acc[monthKey].push(transaction);
    return acc;
  }, {} as Record<string, T[]>);
};
export const firebaseTimestampToDate = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};
