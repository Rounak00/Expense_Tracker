import Transactions from "../../models/transaction.model.js";
import Users from "../../models/user.model.js";
const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized User");
        const userId = context.getUser()._id;
        const transactions = await Transactions.find({ userId });
        return transactions;
      } catch (err) {
        throw new Error("Error in get all transactions");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transactions.findById(transactionId);
        return transaction;
      } catch (err) {
        throw new Error("Error in get transaction by ID");
      }
    },
    categoryStatistics: async (_, __, context) => {
			if (!context.getUser()) throw new Error("Unauthorized");

			const userId = context.getUser()._id;
			const transactions = await Transactions.find({ userId });
			const categoryMap = {};

			// const transactions = [
			// 	{ category: "expense", amount: 50 },
			// 	{ category: "expense", amount: 75 },
			// 	{ category: "investment", amount: 100 },
			// 	{ category: "saving", amount: 30 },
			// 	{ category: "saving", amount: 20 }
			// ];

			transactions.forEach((transaction) => {
				if (!categoryMap[transaction.category]) {
					categoryMap[transaction.category] = 0;
				}
				categoryMap[transaction.category] += transaction.amount;
			});

			// categoryMap = { expense: 125, investment: 100, saving: 50 }

			return Object.entries(categoryMap).map(([category, amount]) => ({ category, amount }));
			// return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
		},
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        if (!input.amount || !input.description || !input.paymentType || !input.category || !input.date) {
          throw new Error("All fields are required");
          return ;
        }
        const newTransaction = new Transactions({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.error("Error creating transaction:", err);
        throw new Error("Error creating transaction");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transactions.findByIdAndUpdate(
          input.transactionId,
          input,
          {
            new: true,
          }
        );
        return updatedTransaction;
      } catch (err) {
        console.error("Error updating transaction:", err);
        throw new Error("Error updating transaction");
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transactions.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (err) {
        console.error("Error deleting transaction:", err);
        throw new Error("Error deleting transaction");
      }
    },
  },
  Transaction: {
    user: async (parent) => {
      const userId=parent.userId;
      try{
        const user = await Users.findById(userId);
        return user;
      }catch(err){
        throw new Error("Error in get user by ID at transaction resolver relation");
      }
    }
  }
};
export default transactionResolver;
