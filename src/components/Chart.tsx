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
  Legend,
} from "recharts";
import type { Transaction } from "../interfaces/Transaction";
import { formatCurrency } from "../utils/formatCurrency";
import { useTheme, colors } from "../contexts/ThemeContext";
import { TrendingDown, BarChart3 } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

interface ChartProps {
  transactions: Transaction[];
}

const Container = styled.div<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].surface};
  border-radius: clamp(12px, 2vw, 20px);
  box-shadow: 0 4px 20px ${(props) => colors[props.$theme].shadow};
  border: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 32px ${(props) => colors[props.$theme].shadowHover};
  }
`;

const Header = styled.div<{ $theme: "light" | "dark" }>`
  padding: clamp(1rem, 3vw, 1.5rem) clamp(1.25rem, 4vw, 2rem);
  border-bottom: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  background: ${(props) => colors[props.$theme].surfaceSecondary};
`;

const Title = styled.h2<{ $theme: "light" | "dark" }>`
  margin: 0;
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  font-weight: 700;
  color: ${(props) => colors[props.$theme].text};
  letter-spacing: -0.025em;
  text-align: center;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1rem, 3vw, 2rem);
  padding: clamp(1rem, 3vw, 2rem);

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ChartContainer = styled.div<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].surfaceSecondary};
  border-radius: clamp(10px, 2vw, 16px);
  padding: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 6px 20px ${(props) => colors[props.$theme].shadow};
    transform: translateY(-2px);
  }
`;

const ChartTitle = styled.h3<{ $theme: "light" | "dark" }>`
  margin: 0 0 clamp(1rem, 3vw, 1.5rem) 0;
  font-size: clamp(0.9rem, 2.5vw, 1.125rem);
  font-weight: 700;
  color: ${(props) => colors[props.$theme].text};
  text-align: center;
  letter-spacing: -0.025em;
`;

const EmptyChart = styled.div<{ $theme: "light" | "dark" }>`
  height: clamp(180px, 40vw, 280px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(props) => colors[props.$theme].textMuted};
  font-size: clamp(0.75rem, 2vw, 0.95rem);
  text-align: center;
  line-height: 1.5;
  padding: clamp(1rem, 4vw, 2rem);
  gap: clamp(0.5rem, 2vw, 1rem);
