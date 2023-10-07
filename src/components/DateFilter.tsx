import { useEffect, useState } from 'react';
import Select from 'react-select';
import { BikepackingEvent } from '../App';
import { FilterProps } from './FilterProps';
import filterStyles from './FilterStyles';
import SortSymbol from './SortSymbol';

const options = [
  { value: 'all', label: '(all months)' },
  { value: 'jan', label: 'january' },
  { value: 'feb', label: 'february' },
  { value: 'mar', label: 'march' },
  { value: 'apr', label: 'april' },
  { value: 'may', label: 'may' },
  { value: 'jun', label: 'june' },
  { value: 'jul', label: 'july' },
  { value: 'aug', label: 'august' },
  { value: 'sep', label: 'september' },
  { value: 'oct', label: 'october' },
  { value: 'nov', label: 'november' },
  { value: 'dec', label: 'december' },
];

const thisYear = new Date().getFullYear();

// TODO: assign value as a defaultOption prop to be passed in from local storage
const DateFilter = ({
  events,
  callback,
  sortCallback,
  refreshSort,
}: FilterProps) => {
  const [month, setMonth] = useState<string>();
  const [sortDir, setSortDir] = useState<string>('');

  const handleSortChange = (dir: string) => {
    sortCallback('date');
    setSortDir(dir);
  };

  const getParsedDateFromString = (date: string) => {
    const dateList = date.split(' ');
    const month = dateList[0];
    const day = +dateList[1].split(',')[0];
    let yearStr = dateList[2];
    let year = +yearStr;
    if (yearStr === '@') {
      year = thisYear;
    }
    const ampm = dateList.pop();
    let hours = dateList.pop()!.split(':')[0];
    if (hours === '12') {
      hours = '00';
    }
    if (ampm === 'pm') {
      //@ts-ignore
      hours = parseInt(hours, 10) + 12;
    }
    const dateString = `${year}/${month}/${day} ${hours}:00:00`;
    console.log(dateString);
    return new Date(dateString);
  };

  const getDate = (event: BikepackingEvent) => {
    const d = getParsedDateFromString(event.date);
    if (d.getFullYear() === 2001) {
      d.setFullYear(thisYear);
    }
    console.log('event title:', event.title);
    console.log('event date:', event.date);
    console.log('d:', d);
    return d;
  };

  useEffect(() => {
    let sortedEvents = events;
    if (sortDir) {
      sortedEvents = events.sort((eventA, eventB) => {
        const dateA = getDate(eventA);
        const dateB = getDate(eventB);
        if (sortDir === '⬆') {
          return +dateA - +dateB;
        } else {
          return +dateB - +dateA;
        }
      });
    }
    let filteredAndSortedEvents = sortedEvents;
    if (month) {
      filteredAndSortedEvents = filteredAndSortedEvents.filter((event) => {
        if (event.date) {
          const m = event.date.split(' ')[0].toLocaleLowerCase();
          return month === m.slice(0, 3) || month === 'all';
        }
        return null;
      });
    }
    callback(filteredAndSortedEvents);
  }, [month, events, sortDir]);

  useEffect(() => {
    setSortDir('');
  }, [refreshSort]);

  return (
    <div className='filter'>
      <p>
        month
        <SortSymbol
          defaultAsc
          callback={(dir) => handleSortChange(dir)}
          refresh={refreshSort}
        />
      </p>
      <Select
        options={options}
        onChange={(e: any) => setMonth(e.value)}
        placeholder='select...'
        noOptionsMessage={() => 'no options'}
        styles={filterStyles}
      />
    </div>
  );
};

export default DateFilter;
