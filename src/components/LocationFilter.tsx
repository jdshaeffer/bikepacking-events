import { useEffect, useState } from 'react';
import Select from 'react-select';
import { FilterProps } from './FilterProps';
import {
  countriesAfrica,
  countriesAsia,
  countriesEurope,
  countriesOceania,
  countriesSouthAmerica,
} from './countries';
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

// TODO: assign value as a defaultOption prop to be passed in from local storage
const LocationFilter = ({ events, callback }: FilterProps) => {
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
  }, [location, events]);

  return (
    <div className='filter'>
      <p className='sort-title'>location</p>
      <Select
        options={options}
        onChange={(e: any) => setLocation(e.value)}
        placeholder='select...'
        noOptionsMessage={() => 'no options'}
        styles={filterStyles}
      />
    </div>
  );
};

export default LocationFilter;
