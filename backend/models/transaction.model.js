import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Users",
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	paymentType: {
		type: String,
		enum: ["cash", "card", "upi", "banktransfer"],
		required: true,
	},
	category: {
		type: String,
		enum: ["saving", "expense", "investment"],
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	location: {
		type: String,
		default: "Unknown",
	},
	date: {
		type: Date,
		required: true,
	},
});

const Transactions = mongoose.model("Transactions", transactionSchema);

export default Transactions;
