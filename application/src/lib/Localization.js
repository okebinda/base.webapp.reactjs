import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import Logger from './Logger';
import Config from '../Config';

// get default language from config
export const defaultLang = Config.get('LANGUAGES') ? Config.get('LANGUAGES')[0] : null;
Logger.log('debug', `i18n defaultLang: ${defaultLang}`);

// get langauge from URL if available
const pathSplit = typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
export const lang = Config.get('LANGUAGES') && Config.get('LANGUAGES').includes(pathSplit[1])
  ? pathSplit[1]
  : defaultLang;
Logger.log('debug', `i18n lang: ${lang}`);

// load translations
const translations = require(`../i18n/${lang}.json`);

// initialize i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: false,
    resources: translations,
    lng: lang, //'en-US',
    ns: ['translation'],
    defaultNS: 'translation',
    fallbackLng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;

Logger.log('silly', `Localization loaded.`);
