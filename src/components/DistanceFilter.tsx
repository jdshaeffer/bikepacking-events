import Select from 'react-select';

const options = [
  { value: 100, label: '100 mi' },
  { value: 250, label: '250 mi' },
  { value: 500, label: '500 mi' },
  { value: 1000, label: '1000 mi' },
  { value: 2000, label: '2000 mi' },
];

interface Props {
  callback: (distance: number) => void;
}

// TODO: assign value as a defaultOption prop to be passed in from local storage
// TODO: distance is optional (for non-ride events)
// TODO: move filter state to this component...
const DistanceFilter = ({ callback }: Props) => {
  return (
    <Select
      options={options}
      onChange={(e) => callback(e!.value)}
      placeholder='select...'
      noOptionsMessage={() => 'no options'}
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: '#282c34',
          border: '2px solid white',
          color: 'white',
          width: '15vw',
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: '#282c34',
          border: '2px solid white',
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          backgroundColor: isSelected || isFocused ? '#373c47' : undefined,
        }),
        singleValue: (base) => ({
          ...base,
          color: 'white',
        }),
        placeholder: (base) => ({
          ...base,
          color: 'white',
        }),
      }}
    />
  );
};

export default DistanceFilter;
