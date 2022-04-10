import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

/**
 * A wrapper around {@link TextField} to automatically enter an errored state if an error is present
 */
function FormField({ onChange, name, errors, ...rest }: FormFieldProps) {
  return (
    <TextField
      {...rest}
      name={name}
      error={!!errors?.[name]}
      helperText={errors?.[name]}
      variant='outlined'
      margin='normal'
      required
      fullWidth
      onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
        onChange && onChange(event.target.value)
      }
    />
  );
}

type FormFieldProps<T extends string = string> = Omit<TextFieldProps, 'onChange'> & {
  onChange?: (value: string) => void;
  name: T;
  errors?: Record<string | T, string>;
};

export default FormField;
