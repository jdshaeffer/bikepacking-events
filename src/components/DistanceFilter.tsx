import Dropdown from 'react-dropdown';

const options = ['100 mi', '250 mi', '500 mi', '1000 mi', '2000 mi'];

interface Props {
  callback: (distance: number) => void;
}

// TODO: assign value as a defaultOption prop to be passed in from local storage
// TODO: distance is optional (for non-ride events)
const DistanceFilter = ({ callback }: Props) => {
  return (
    <Dropdown
      options={options}
      onChange={(e) => callback(+e.value.split(' ')[0])}
      placeholder='select an option'
    />
  );
};

export default DistanceFilter;
