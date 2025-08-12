import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Transaction } from "../interfaces/Transaction";

const isDate = (value: any): value is Date => {
  return value instanceof Date;
};

const isString = (value: any): value is string => {
  return typeof value === "string";
};

const isTimestamp = (value: any): value is Timestamp => {
  return value && typeof value === "object" && "toDate" in value;
};

export const transactionsService = {
  async addTransaction(
    transaction: Omit<Transaction, "id" | "createdAt">
  ): Promise<void> {
    try {
      console.log("Adding transaction:", transaction);

      const docData: any = {
        ...transaction,
        createdAt: Timestamp.now(),
      };

      if (transaction.date) {
        if (isDate(transaction.date)) {
          docData.date = Timestamp.fromDate(transaction.date);
        } else if (isString(transaction.date)) {
          docData.date = Timestamp.fromDate(new Date(transaction.date));
        } else if (isTimestamp(transaction.date)) {
          docData.date = transaction.date;
        } else {
          docData.date = Timestamp.fromDate(new Date(transaction.date as any));
        }
      }

      await addDoc(collection(db, "transactions"), docData);
      console.log("Transaction added successfully");
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      console.log("Fetching transactions for userId:", userId);

      const q = query(
        collection(db, "transactions"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      console.log("Query snapshot size:", querySnapshot.size);

      const transactions = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate ? data.date.toDate() : data.date,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : data.createdAt,
        };
      }) as Transaction[];

      transactions.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });

      console.log("Transactions fetched and sorted:", transactions);
      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  async getTransactionsWithFirestoreOrder(
    userId: string
  ): Promise<Transaction[]> {
    try {
      console.log(
        "Fetching transactions with Firestore order for userId:",
        userId
      );

      const q = query(
        collection(db, "transactions"),
        where("userId", "==", userId),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);

      const transactions = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate ? data.date.toDate() : data.date,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : data.createdAt,
        };
      }) as Transaction[];

      return transactions;
    } catch (error) {
      console.error("Error fetching transactions with Firestore order:", error);
      throw error;
    }
  },

  async updateTransaction(
    id: string,
    transaction: Partial<Transaction>
  ): Promise<void> {
    try {
      console.log("Updating transaction:", id, transaction);

      const docRef = doc(db, "transactions", id);

      const updateData: any = { ...transaction };
      if (updateData.date) {
        if (isDate(updateData.date)) {
          updateData.date = Timestamp.fromDate(updateData.date);
        } else if (isString(updateData.date)) {
          updateData.date = Timestamp.fromDate(new Date(updateData.date));
        } else if (isTimestamp(updateData.date)) {
          updateData.date = updateData.date;
        } else {
          updateData.date = Timestamp.fromDate(
            new Date(updateData.date as any)
          );
        }
      }

      await updateDoc(docRef, updateData);
      console.log("Transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    try {
      console.log("Deleting transaction:", id);

      await deleteDoc(doc(db, "transactions", id));
      console.log("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  },
};
