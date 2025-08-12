export const formatCurrency = (amount: number, showSymbol = true): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: showSymbol ? "currency" : "decimal",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("pt-BR");
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};
