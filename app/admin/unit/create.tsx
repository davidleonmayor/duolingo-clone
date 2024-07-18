import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  required,
  ReferenceInput,
} from "react-admin";

export const UnitCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="title" />
        <TextInput
          source="description"
          validate={[required()]}
          label="Description"
        />
        <ReferenceInput
          source="courseId"
          reference="courses"
          label="Course Id"
          min={1}
        />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Create>
  );
};
