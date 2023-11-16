import { getDefaultDataOptions, getDefaultPsyOptions } from 'defaults';
import { DataOptions, PsyOptions } from 'types';

function cleanObject<T>(dirty: { [index: string]: any }, clean: T): T {
    for (let key in clean) {
        if (typeof clean[key] === typeof dirty[key]) {
            clean[key] = dirty[key];
        }
    }
    return clean;
}

/**
 * Delete any object key that does not appear in `PsyOptions` while setting defaults to missing keys.
 */
export function cleanPsyOptions(dirty: { [index: string]: any }): PsyOptions {
    return cleanObject(dirty, getDefaultPsyOptions());
}

/**
 * Delete any object key that does not appear in `DataOptions` while setting defaults to missing keys.
 */
export function cleanDataOptions(dirty: { [index: string]: any }, legend = ''): DataOptions {
    return cleanObject(dirty, getDefaultDataOptions(legend));
}
