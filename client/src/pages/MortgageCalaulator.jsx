import React, { useState } from 'react';

const MortgageCalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [downPaymentPercentage, setDownPaymentPercentage] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const [purchasePriceError, setPurchasePriceError] = useState('');
  const [downPaymentPercentageError, setDownPaymentPercentageError] = useState('');
  const [loanTermError, setLoanTermError] = useState('');
  const [interestRateError, setInterestRateError] = useState('');

  const clearErrors = () => {
    setPurchasePriceError('');
    setDownPaymentPercentageError('');
    setLoanTermError('');
    setInterestRateError('');
  };

  const calculateMonthlyPayment = () => {
    clearErrors();

    if (!purchasePrice) {
      setPurchasePriceError('Please enter the purchase price.');
      return;
    }
    if (!downPaymentPercentage) {
      setDownPaymentPercentageError('Please enter the down payment percentage.');
      return;
    }
    if (!loanTerm) {
      setLoanTermError('Please enter the loan term.');
      return;
    }
    if (!interestRate) {
      setInterestRateError('Please enter the annual interest rate.');
      return;
    }

    const principal = parseFloat(purchasePrice) * (1 - parseFloat(downPaymentPercentage) / 100);
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    const monthlyPayment =
      (principal * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    setMonthlyPayment(monthlyPayment.toFixed(2));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
      <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg max-w-lg">
        <form className="text-center">
          <h2 className="text-4xl font-extrabold text-blue-700 mb-4">Mortgage Calculator</h2>
          <p className="text-gray-600 mb-8">
            Calculate your estimated monthly mortgage payment with ease.
          </p>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="purchasePrice"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Purchase Price (₹)
              </label>
              <input
                type="number"
                id="purchasePrice"
                className={`mt-1 p-3 w-full border ${
                  purchasePriceError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
                placeholder="Enter purchase price"
                value={purchasePrice}
                onChange={(e) => {
                  setPurchasePrice(e.target.value);
                  clearErrors();
                }}
              />
              {purchasePriceError && (
                <p className="text-red-500 text-sm mt-1">{purchasePriceError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="downPaymentPercentage"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Down Payment Percentage (%)
              </label>
              <input
                type="number"
                id="downPaymentPercentage"
                className={`mt-1 p-3 w-full border ${
                  downPaymentPercentageError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
                placeholder="Enter down payment percentage"
                value={downPaymentPercentage}
                onChange={(e) => {
                  setDownPaymentPercentage(e.target.value);
                  clearErrors();
                }}
              />
              {downPaymentPercentageError && (
                <p className="text-red-500 text-sm mt-1">{downPaymentPercentageError}</p>
              )}
            </div>
            <div>
              <label htmlFor="loanTerm" className="block text-lg font-medium text-gray-700 mb-2">
                Loan Term (Years)
              </label>
              <input
                type="number"
                id="loanTerm"
                className={`mt-1 p-3 w-full border ${
                  loanTermError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
                placeholder="Enter loan term"
                value={loanTerm}
                onChange={(e) => {
                  setLoanTerm(e.target.value);
                  clearErrors();
                }}
              />
              {loanTermError && (
                <p className="text-red-500 text-sm mt-1">{loanTermError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="interestRate"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                id="interestRate"
                className={`mt-1 p-3 w-full border ${
                  interestRateError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
                placeholder="Enter annual interest rate"
                value={interestRate}
                onChange={(e) => {
                  setInterestRate(e.target.value);
                  clearErrors();
                }}
              />
              {interestRateError && (
                <p className="text-red-500 text-sm mt-1">{interestRateError}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 w-full font-semibold"
            onClick={calculateMonthlyPayment}
          >
            Calculate Monthly Payment
          </button>
          {monthlyPayment && (
            <p className="mt-8 text-green-700 text-2xl font-semibold">
              Estimated Monthly Payment: ₹{monthlyPayment}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default MortgageCalculator;
