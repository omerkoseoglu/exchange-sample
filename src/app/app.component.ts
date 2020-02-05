import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'exchange-sample';

  constructor(
    private http: HttpClient
  ) {

    const headers = new HttpHeaders({ 'Content-Type': 'text/xml' }).set('Accept', 'text/xml');

    this.http.get(`/kurlar/202002/03022020.xml`, { headers, responseType: 'text' })
      .subscribe(result => {
        console.log(result);
      });
  }
}
