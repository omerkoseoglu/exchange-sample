import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Currency } from './currency.model';
import { ExchangeService } from './exchange.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay, finalize} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  faExclamationTriangle = faExclamationTriangle;
  title = 'TCMB Exchange Rates Sample';
  exchange: Currency[] = [];
  now: Date = new Date();

  @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;

  constructor(
    private exchangeService: ExchangeService,
    private titleService: Title,
    private spinner: NgxSpinnerService
  ) {
    this.titleService.setTitle(this.title);
  }

  dateBoxValueChange(date: any) {
    this.getExchangeRates(date.value);
  }

  ngOnInit(): void {
    this.getExchangeRates(this.now);
  }

  getExchangeRates(date: Date) {
    this.spinner.show();

    this.exchangeService.getExchangeRate(date)
      .pipe(
        delay(4000),
        finalize(() => this.spinner.hide())
      )
      .subscribe(result => {
        this.exchange = result.Tarih_Date.Currency.filter(f => f['@attributes'].Kod !== 'XDR');
      }, error => {
        this.exchange = [];
      });
  }

  onToolbarPreparing($event: any) {
    $event.toolbarOptions.items.unshift({
      location: 'before',
      widget: 'dxDateBox',
      options: {
        width: 200,
        value: this.now,
        displayFormat: 'dd.MM.yyyy',
        onValueChanged: this.dateBoxValueChange.bind(this)
      }
    });
  }
}
