import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly apiUrl = 'https://open.er-api.com/v6/latest';
  rates: Record<string, number> = {};

  constructor(private http: HttpClient) { }

  fetchRates(currency: string): Observable<any>  {
    return this.http.get<any>(`${this.apiUrl}?base=${currency}`).pipe(
      map((response) => this.rates = {...response.rates}));
  }

  convert(amount: number, from: string, to: string): number {
    if(from === to) return amount;
    const fromRate = this.rates[from];
    const toRate = this.rates[to];

    return (amount * toRate) / fromRate;
  }
}
