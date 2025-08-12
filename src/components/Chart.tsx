import React from "react";
import styled from "styled-components";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Transaction } from "../interfaces/Transaction";
import { formatCurrency } from "../utils/formatCurrency";
import { useTheme, colors } from "../contexts/ThemeContext";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

interface ChartProps {
  transactions: Transaction[];
}

const Container = styled.div<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].surface};
  border-radius: 20px;
  box-shadow: 0 4px 20px ${(props) => colors[props.$theme].shadow};
  border: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 32px ${(props) => colors[props.$theme].shadowHover};
  }

  @media (max-width: 768px) {
    border-radius: 16px;
    margin: 0 -8px;
  }

  @media (max-width: 480px) {
    border-radius: 12px;
    margin: 0 -4px;
  }
`;

const Header = styled.div<{ $theme: "light" | "dark" }>`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  background: ${(props) => colors[props.$theme].surfaceSecondary};

  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
  }
`;

const Title = styled.h2<{ $theme: "light" | "dark" }>`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => colors[props.$theme].text};
  letter-spacing: -0.025em;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

const Content = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
    gap: 0.75rem;
  }
`;

const SummaryCard = styled.div<{
  type: "income" | "expense" | "balance";
  $theme: "light" | "dark";
}>`
  padding: 1.5rem;
  border-radius: 16px;
  background: ${(props) => {
    const baseColors = {
      income:
        props.$theme === "light"
          ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)"
          : "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)",
      expense:
        props.$theme === "light"
          ? "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)"
          : "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%)",
      balance:
        props.$theme === "light"
          ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)"
          : "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.08) 100%)",
    };
    return baseColors[props.type];
  }};
  border: 1px solid
    ${(props) => {
      const borderColors = {
        income:
          props.$theme === "light"
            ? "rgba(16, 185, 129, 0.1)"
            : "rgba(16, 185, 129, 0.2)",
        expense:
          props.$theme === "light"
            ? "rgba(239, 68, 68, 0.1)"
            : "rgba(239, 68, 68, 0.2)",
        balance:
          props.$theme === "light"
            ? "rgba(99, 102, 241, 0.1)"
            : "rgba(99, 102, 241, 0.2)",
      };
      return borderColors[props.type];
    }};
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${(props) => colors[props.$theme].shadow};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 12px;
    gap: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 10px;
    gap: 0.75rem;
  }
`;

const SummaryIcon = styled.div<{
  type: "income" | "expense" | "balance";
  $theme: "light" | "dark";
}>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => {
    const gradients = {
      income: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      expense: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      balance: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    };
    return gradients[props.type];
  }};
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }
`;

const SummaryInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SummaryLabel = styled.div<{ $theme: "light" | "dark" }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => colors[props.$theme].textSecondary};
  margin-bottom: 0.5rem;
  letter-spacing: 0.025em;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 0.375rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }
`;

const SummaryValue = styled.div<{
  type: "income" | "expense" | "balance";
  value: number;
  $theme: "light" | "dark";
}>`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${(props) => {
    switch (props.type) {
      case "income":
        return colors[props.$theme].success;
      case "expense":
        return colors[props.$theme].danger;
      case "balance":
        return props.value >= 0
          ? colors[props.$theme].success
          : colors[props.$theme].danger;
      default:
        return colors[props.$theme].text;
    }
  }};
  letter-spacing: -0.025em;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
    font-weight: 700;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const ChartContainer = styled.div<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].surfaceSecondary};
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 6px 20px ${(props) => colors[props.$theme].shadow};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 10px;
  }
`;

const ChartTitle = styled.h3<{ $theme: "light" | "dark" }>`
  margin: 0 0 1.5rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => colors[props.$theme].text};
  text-align: center;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }
`;

const EmptyChart = styled.div<{ $theme: "light" | "dark" }>`
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(props) => colors[props.$theme].textMuted};
  font-size: 0.95rem;
  text-align: center;
  line-height: 1.5;
  padding: 2rem;

  @media (max-width: 768px) {
    height: 280px;
    font-size: 0.9rem;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    height: 240px;
    font-size: 0.85rem;
    padding: 1rem;
  }
`;

const EmptyIcon = styled.div<{ $theme: "light" | "dark" }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${(props) => colors[props.$theme].borderSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: ${(props) => colors[props.$theme].textMuted};

  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    margin-bottom: 0.75rem;
  }
`;

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#84cc16",
  "#f97316",
  "#14b8a6",
  "#a855f7",
  "#f43f5e",
];

