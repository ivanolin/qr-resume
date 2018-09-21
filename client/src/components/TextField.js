import React from 'react'
import {Form} from 'semantic-ui-react';

export default ({
  input: { name, onChange, value, ...restInput },
  meta,
  ...rest
}) => (
  <Form.Input
    {...rest}
    name={name}
    error={meta.error && meta.touched}
    onChange={onChange}
    value={value}
  />
)
