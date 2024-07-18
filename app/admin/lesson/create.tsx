import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  required,
} from "react-admin";

export const LessonCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <ReferenceInput source="unitId" reference="units" label="UnitId" />
      <NumberInput source="order" validate={[required()]} label="Order" />
    </SimpleForm>
  </Create>
);