const Chart: React.FC<ChartProps> = ({ transactions }) => {
  const { theme } = useTheme();

  const isMobile = useIsMobile();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const expenseChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  const summaryData = [
    { name: "Receitas", value: totalIncome, fill: colors[theme].success },
    { name: "Despesas", value: totalExpenses, fill: colors[theme].danger },
  ];

  const customTooltipStyle = {
    backgroundColor: colors[theme].surface,
    border: `1px solid ${colors[theme].borderSecondary}`,
    borderRadius: "8px",
    color: colors[theme].text,
    fontSize: "0.875rem",
    fontWeight: "500",
    padding: "0.75rem",
    boxShadow: `0 4px 12px ${colors[theme].shadow}`,
  };

  return (
    <Container $theme={theme}>
      <Header $theme={theme}>
        <Title $theme={theme}>Resumo Financeiro</Title>
      </Header>

      <Content>
        <SummaryGrid>
          <SummaryCard type="income" $theme={theme}>
            <SummaryIcon type="income" $theme={theme}>
              <TrendingUp size={window.innerWidth <= 480 ? 20 : 24} />
            </SummaryIcon>
            <SummaryInfo>
              <SummaryLabel $theme={theme}>Receitas</SummaryLabel>
              <SummaryValue type="income" value={totalIncome} $theme={theme}>
                {formatCurrency(totalIncome)}
              </SummaryValue>
            </SummaryInfo>
          </SummaryCard>

          <SummaryCard type="expense" $theme={theme}>
            <SummaryIcon type="expense" $theme={theme}>
              <TrendingDown size={window.innerWidth <= 480 ? 20 : 24} />
            </SummaryIcon>
            <SummaryInfo>
              <SummaryLabel $theme={theme}>Despesas</SummaryLabel>
              <SummaryValue type="expense" value={totalExpenses} $theme={theme}>
                {formatCurrency(totalExpenses)}
              </SummaryValue>
            </SummaryInfo>
          </SummaryCard>

          <SummaryCard type="balance" $theme={theme}>
            <SummaryIcon type="balance" $theme={theme}>
              <Wallet size={window.innerWidth <= 480 ? 20 : 24} />
            </SummaryIcon>
            <SummaryInfo>
              <SummaryLabel $theme={theme}>Saldo</SummaryLabel>
              <SummaryValue type="balance" value={balance} $theme={theme}>
                {formatCurrency(balance)}
              </SummaryValue>
            </SummaryInfo>
          </SummaryCard>
        </SummaryGrid>

        <ChartsGrid>
          <ChartContainer $theme={theme}>
            <ChartTitle $theme={theme}>Despesas por Categoria</ChartTitle>
            {expenseChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={window.innerWidth <= 480 ? 80 : 90}
                    innerRadius={window.innerWidth <= 480 ? 40 : 45}
                    paddingAngle={4}
                    label={({ name, percent }) => {
                      const percentage = percent
                        ? (percent * 100).toFixed(0)
                        : 0;
                      return isMobile
                        ? `${percentage}%`
                        : `${name} ${percentage}%`;
                    }}
                    labelLine={false}
                  >
                    {expenseChartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={customTooltipStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart $theme={theme}>
                <EmptyIcon $theme={theme}>
                  <TrendingDown size={24} />
                </EmptyIcon>
                <div>
                  <strong>Nenhuma despesa registrada</strong>
                  <br />
                  Adicione transações para visualizar os dados
                </div>
              </EmptyChart>
            )}
          </ChartContainer>

          <ChartContainer $theme={theme}>
            <ChartTitle $theme={theme}>Receitas vs Despesas</ChartTitle>
            {summaryData.some((item) => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={summaryData}
                  barCategoryGap="20%"
                  barSize={isMobile ? 32 : 48}
                >
                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: colors[theme].textSecondary,
                      fontSize: window.innerWidth <= 480 ? 12 : 14,
                    }}
                    axisLine={{ stroke: colors[theme].borderSecondary }}
                    tickLine={{ stroke: colors[theme].borderSecondary }}
                  />
                  <YAxis
                    tick={{
                      fill: colors[theme].textSecondary,
                      fontSize: window.innerWidth <= 480 ? 12 : 14,
                    }}
                    axisLine={{ stroke: colors[theme].borderSecondary }}
                    tickLine={{ stroke: colors[theme].borderSecondary }}
                    tickFormatter={(value) => {
                      if (value >= 1000) {
                        return `${(value / 1000).toFixed(0)}k`;
                      }
                      return value.toString();
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={customTooltipStyle}
                  />
                  <Bar
                    dataKey="value"
                    fill={colors[theme].primary}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={window.innerWidth <= 480 ? 60 : 80}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart $theme={theme}>
                <EmptyIcon $theme={theme}>
                  <TrendingUp size={24} />
                </EmptyIcon>
                <div>
                  <strong>Nenhuma transação registrada</strong>
                  <br />
                  Adicione receitas e despesas para ver o comparativo
                </div>
              </EmptyChart>
            )}
          </ChartContainer>
        </ChartsGrid>
      </Content>
    </Container>
  );
};

export default Chart;
