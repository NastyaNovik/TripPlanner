import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageSearchService {
  private apiKey = '8r-VPLp1n1Dv5IoipnMSH_8_8LW_nKEFGs5FzxBsdw8';
  private apiUrl = 'https://api.unsplash.com/search/photos';

  constructor(private http: HttpClient) {}

  searchImage(query: string): Observable<string> {
    const url = `${this.apiUrl}?query=${query}&order_by=latest&client_id=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map(response => response.results[0]?.urls?.regular)
    );
  }
}
