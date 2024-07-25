import mongoose from "mongoose";

const dinersRegex = /^(300|301|302|303|36|38)[0-9]{12}$/;
const masterCardRegex = /^5[1-5][0-9]{14}$/;
const visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)[0-9]{12}$/;

function validateCardType(cardNumber: string) {
  const isDiners = dinersRegex.test(cardNumber);
  const isMasterCard = masterCardRegex.test(cardNumber);
  const isVisa = visaRegex.test(cardNumber);

  // Ensure it matches exactly one type
  return (isDiners && !isMasterCard && !isVisa) ||
         (!isDiners && isMasterCard && !isVisa) ||
         (!isDiners && !isMasterCard && isVisa);
}

export const CreditCard = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
    validate: {
      validator: validateCardType,
      message: 'Credit card number must match exactly one type: Diners Club, MasterCard, or Visa.'
    }
  }
});

