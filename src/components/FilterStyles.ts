import { StylesConfig } from 'react-select';

const filterStyles: StylesConfig = {
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
  input: (base) => ({
    ...base,
    color: 'white',
  }),
};

export default filterStyles;
