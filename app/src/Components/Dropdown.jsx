import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { NewContactContext } from '../context';

export function Dropdown({ label }) {
  const [str, setStr] = React.useState('');

  const {newContactList, setNewContact} = React.useContext(NewContactContext)

  const handleChange = (event) => {
    setStr(event.target.value);
    setNewContact(event.target.value)
  };

  return (
    <FormControl fullWidth  >
      <InputLabel>{label}</InputLabel>
      <Select
        value={str}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {newContactList.map(val => <MenuItem value={val} >{val}</MenuItem>)}
      </Select>
    </FormControl>
  );
}