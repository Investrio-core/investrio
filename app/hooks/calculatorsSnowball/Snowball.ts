import { PiLinkBreakLight } from "react-icons/pi";
import Account from "./Account";
import Results from "./Results";
import { REPAYMENT_STRATEGIES } from "./constants";
import { toCurrency } from "./helpers";
import {
  AccountMonth,
  AccountObjectKeys,
  OrderDirection,
  RepaymentStrategy,
  type AccountObject,
} from "./types";

class Snowball {
  accounts: Account[] = [];
  additionalPayment: number;
  balanceStart: number;
  currentBalance: number;
  snowballAmount: number;
  strategy: string;
  totalInterestPaid: number;

  constructor(
    accounts: AccountObject[],
    additionalPayment = 0,
    strategy = REPAYMENT_STRATEGIES.AVALANCHE
  ) {
    this.strategy = strategy;
    this.accounts = this.setAccounts(accounts);
    this.balanceStart = this.getCurrentBalance();
    this.currentBalance = this.balanceStart;
    this.additionalPayment = additionalPayment;
    this.snowballAmount = additionalPayment;
    this.totalInterestPaid = 0;
  }

  parseAccounts(accounts: AccountObject[]) {
    if (!Array.isArray(accounts)) {
      throw new Error("accounts must be an array");
    }

    const defaultAccount = {
      name: "",
      interest: 0,
      balance: 0,
      minPayment: 0,
    };

    return accounts
      .filter((account) => {
        return account?.constructor === Object;
      })
      .map((account) => {
        return {
          ...defaultAccount,
          ...account,
        };
      });
  }

  sortAccounts(
    accounts: AccountObject[],
    key: AccountObjectKeys = AccountObjectKeys.interest,
    order: OrderDirection = OrderDirection.descending
  ) {
    const firstValue = order === OrderDirection.ascending ? 1 : -1;
    const secondValue = order === OrderDirection.ascending ? -1 : 1;
    return accounts.sort((a, b) => {
      if (a[key] > b[key]) return firstValue;
      if (a[key] < b[key]) return secondValue;
      return 0;
    });
  }

  getSortKeyAndOrder() {
    switch (this.strategy) {
      case RepaymentStrategy.snowball:
        return {
          key: AccountObjectKeys.balance,
          order: OrderDirection.ascending,
        };
      case RepaymentStrategy.avalanche:
      default:
        return {
          key: AccountObjectKeys.interest,
          order: OrderDirection.descending,
        };
    }
  }

  setAccounts(accounts: AccountObject[]) {
    const parsedAccounts = this.parseAccounts(accounts);
    const { key, order } = this.getSortKeyAndOrder();
    const sortedAccounts = this.sortAccounts(parsedAccounts, key, order);
    // console.log("-- SORTED ACCOUNTS --");
    // console.log(sortedAccounts);
    return sortedAccounts.map((account) => new Account(account));
  }

  getCurrentBalance() {
    const sum = this.accounts
      .map(({ balance }) => balance)
      .reduce((a, b) => a + b, 0);
    return toCurrency(sum);
  }

  makePaymentForAccount(
    account: Account,
    idx: number,
    numTimesExceededInterest: number,
    alreadyIncrementedThisIteration: boolean,
    _paymentDate: Date
  ) {
    let paymentDate;
    let paymentISOString;
    try {
      // paymentDate = new Date();
      // paymentDate.setMonth(paymentDate.getMonth() + idx);
      // paymentISOString = paymentDate.toISOString();
      paymentISOString = _paymentDate.toISOString();
    } catch (e) {
      // paymentDate = new Date();
      // return undefined;
      console.log("problem on setting month to index: ", idx);
    }

    // const paymentDate = new Date();

    const payment = account.makePayment(
      this.snowballAmount,
      paymentISOString ?? "Unknown Future Date",
      numTimesExceededInterest,
      alreadyIncrementedThisIteration
    );

    if (payment.balanceEnd > 0) {
      this.snowballAmount = 0;
    } else if (this.balanceStart > 0) {
      this.snowballAmount = toCurrency(
        this.additionalPayment + account.minPayment - payment.paymentAmount
      );
    }

    this.totalInterestPaid += payment.accruedInterest;

    return { ...payment };
  }

  makePaymentsForMonth(
    numIterations: number,
    numTimesExceededInterest: number,
    _paymentDate: Date
  ) {
    this.snowballAmount = this.additionalPayment;
    let alreadyIncrementedThisIteration = false;
    const accounts = this.accounts.map((account, idx) => {
      const paymentForAccount = this.makePaymentForAccount(
        account,
        numIterations,
        numTimesExceededInterest,
        alreadyIncrementedThisIteration,
        _paymentDate
      );
      return paymentForAccount;
    });
    this.currentBalance = this.getCurrentBalance();

    return {
      balance: this.currentBalance,
      accounts,
    };
  }

  areAccountBalancesDecreasing(accounts: AccountMonth[]) {
    const allAccountsDecreasing = [];
    for (let i = 0; i < accounts.length; i++) {
      // if (accounts[i].balanceStart > accounts[i].balanceEnd) {
      //   return false;
      // }
      allAccountsDecreasing.push(
        accounts[i].balanceStart > accounts[i].balanceEnd
      );
    }
    return !!allAccountsDecreasing.find((e) => e === true);
    // return allAccountsDecreasing.every(decreasing => decreasing !== false);
  }

  /**
   * Generates a payment plan
   * @returns {Payment[]} - An array of payments
   */
  createPaymentPlan() {
    let numIterations = 0;
    let numTimesExceededInterest = 0;
    let numTimesAccountsNotDecreasing = 0;
    const MAX_ITERATIONS = 36;
    let _paymentDate = new Date();
    const paymentPlan = [];

    while (this.currentBalance > 0) {
      const payment = this.makePaymentsForMonth(
        numIterations,
        numTimesExceededInterest,
        _paymentDate
      );

      const { accounts } = payment;
      const accountsAreDecreasing = this.areAccountBalancesDecreasing(accounts);

      // console.log("-- accounts are decreasing --");
      // console.log(accountsAreDecreasing);
      // console.log(accounts);

      if (paymentPlan) {
        paymentPlan.push(payment);
      }
      numIterations++;
      // if (numIterations > MAX_ITERATIONS) break;
      // if (numTimesExceededInterest > MAX_ITERATIONS) break;
      _paymentDate.setMonth(_paymentDate.getMonth() + 1);

      if (!accountsAreDecreasing) {
        numTimesAccountsNotDecreasing++;
      }
      if (numTimesAccountsNotDecreasing > MAX_ITERATIONS) {
        break;
      }

      // console.log("num iterations: ", numIterations);
      // console.log("num times exceeded interest: ", numTimesExceededInterest);
      // console.log("payment date: ", _paymentDate);
    }
    return new Results(paymentPlan, this.strategy);
  }
}

export default Snowball;
