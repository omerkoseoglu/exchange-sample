export interface Exchange {
  Tarih_Date: TarihDate;
}

export interface TarihDate {
  '@attributes': TarihDateAttributes;
  Currency: Currency[];
}

export interface TarihDateAttributes {
  Tarih: string;
  Date: string;
  Bulten_No: string;
}

export interface Currency {
  '@attributes': CurrencyAttributes;
  Unit: string;
  Isim: string;
  CurrencyName: string;
  ForexBuying: string;
  ForexSelling: string;
  BanknoteBuying: string;
  BanknoteSelling: string;
  CrossRateUSD: string;
  CrossRateOther: string;
}

export interface CurrencyAttributes {
  CrossOrder: string;
  Kod: string;
  CurrencyCode: string;
}
