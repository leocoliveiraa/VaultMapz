import React, { useState } from "react";
import styled from "styled-components";
import { useTheme, colors } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { transactionsService } from "../services/transactionsService";
import { FiTrash2, FiArrowUp, FiArrowDown } from "react-icons/fi";
import type { Transaction } from "../interfaces/Transaction";

const ListContainer = styled.div<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].surface};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${(props) =>
    props.$theme === "light"
      ? "0 8px 16px rgba(0, 0, 0, 0.06)"
      : "0 8px 24px rgba(0, 0, 0, 0.9)"};
  border: 1px solid ${(props) => colors[props.$theme].border};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ListHeader = styled.div<{ $theme: "light" | "dark" }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const ListTitle = styled.h2<{ $theme: "light" | "dark" }>`
  color: ${(props) => colors[props.$theme].text};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const TransactionCount = styled.span<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].primaryLight};
  color: ${(props) => colors[props.$theme].primary};
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  box-shadow: 0 2px 6px
    ${(props) =>
      props.$theme === "light"
        ? "rgba(59, 130, 246, 0.3)"
        : "rgba(96, 165, 250, 0.6)"};
`;

const TransactionTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TableHeader = styled.thead<{ $theme: "light" | "dark" }>`
  border-bottom: 2px solid ${(props) => colors[props.$theme].border};
`;

const TableHeaderCell = styled.th<{ $theme: "light" | "dark" }>`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => colors[props.$theme].textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.06em;

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }
`;

const TableRow = styled.tr<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].backgroundSecondary};
  border-radius: 12px;
  box-shadow: 0 4px 8px
    ${(props) =>
      props.$theme === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(0, 0, 0, 0.7)"};
  transition: background 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$theme === "light"
        ? colors[props.$theme].backgroundTertiary
        : colors[props.$theme].background};
  }
`;

const TableCell = styled.td<{ $theme: "light" | "dark" }>`
  padding: 1rem 1rem;
  font-size: 1rem;
  color: ${(props) => colors[props.$theme].text};
  vertical-align: middle;

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }
`;

const TitleCell = styled(TableCell)<{ $theme: "light" | "dark" }>`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 1200px) {
    max-width: 150px;
  }

  @media (max-width: 992px) {
    max-width: 120px;
  }
`;

const AmountCell = styled(TableCell)<{
  $type: "income" | "expense";
  $theme: "light" | "dark";
}>`
  font-weight: 700;
  color: ${(props) =>
    props.$type === "income"
      ? colors[props.$theme].success
      : colors[props.$theme].danger};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const CategoryBadge = styled.span<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].primaryLight};
  color: ${(props) => colors[props.$theme].primary};
  font-size: 0.8rem;
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
  font-weight: 600;
  white-space: nowrap;
`;

const ActionButton = styled.button<{ $theme: "light" | "dark" }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  color: ${(props) => colors[props.$theme].danger};
  transition: all 0.25s ease;

  &:hover {
    background: ${(props) => colors[props.$theme].backgroundSecondary};
    color: ${(props) => colors[props.$theme].dangerDark};
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid ${(props) => colors[props.$theme].primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CardList = styled.div<{ $theme: "light" | "dark" }>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const Card = styled.div<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].backgroundSecondary};
  border-radius: 14px;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 4px 12px
    ${(props) =>
      props.$theme === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(0, 0, 0, 0.9)"};
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  transition: background 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$theme === "light"
        ? colors[props.$theme].backgroundTertiary
        : colors[props.$theme].background};
  }
`;

const CardRow = styled.div<{ $theme: "light" | "dark" }>`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: ${(props) => colors[props.$theme].text};

  & span:first-child {
    font-weight: 600;
    color: ${(props) => colors[props.$theme].textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  & span:last-child {
    text-align: right;
    margin-left: 1rem;
  }
`;

const TruncatedTitle = styled.span<{ $theme: "light" | "dark" }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;

  @media (max-width: 480px) {
    max-width: 150px;
  }

  @media (max-width: 360px) {
    max-width: 120px;
  }
`;

const CardActions = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
`;

