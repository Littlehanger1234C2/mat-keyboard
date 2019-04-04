// - Lay out each dead key set as an object of property/value
//   pairs.  The rows below are wrapped so uppercase letters are
//   below their lowercase equivalents.
//
// - The property name is the letter pressed after the diacritic.
//   The property value is the letter this key-combo will generate.
//
// - Note that if you have created a new keyboard layout and want
//   it included in the distributed script, PLEASE TELL ME if you
//   have added additional dead keys to the ones below.
import { InjectionToken } from '@angular/core';

export interface IKeyboardDeadkeys {
  [deadkey: string]: {
    [target: string]: string;
  };
}

export const MAT_KEYBOARD_DEADKEYS = new InjectionToken<IKeyboardDeadkeys>('MAT_KEYBOARD_DEADKEYS');
export const keyboardDeadkeys: IKeyboardDeadkeys = {
  '"': {
    a: '\u00e4',
    e: '\u00eb',
    i: '\u00ef',
    o: '\u00f6',
    u: '\u00fc',
    y: '\u00ff',
    ι: '\u03ca',
    υ: '\u03cb',
    ū: '\u01D6',
    ú: '\u01D8',
    ǔ: '\u01DA',
    ù: '\u01DC',
    A: '\u00c4',
    E: '\u00cb',
    I: '\u00cf',
    O: '\u00d6',
    U: '\u00dc',
    Y: '\u0178',
    Ι: '\u03aa',
    Υ: '\u03ab',
    Ū: '\u01D5',
    Ú: '\u01D7',
    Ǔ: '\u01D9',
    Ù: '\u01DB',
    か: '\u304c',
    き: '\u304e',
    く: '\u3050',
    け: '\u3052',
    こ: '\u3054',
    た: '\u3060',
    ち: '\u3062',
    つ: '\u3065',
    て: '\u3067',
    と: '\u3069',
    さ: '\u3056',
    し: '\u3058',
    す: '\u305a',
    せ: '\u305c',
    そ: '\u305e',
    は: '\u3070',
    ひ: '\u3073',
    ふ: '\u3076',
    へ: '\u3079',
    ほ: '\u307c',
    カ: '\u30ac',
    キ: '\u30ae',
    ク: '\u30b0',
    ケ: '\u30b2',
    コ: '\u30b4',
    タ: '\u30c0',
    チ: '\u30c2',
    ツ: '\u30c5',
    テ: '\u30c7',
    ト: '\u30c9',
    サ: '\u30b6',
    シ: '\u30b8',
    ス: '\u30ba',
    セ: '\u30bc',
    ソ: '\u30be',
    ハ: '\u30d0',
    ヒ: '\u30d3',
    フ: '\u30d6',
    ヘ: '\u30d9',
    ホ: '\u30dc'
  },
  '~': {
    // Tilde / Stroke
    a: '\u00e3',
    l: '\u0142',
    n: '\u00f1',
    o: '\u00f5',
    A: '\u00c3',
    L: '\u0141',
    N: '\u00d1',
    O: '\u00d5'
  },
  '^': {
    // Circumflex
    a: '\u00e2',
    e: '\u00ea',
    i: '\u00ee',
    o: '\u00f4',
    u: '\u00fb',
    w: '\u0175',
    y: '\u0177',
    A: '\u00c2',
    E: '\u00ca',
    I: '\u00ce',
    O: '\u00d4',
    U: '\u00db',
    W: '\u0174',
    Y: '\u0176'
  },
  ˇ: {
    // Baltic caron
    c: '\u010D',
    d: '\u010f',
    e: '\u011b',
    s: '\u0161',
    l: '\u013e',
    n: '\u0148',
    r: '\u0159',
    t: '\u0165',
    u: '\u01d4',
    z: '\u017E',
    ü: '\u01da',
    C: '\u010C',
    D: '\u010e',
    E: '\u011a',
    S: '\u0160',
    L: '\u013d',
    N: '\u0147',
    R: '\u0158',
    T: '\u0164',
    U: '\u01d3',
    Z: '\u017D',
    Ü: '\u01d9'
  },
  '\u02d8': {
    // Romanian and Turkish breve
    a: '\u0103',
    g: '\u011f',
    A: '\u0102',
    G: '\u011e'
  },
  '-': {
    // Macron
    a: '\u0101',
    e: '\u0113',
    i: '\u012b',
    o: '\u014d',
    u: '\u016B',
    y: '\u0233',
    ü: '\u01d6',
    A: '\u0100',
    E: '\u0112',
    I: '\u012a',
    O: '\u014c',
    U: '\u016A',
    Y: '\u0232',
    Ü: '\u01d5'
  },
  '`': {
    // Grave
    a: '\u00e0',
    e: '\u00e8',
    i: '\u00ec',
    o: '\u00f2',
    u: '\u00f9',
    ü: '\u01dc',
    A: '\u00c0',
    E: '\u00c8',
    I: '\u00cc',
    O: '\u00d2',
    U: '\u00d9',
    Ü: '\u01db'
  },
  "'": {
    // Acute / Greek Tonos
    a: '\u00e1',
    e: '\u00e9',
    i: '\u00ed',
    o: '\u00f3',
    u: '\u00fa',
    y: '\u00fd',
    α: '\u03ac',
    ε: '\u03ad',
    η: '\u03ae',
    ι: '\u03af',
    ο: '\u03cc',
    υ: '\u03cd',
    ω: '\u03ce',
    ü: '\u01d8',
    A: '\u00c1',
    E: '\u00c9',
    I: '\u00cd',
    O: '\u00d3',
    U: '\u00da',
    Y: '\u00dd',
    Α: '\u0386',
    Ε: '\u0388',
    Η: '\u0389',
    Ι: '\u038a',
    Ο: '\u038c',
    Υ: '\u038e',
    Ω: '\u038f',
    Ü: '\u01d7'
  },
  '\u02dd': {
    // Hungarian Double Acute Accent
    o: '\u0151',
    u: '\u0171',
    O: '\u0150',
    U: '\u0170'
  },
  '\u0385': {
    // Greek Dialytika + Tonos
    ι: '\u0390',
    υ: '\u03b0'
  },
  '\u00b0': {
    // Ring
    a: '\u00e5',
    u: '\u016f',
    A: '\u00c5',
    U: '\u016e'
  },
  '\u02DB': {
    // Ogonek
    a: '\u0106',
    e: '\u0119',
    i: '\u012f',
    o: '\u01eb',
    u: '\u0173',
    y: '\u0177',
    A: '\u0105',
    E: '\u0118',
    I: '\u012e',
    O: '\u01ea',
    U: '\u0172',
    Y: '\u0176'
  },
  '\u02D9': {
    // Dot-above
    c: '\u010B',
    e: '\u0117',
    g: '\u0121',
    z: '\u017C',
    C: '\u010A',
    E: '\u0116',
    G: '\u0120',
    Z: '\u017B'
  },
  '\u00B8': {
    // Cedilla
    c: '\u00e7',
    s: '\u015F',
    C: '\u00c7',
    S: '\u015E'
  },
  /*',': { // Comma
   's': (this.VKI_isIElt8) ? '\u015F' : '\u0219', 't': (this.VKI_isIElt8) ? '\u0163' : '\u021B',
   'S': (this.VKI_isIElt8) ? '\u015E' : '\u0218', 'T': (this.VKI_isIElt8) ? '\u0162' : '\u021A'
   },*/
  '\u3002': {
    // Hiragana/Katakana Point
    は: '\u3071',
    ひ: '\u3074',
    ふ: '\u3077',
    へ: '\u307a',
    ほ: '\u307d',
    ハ: '\u30d1',
    ヒ: '\u30d4',
    フ: '\u30d7',
    ヘ: '\u30da',
    ホ: '\u30dd'
  }
};

// aliases
// Macron
keyboardDeadkeys['\u00af'] = keyboardDeadkeys['-'];
// Umlaut / Diaeresis / Greek Dialytika / Hiragana/Katakana Voiced Sound Mark
keyboardDeadkeys['\u00a8'] = keyboardDeadkeys['\u309B'] = keyboardDeadkeys['"'];
// Acute / Greek Tonos
keyboardDeadkeys['\u00b4'] = keyboardDeadkeys['\u0384'] = keyboardDeadkeys["'"];
// Ring
keyboardDeadkeys['\u00ba'] = keyboardDeadkeys['\u00b0'];
keyboardDeadkeys['\u201a'] = keyboardDeadkeys['\u00B8'];
