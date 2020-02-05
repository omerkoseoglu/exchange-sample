import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Exchange } from './currency.model';
import { DatePipe } from '@angular/common';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  parser = new DOMParser();

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private xml2JsonService: NgxXml2jsonService
  ) { }

  getExchangeRate(date: Date): Observable<Exchange> {
    const dateStr = this.getDateStringWithFormat(date, 'ddMMyyyy');
    const yearMonth = this.getDateStringWithFormat(date, 'yyyyMM');

    const headers = new HttpHeaders({ 'Content-Type': 'text/xml' }).set('Accept', 'text/xml');

    const url = `/kurlar/${yearMonth}/${dateStr}.xml`;

    return this.http.get(url, { headers, responseType: 'text' })
      .pipe(
        map(result => {
          const xml = this.parser.parseFromString(result, 'text/xml');
          const obj = this.xml2JsonService.xmlToJson(xml);
          const data: Exchange = JSON.parse(JSON.stringify(obj));
          return data;
        }),
      );
  }

  private getDateStringWithFormat(date: Date, format: string): string {
    return this.datePipe.transform(date, format);
  }
}
