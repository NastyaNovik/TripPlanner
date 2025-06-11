import {CurrencyType} from '../enums/currency';

export interface Expense {
    description: string;
    amount: number;
    currency: CurrencyType;
}
