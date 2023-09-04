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
import { BikepackingEvent } from '../App';
import SortSymbol from './SortSymbol';
import '../App.css';

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
const LocationFilter = ({
  events,
  callback,
  sortCallback,
  refreshSort,
}: FilterProps) => {
  const [location, setLocation] = useState<string>();
  const [sortDir, setSortDir] = useState<string>('');

  const handleSortChange = (dir: string) => {
    sortCallback('location');
    setSortDir(dir);
  };

  const getLocation = (event: BikepackingEvent) => {
    return event.location.trim().toLocaleLowerCase();
  };

  useEffect(() => {
    let sortedEvents = events;
    if (sortDir) {
      sortedEvents = events.sort((eventA, eventB) => {
        const locA = getLocation(eventA);
        const locB = getLocation(eventB);
        if (sortDir === '⬆') {
          if (locA! < locB!) {
            return -1;
          } else if (locA! > locB!) {
            return 1;
          }
          return 0;
        } else {
          if (locA! > locB!) {
            return -1;
          } else if (locA! < locB!) {
            return 1;
          }
          return 0;
        }
      });
    }
    let filteredAndSortedEvents = sortedEvents;
    if (location) {
      filteredAndSortedEvents = filteredAndSortedEvents.filter((event) => {
        if (event.location) {
          const country = event.location
            .split(',')
            .pop()
            ?.trim()
            .toLocaleLowerCase();
          if (country) {
            if (location === 'us') {
              return country === 'united states';
            } else if (location === 'ca') {
              return country === 'canada';
            } else if (location === 'uk') {
              return country === 'united kingdom';
            } else if (location === 'sa') {
              return countriesSouthAmerica.has(country);
            } else if (location === 'eu') {
              return countriesEurope.has(country);
            } else if (location === 'af') {
              return countriesAfrica.has(country);
            } else if (location === 'as') {
              return countriesAsia.has(country);
            } else if (location === 'oc') {
              return countriesOceania.has(country);
            } else if (location === 'all') {
              return event;
            }
          }
        }
      });
    }
    callback(filteredAndSortedEvents);
  }, [location, events, sortDir]);

  useEffect(() => {
    setSortDir('');
  }, [refreshSort]);

  return (
    <div className='filter'>
      <p>
        location
        <SortSymbol
          defaultAsc={false}
          callback={(dir) => handleSortChange(dir)}
          refresh={refreshSort}
        />
      </p>
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
