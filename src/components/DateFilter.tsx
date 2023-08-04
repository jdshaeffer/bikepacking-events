import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Props } from './Props';
import filterStyles from './FilterStyles';

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

// TODO: assign value as a defaultOption prop to be passed in from local storage
const DateFilter = ({ events, callback }: Props) => {
  const [month, setMonth] = useState<string>();

  useEffect(() => {
    if (month) {
      const filteredEvents = events.filter((event) => {
        if (event.date) {
          const m = event.date.split(' ')[0].toLocaleLowerCase();
          return month === m.slice(0, 3) || month === 'all';
        }
      });
      callback(filteredEvents);
    }
  }, [month]);

  return (
    <Select
      options={options}
      onChange={(e: any) => setMonth(e.value)}
      placeholder='select...'
      noOptionsMessage={() => 'no options'}
      styles={filterStyles}
    />
  );
};

export default DateFilter;
