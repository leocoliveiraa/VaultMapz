import React from "react";
import styled from "styled-components";
import { useTheme, colors } from "../contexts/ThemeContext";
import { FiTrash2, FiEdit, FiArrowUp, FiArrowDown } from "react-icons/fi";
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
    display: none; /* Esconde tabela no mobile */
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

const ActionButton = styled.button<{
  $theme: "light" | "dark";
  $variant: "edit" | "delete";
}>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  color: ${(props) =>
    props.$variant === "edit"
      ? colors[props.$theme].textSecondary
      : colors[props.$theme].danger};
  transition: all 0.25s ease;

  &:hover {
    background: ${(props) => colors[props.$theme].backgroundSecondary};
    color: ${(props) =>
      props.$variant === "edit"
        ? colors[props.$theme].primary
        : colors[props.$theme].dangerDark};
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid ${(props) => colors[props.$theme].primary};
    outline-offset: 2px;
  }

  & + & {
    margin-left: 0.75rem;
  }
`;

/* === Estilos para Mobile: Cards === */

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
  }
`;

const CardActions = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
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

  const handleDelete = async (_id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        onTransactionDeleted();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
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
          {/* Tabela para desktop */}
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
                  <TableCell $theme={theme}>{transaction.title}</TableCell>
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
                      {transaction.category}
                    </CategoryBadge>
                  </TableCell>
                  <TableCell $theme={theme}>
                    <ActionButton
                      $theme={theme}
                      $variant="edit"
                      onClick={() => console.log("Edit", transaction.id)}
                      aria-label={`Editar transação ${transaction.title}`}
                    >
                      <FiEdit size={18} />
                    </ActionButton>
                    <ActionButton
                      $theme={theme}
                      $variant="delete"
                      onClick={() => handleDelete(transaction.id)}
                      aria-label={`Excluir transação ${transaction.title}`}
                    >
                      <FiTrash2 size={18} />
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </TransactionTable>

          {/* Cards para mobile */}
          <CardList $theme={theme}>
            {transactions.map((transaction) => (
              <Card key={transaction.id} $theme={theme} role="listitem">
                <CardRow $theme={theme}>
                  <span>Descrição</span>
                  <span>{transaction.title}</span>
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
                    {transaction.category}
                  </CategoryBadge>
                </CardRow>

                <CardActions>
                  <ActionButton
                    $theme={theme}
                    $variant="edit"
                    onClick={() => console.log("Edit", transaction.id)}
                    aria-label={`Editar transação ${transaction.title}`}
                  >
                    <FiEdit size={18} />
                  </ActionButton>
                  <ActionButton
                    $theme={theme}
                    $variant="delete"
                    onClick={() => handleDelete(transaction.id)}
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

const EmptyMessage = styled.div<{ $theme: "light" | "dark" }>`
  padding: 3rem 0;
  text-align: center;
  color: ${(props) => colors[props.$theme].textSecondary};
  font-size: 1rem;
  font-weight: 500;
`;

export default TransactionList;