const EmptyMessage = styled.div<{ $theme: "light" | "dark" }>`
  padding: 3rem 0;
  text-align: center;
  color: ${(props) => colors[props.$theme].textSecondary};
  font-size: 1rem;
  font-weight: 500;
`;

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionDeleted: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onTransactionDeleted,
}) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = async (id: string) => {
    if (!currentUser) {
      alert("Usuário não autenticado");
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir esta transação?")) {
      return;
    }

    setDeletingIds((prev) => new Set([...prev, id]));

    try {
      await transactionsService.deleteTransaction(id);
      onTransactionDeleted();
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      alert("Erro ao excluir transação. Tente novamente.");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      food: "Alimentação",
      transport: "Transporte",
      housing: "Moradia",
      entertainment: "Lazer",
      health: "Saúde",
      education: "Educação",
      salary: "Salário",
      other: "Outros",
    };
    return categories[category] || category;
  };

  return (
    <ListContainer $theme={theme}>
      <ListHeader $theme={theme}>
        <ListTitle $theme={theme}>Transações Recentes</ListTitle>
        <TransactionCount $theme={theme}>
          {transactions.length}
        </TransactionCount>
      </ListHeader>

      {transactions.length === 0 ? (
        <EmptyMessage $theme={theme}>
          Nenhuma transação encontrada. Adicione uma nova transação para
          começar.
        </EmptyMessage>
      ) : (
        <>
          <TransactionTable>
            <TableHeader $theme={theme}>
              <tr>
                <TableHeaderCell $theme={theme}>Descrição</TableHeaderCell>
                <TableHeaderCell $theme={theme}>Valor</TableHeaderCell>
                <TableHeaderCell $theme={theme}>Data</TableHeaderCell>
                <TableHeaderCell $theme={theme}>Categoria</TableHeaderCell>
                <TableHeaderCell $theme={theme}>Ações</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} $theme={theme}>
                  <TitleCell $theme={theme} title={transaction.title}>
                    {transaction.title}
                  </TitleCell>
                  <AmountCell
                    $theme={theme}
                    $type={transaction.type}
                    aria-label={`Valor da transação: ${formatCurrency(
                      transaction.amount
                    )}`}
                  >
                    {transaction.type === "income" ? (
                      <FiArrowUp size={18} />
                    ) : (
                      <FiArrowDown size={18} />
                    )}
                    {formatCurrency(transaction.amount)}
                  </AmountCell>
                  <TableCell $theme={theme}>
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell $theme={theme}>
                    <CategoryBadge $theme={theme}>
                      {getCategoryName(transaction.category)}
                    </CategoryBadge>
                  </TableCell>
                  <TableCell $theme={theme}>
                    <ActionButton
                      $theme={theme}
                      onClick={() => handleDelete(transaction.id)}
                      disabled={deletingIds.has(transaction.id)}
                      aria-label={`Excluir transação ${transaction.title}`}
                    >
                      <FiTrash2 size={18} />
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </TransactionTable>

          <CardList $theme={theme}>
            {transactions.map((transaction) => (
              <Card key={transaction.id} $theme={theme} role="listitem">
                <CardRow $theme={theme}>
                  <span>Descrição</span>
                  <TruncatedTitle $theme={theme} title={transaction.title}>
                    {transaction.title}
                  </TruncatedTitle>
                </CardRow>
                <CardRow $theme={theme}>
                  <span>Valor</span>
                  <AmountCell
                    as="span"
                    $theme={theme}
                    $type={transaction.type}
                    aria-label={`Valor da transação: ${formatCurrency(
                      transaction.amount
                    )}`}
                  >
                    {transaction.type === "income" ? (
                      <FiArrowUp size={18} />
                    ) : (
                      <FiArrowDown size={18} />
                    )}
                    {formatCurrency(transaction.amount)}
                  </AmountCell>
                </CardRow>
                <CardRow $theme={theme}>
                  <span>Data</span>
                  <span>{formatDate(transaction.date)}</span>
                </CardRow>
                <CardRow $theme={theme}>
                  <span>Categoria</span>
                  <CategoryBadge $theme={theme}>
                    {getCategoryName(transaction.category)}
                  </CategoryBadge>
                  </CardRow>

                <CardActions>
                  <ActionButton
                    $theme={theme}
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deletingIds.has(transaction.id)}
                    aria-label={`Excluir transação ${transaction.title}`}
                  >
                    <FiTrash2 size={18} />
                  </ActionButton>
                </CardActions>
              </Card>
            ))}
          </CardList>
        </>
      )}
    </ListContainer>
  );
};

export default TransactionList;
