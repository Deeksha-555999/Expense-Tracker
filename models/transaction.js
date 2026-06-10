import db from "../db.js";

const createTransaction = db.prepare(
  `INSERT INTO transactions (user_id, amount, type, savings) VALUES (?, ?, ?, ?)`
);
const getTransactionsByUser = db.prepare(
  `SELECT id AS _id, user_id AS userId, amount, type, savings, created_at AS createdAt
   FROM transactions
   WHERE user_id = ?
   ORDER BY datetime(created_at) DESC, id DESC`
);

export const Transaction = {
  create(data) {
    const info = createTransaction.run(
      data.userId,
      data.amount,
      data.type,
      data.savings,
    );

    return {
      _id: info.lastInsertRowid,
      userId: data.userId,
      amount: data.amount,
      type: data.type,
      savings: data.savings,
      createdAt: new Date().toISOString(),
    };
  },
  findByUserId(userId) {
    return getTransactionsByUser.all(userId);
  },
};

export default Transaction;
