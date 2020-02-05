import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs/operators';
import { Welcome } from './currency.model';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  faExclamationTriangle = faExclamationTriangle;

  title = 'exchange-sample';
  exchange: Welcome;
  now: Date = new Date();
  parser = new DOMParser();

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private xml2JsonService: NgxXml2jsonService
  ) {
  }

  private getDateStringWithFormat(date: Date, format: string): string {
    return this.datePipe.transform(date, format);
  }

  dateBoxValueChange(date: Date) {
    this.getExchangeRate(date);
  }

  private getExchangeRate(date: Date) {
    const dateStr = this.getDateStringWithFormat(date, 'ddMMyyyy');
    const yearMonth = this.getDateStringWithFormat(date, 'yyyyMM');

    const headers = new HttpHeaders({ 'Content-Type': 'text/xml' }).set('Accept', 'text/xml');

    const url = `/kurlar/${yearMonth}/${dateStr}.xml`;

    this.http.get(url, { headers, responseType: 'text' })
      .pipe(
        map(result => {
          const xml = this.parser.parseFromString(result, 'text/xml');
          const obj = this.xml2JsonService.xmlToJson(xml);
          const data: Welcome = JSON.parse(JSON.stringify(obj));
          return data;
        }),
      )
      .subscribe(result => {
        this.exchange = JSON.parse(JSON.stringify(result));
        this.exchange.Tarih_Date.Currency = this.exchange.Tarih_Date.Currency.filter(f => f['@attributes'].Kod !== 'XDR')
        console.log(JSON.stringify(result));
        console.log(this.exchange.Tarih_Date.Currency);
      });
  }

}
