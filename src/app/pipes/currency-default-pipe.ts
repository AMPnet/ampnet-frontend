import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyDefault'
})
export class CurrencyDefaultPipe extends CurrencyPipe implements PipeTransform {
    transform(
        value: number,
        code = 'EUR',
        display = 'symbol',
        digitsInfo = '1.2-2',
        locale = 'en'
    ) {
        return super.transform(value / 100, code, display, digitsInfo, locale);
    }
}
