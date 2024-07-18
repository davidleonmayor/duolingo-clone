import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  NumberInput,
} from "react-admin";

export const UnitEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <NumberInput label="Id" source="id" validate={required()} />
        <TextInput label="Title" source="title" validate={required()} />
        <TextInput
          label="Description"
          source="description"
          validate={required()}
        />
        <NumberInput
          source="courseId"
          validate={[required()]}
          label="Course Id"
          min={1}
        />
        <NumberInput
          label="Order"
          source="order"
          validate={required()}
          min={1}
        />
      </SimpleForm>
    </Edit>
  );
};