`;

const EmptyIcon = styled.div<{ $theme: "light" | "dark" }>`
  width: clamp(32px, 10vw, 48px);
  height: clamp(32px, 10vw, 48px);
  border-radius: 50%;
  background: ${(props) => colors[props.$theme].borderSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => colors[props.$theme].textMuted};
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

  const chartHeight = isMobile ? 200 : 280;
  const pieRadius = isMobile
    ? { outer: 65, inner: 32 }
    : { outer: 90, inner: 45 };

  // Processamento dos dados
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const expenseChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({ name: category, value: amount })
  );

  const totals = transactions.reduce(
    (acc, t) => ({
      income: acc.income + (t.type === "income" ? t.amount : 0),
      expenses: acc.expenses + (t.type === "expense" ? t.amount : 0),
    }),
    { income: 0, expenses: 0 }
  );

  const summaryData = [
    { name: "Receitas", value: totals.income, fill: colors[theme].success },
    { name: "Despesas", value: totals.expenses, fill: colors[theme].danger },
  ];

  // Tooltip customizado com cores adaptadas ao tema
  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div
        style={{
          backgroundColor: colors[theme].surface,
          border: `1px solid ${colors[theme].borderSecondary}`,
          borderRadius: "8px",
          padding: isMobile ? "0.5rem" : "0.75rem",
          fontSize: isMobile ? "0.75rem" : "0.875rem",
          fontWeight: "500",
          boxShadow: `0 4px 12px ${colors[theme].shadow}`,
          color: colors[theme].text,
          maxWidth: isMobile ? "200px" : "250px",
        }}
      >
        {label && (
          <p
            style={{
              margin: "0 0 0.25rem 0",
              color: colors[theme].textSecondary,
              fontSize: isMobile ? "0.7rem" : "0.8rem",
              fontWeight: "600",
            }}
          >
            {label}
          </p>
        )}
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ margin: 0, color: colors[theme].text }}>
            <span style={{ color: entry.color, fontSize: "1.2em" }}>●</span>{" "}
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  };

  // Labels do gráfico pizza adaptados para mobile
  const pieLabel = ({ name, percent }: any) => {
    if (!percent || percent < 0.05) return ""; // Oculta labels muito pequenos
    const percentage = (percent * 100).toFixed(0);
    return isMobile ? `${percentage}%` : `${name}\n${percentage}%`;
  };

  // Formatador do eixo Y mais compacto para mobile
  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  return (
    <Container $theme={theme}>
      <Header $theme={theme}>
        <Title $theme={theme}>Visualização Financeira</Title>
      </Header>

      <ChartsGrid>
        {/* Gráfico de Despesas por Categoria */}
        <ChartContainer $theme={theme}>
          <ChartTitle $theme={theme}>
            {isMobile ? "Despesas" : "Despesas por Categoria"}
          </ChartTitle>
          {expenseChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie
                  data={expenseChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={pieRadius.outer}
                  innerRadius={pieRadius.inner}
                  paddingAngle={2}
                  label={pieLabel}
                  labelLine={false}
                  fontSize={isMobile ? 10 : 12}
                  fill={colors[theme].text}
                >
                  {expenseChartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={customTooltip} />
                <Legend
                  wrapperStyle={{
                    fontSize: isMobile ? "0.65rem" : "0.75rem",
                    color: colors[theme].textSecondary,
                    paddingTop: isMobile ? "0.5rem" : "1rem",
                  }}
                  iconSize={isMobile ? 8 : 12}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart $theme={theme}>
              <EmptyIcon $theme={theme}>
                <TrendingDown size={isMobile ? 16 : 20} />
              </EmptyIcon>
              <div>
                <strong>Sem despesas</strong>
                <br />
                {isMobile
                  ? "Adicione transações"
                  : "Adicione transações para visualizar"}
              </div>
            </EmptyChart>
          )}
        </ChartContainer>

        {/* Gráfico Comparativo */}
        <ChartContainer $theme={theme}>
          <ChartTitle $theme={theme}>
            {isMobile ? "Comparativo" : "Receitas vs Despesas"}
          </ChartTitle>
          {summaryData.some((item) => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart
                data={summaryData}
                barCategoryGap="30%"
                margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{
                    fill: colors[theme].textSecondary,
                    fontSize: isMobile ? 10 : 12,
                  }}
                  axisLine={{ stroke: colors[theme].borderSecondary }}
                  tickLine={{ stroke: colors[theme].borderSecondary }}
                />
                <YAxis
                  tick={{
                    fill: colors[theme].textSecondary,
                    fontSize: isMobile ? 9 : 11,
                  }}
                  axisLine={{ stroke: colors[theme].borderSecondary }}
                  tickLine={{ stroke: colors[theme].borderSecondary }}
                  tickFormatter={formatYAxis}
                  width={isMobile ? 35 : 60}
                />
                <Tooltip content={customTooltip} />
                <Bar
                  dataKey="value"
                  fill={colors[theme].primary}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={isMobile ? 40 : 60}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart $theme={theme}>
              <EmptyIcon $theme={theme}>
                <BarChart3 size={isMobile ? 16 : 20} />
              </EmptyIcon>
              <div>
                <strong>Sem dados</strong>
                <br />
                {isMobile
                  ? "Adicione transações"
                  : "Adicione transações para comparar"}
              </div>
            </EmptyChart>
          )}
        </ChartContainer>
      </ChartsGrid>
    </Container>
  );
};

export default Chart;
