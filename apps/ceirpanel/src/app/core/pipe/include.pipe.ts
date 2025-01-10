/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'includes',
})
export class Includes implements PipeTransform {

    public transform(haystack: string, needle: string): boolean;
    public transform<T>(array: T[], item: T): boolean;
    public transform(haystack: any[] | string, needle: any | string): boolean {
        return haystack.includes(needle);
    }
}