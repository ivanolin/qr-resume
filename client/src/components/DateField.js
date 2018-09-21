import React from 'react'
import { Form } from 'semantic-ui-react';

const years = [
  { text: '2018', value: 2018 },
  { text: '2019', value: 2019 },
  { text: '2020', value: 2020 },
  { text: '2021', value: 2021 },
  { text: '2022', value: 2022 },
]

const semesters = [
  { text: 'Spring', value: 'Spring' },
  { text: 'Summer', value: 'Summer' },
  { text: 'Fall', value: 'Fall' },
  { text: 'Winter', value: 'Winter' },
]

export default ({
  input: { name, onChange, value},
  meta,
  type,
  ...rest
}) => (
  <Form.Select
    {...rest}
    
    name={name}
    onChange={(_, data) => onChange(data.value)}
    value={value}
    error={meta.error && meta.touched}
    options={type === "month" ? semesters : years}
  />
)