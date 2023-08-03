import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Props } from './Props';
import filterStyles from './FilterStyles';

const options = [
  { value: 'all', label: '(all locations)' },
  { value: 'us', label: 'united states' },
  { value: 'ca', label: 'canada' },
  { value: 'sa', label: 'south america' },
  { value: 'uk', label: 'united kingdom' },
  { value: 'eu', label: 'europe' },
  { value: 'af', label: 'africa' },
  { value: 'as', label: 'asia' },
  { value: 'oc', label: 'oceania' },
];

const countriesSouthAmerica = new Set([
  'brazil',
  'colombia',
  'argentina',
  'peru',
  'venezuela',
  'chile',
  'ecuador',
  'bolivia',
  'paraguay',
  'uruguay',
  'guyana',
  'suriname',
  'french guiana',
  'falkland islands',
]);

const countriesAfrica = new Set([
  'nigeria',
  'ethiopia',
  'egypt',
  'dr congo',
  'tanzania',
  'south africa',
  'kenya',
  'uganda',
  'sudan',
  'algeria',
  'morocco',
  'angola',
  'ghana',
  'mozambique',
  'madagascar',
  `côte d'ivoire`,
  'cameroon',
  'niger',
  'mali',
  'burkina faso',
  'malawi',
  'zambia',
  'chad',
  'somalia',
  'senegal',
  'zimbabwe',
  'guinea',
  'rwanda',
  'benin',
  'burundi',
  'tunisia',
  'south sudan',
  'togo',
  'sierra leone',
  'libya',
  'congo',
  'central african republic',
  'liberia',
  'mauritania',
  'eritrea',
  'gambia',
  'botswana',
  'namibia',
  'gabon',
  'lesotho',
  'guinea-bissau',
  'equatorial guinea',
  'mauritius',
  'eswatini',
  'djibouti',
  'comoros',
  'cabo verde',
  'sao tome and principe',
  'seychelles',
]);

const countriesOceania = new Set([
  'australia',
  'papua new guinea',
  'new zealand',
  'fiji',
  'solomon islands',
  'micronesia',
  'vanuatu',
  'samoa',
  'kiribati',
  'tonga',
  'marshall islands',
  'palau',
  'nauru',
  'tuvalu',
]);

const countriesAsia = new Set([
  'india',
  'china',
  'indonesia',
  'pakistan',
  'bangladesh',
  'japan',
  'philippines',
  'vietnam',
  'iran',
  'turkey',
  'thailand',
  'myanmar',
  'south korea',
  'iraq',
  'afghanistan',
  'saudi arabia',
  'uzbekistan',
  'yemen',
  'malaysia',
  'nepal',
  'north korea',
  'syria',
  'sri lanka',
  'kazakhstan',
  'cambodia',
  'jordan',
  'azerbaijan',
  'tajikistan',
  'united arab emirates',
  'israel',
  'laos',
  'kyrgyzstan',
  'turkmenistan',
  'singapore',
  'state of palestine',
  'lebanon',
  'oman',
  'kuwait',
  'georgia',
  'mongolia',
  'armenia',
  'qatar',
  'bahrain',
  'timor-leste',
  'cyprus',
  'bhutan',
  'maldives',
  'brunei',
]);

const countriesEurope = new Set([
  'russia',
  'germany',
  'france',
  'italy',
  'spain',
  'poland',
  'ukraine',
  'romania',
  'netherlands',
  'belgium',
  'sweden',
  'czech republic',
  'greece',
  'portugal',
  'hungary',
  'belarus',
  'austria',
  'switzerland',
  'serbia',
  'bulgaria',
  'denmark',
  'slovakia (slovak republic)',
  'finland',
  'norway',
  'ireland',
  'croatia',
  'moldova',
  'bosnia and herzegovina',
  'albania',
  'lithuania',
  'slovenia',
  'north macedonia',
  'latvia',
  'estonia',
  'luxembourg',
  'montenegro',
  'malta',
  'iceland',
  'andorra',
  'liechtenstein',
  'monaco',
  'san marino',
]);

// TODO: assign value as a defaultOption prop to be passed in from local storage
const LocationFilter = ({ events, callback }: Props) => {
  const [location, setLocation] = useState<string>();

  useEffect(() => {
    if (location) {
      const filteredEvents = events.filter((event) => {
        if (event.location) {
          const l = event.location.split(',').pop()?.trim().toLocaleLowerCase();
          if (l) {
            if (location === 'us') {
              return l === 'united states';
            } else if (location === 'ca') {
              return l === 'canada';
            } else if (location === 'uk') {
              return l === 'united kingdom';
            } else if (location === 'sa') {
              return countriesSouthAmerica.has(l);
            } else if (location === 'eu') {
              return countriesEurope.has(l);
            } else if (location === 'af') {
              return countriesAfrica.has(l);
            } else if (location === 'as') {
              return countriesAsia.has(l);
            } else if (location === 'oc') {
              return countriesOceania.has(l);
            } else if (location === 'all') {
              return event;
            }
          }
        }
      });
      callback(filteredEvents);
    }
  }, [location]);

  return (
    <Select
      options={options}
      onChange={(e: any) => setLocation(e.value)}
      placeholder='select...'
      noOptionsMessage={() => 'no options'}
      styles={filterStyles}
    />
  );
};

export default LocationFilter;
