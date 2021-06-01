import React from 'react'
// import { useAuth } from '../auth/useAuth'
import { Col, Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

const AvailabilityForm = ({ fieldData, submit }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();
    console.log(data);
    await submit(data);
  }

  const inputs = fieldData.map(d => {
    return (
      <Form.Row key={d.key}>
        <Form.Group as={Col} >
          <Form.Label>{d.label}</Form.Label>
          { d.key === 'location' ? <div>Test</div> : 
            <Form.Control
              {...register(d.key, { ...d.rules })}
              size="lg"
              name={d.key}
              type={d.type}
              placeholder={d.placeholder}
            />
          }
          { errors[d.key] && (
            <Form.Text className="text-warning">{errors[d.key].message}</Form.Text>
          )}
            {d.subtext.map(d => {
              return <Form.Text key={d} className="text-muted">{d}</Form.Text>
            })
          }
        </Form.Group>
      </Form.Row>
  )});

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {inputs}
      <Form.Row>
        <Form.Group as={Col} className="d-flex">
          <Button type="submit" disabled={isSubmitting}
            size="lg" variant="ultra-blue" className="flex-grow-1">
            {'Add Availability'}</Button>
        </Form.Group>
      </Form.Row>
    </Form>
  );
}

export default AvailabilityForm;
