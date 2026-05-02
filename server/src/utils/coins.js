import { User } from "../models/user.models.js";

export async function addCoins(userId, amount) {
  return User.findByIdAndUpdate(
    userId,
    { $inc: { coins: amount } },
    { new: true },
  );
}

export async function deductCoins(userId, amount) {
  return User.findByIdAndUpdate(
    userId,
    { $inc: { coins: -amount } },
    { new: true },
  );
}
