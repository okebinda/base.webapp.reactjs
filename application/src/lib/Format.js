import formatNum from 'format-num';
import formatCurrency from 'format-currency';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import Logger from './Logger';
import Config from '../Config';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// default formatting options
const options = {
  number: {fractionDigits: 0},
  currency: {format: '%s%v', symbol: '$'},
  percent: {style: 'percent', fractionDigits: 2},
  date: {format: Config.get('DEFAULT_DATE_FORMAT', 'mm/dd/yyyy')}
};

const reISO8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{4}$/;

dayjs.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: 'a few seconds',
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
});

const _truncateNumbers = function(num, digits) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "K" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "B" },
    { value: 1E12, symbol: "T" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

const Format = {

  // format number
  number: function(value, fractionDigits, truncate=false) {
    Logger.log('debug', `Format.number(${value}, ${fractionDigits})`);
    const opts = {
      maximumFractionDigits: Number.isInteger(fractionDigits)
        ? fractionDigits
        : options.number.fractionDigits,
      minimumFractionDigits: Number.isInteger(fractionDigits)
        ? fractionDigits
        : options.number.fractionDigits
    };
    return truncate ? _truncateNumbers(value, fractionDigits) : formatNum(value, opts);
  },

  // format currency
  currency: function(value, truncate=false) {
    Logger.log('debug', `Format.currency(${value})`);
    return truncate ? options.currency.symbol + _truncateNumbers(value, 1) : formatCurrency(value, options.currency);
  },

  // format percent
  percent: function(value, fractionDigits) {
    Logger.log('debug', `Format.percent(${value}, ${fractionDigits})`);
    const opts = {
      style: options.percent.style,
      maximumFractionDigits: Number.isInteger(fractionDigits)
        ? fractionDigits
        : options.percent.fractionDigits,
      minimumFractionDigits: Number.isInteger(fractionDigits)
        ? fractionDigits
        : options.percent.fractionDigits
    };
    return formatNum(value * 100, opts) + '%';
  },

  // format date
  date: function(value, formatIn, utc=false) {
    Logger.log('debug', `Format.date(${value}, ${formatIn})`);
    if (value) {
      const format = formatIn ? formatIn : options.date.format;
      return typeof value === 'string' && reISO8601.test(value)
        ? dayjs(value, 'YYYY-MM-DDTHH:mm:ssZZ').format(format) // safari hack - doesn't support '-', only '/'
        : dayjs(value).format(format);
    }
    return null;
  },

  // format date relative from now
  relativeDate: function(value, removeAgo=false) {
    Logger.log('debug', `Format.relativeDate(${value})`);
    if (value) {
      return typeof value === 'string' && reISO8601.test(value)
        ? dayjs(value, 'YYYY-MM-DDTHH:mm:ssZZ').fromNow(removeAgo) // safari hack - doesn't support '-', only '/'
        : dayjs(value).fromNow(removeAgo);
    }
    return null;
  },

  // format telephone number
  telephone: function(value) {
    let output = value
    const allDigitsValue = value.replace(/\D/g, '');
    if (allDigitsValue.length === 10) {
      output = allDigitsValue.substring(0, 3) + '-' + allDigitsValue.substring(3, 6) + '-' + allDigitsValue.substring(6);
    }
    else if (allDigitsValue.length === 7) {
      output = allDigitsValue.substring(0, 3) + '-' + allDigitsValue.substring(3);
    }
    return output;
  },

  // truncate string
  truncate: function(value, len, extra='...') {
    if (typeof value === 'string' && value.length > len) {
      return value.substring(0, len) + extra;
    }
    return value;
  },

  // strip tags from string
  stripTags: function(value) {
    return value.replace(/<\/?[^>]+(>|$)/g, "");
  }
}

export default Format;

Logger.log('silly', `Format loaded.`);
