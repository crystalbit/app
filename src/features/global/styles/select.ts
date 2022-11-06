export const customStylesSelect = {
  control: (base: any, state: { isFocused: boolean }) => ({
    ...base,
    cursor: 'pointer',
    background: '#2e2e34',
    borderColor: state.isFocused ? '#fff' : '#2a292c',
    boxShadow: state.isFocused ? null : null,
    width: '100%',
    '&:hover': {
      borderColor: state.isFocused ? '#34ff61' : '#fff'
    }
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#fff'
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#fff'
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    '&:hover': {
      color: '#fff'
    }
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: '#fff',
    '&:hover': {
      color: '#fff'
    }
  }),
  clearIndicator: (base: any) => ({
    ...base,
    color: '#fff',
    '&:hover': {
      color: '#fff'
    }
  }),
  menu: (base: any) => ({
    ...base,
    color: '#fff',
    backgroundColor: '#2a292c',
    width: '300px'
  }),
  option: (base: any) => ({
    ...base,
    margin: '0',
    border: '0',
    '&:hover': {
      color: '#000'
    }
  })
};
