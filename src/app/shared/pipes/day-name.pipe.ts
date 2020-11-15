import { FormStyle, getLocaleDayNames, TranslationWidth } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dayName',
})
export class DayNamePipe implements PipeTransform {
    constructor(@Inject(LOCALE_ID) private locale: string) {}

    transform(value: Date) {
        return getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide)[value.getDay()];
    }
}
