import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  NumberInput,
} from "react-admin";

export const LessonEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <NumberInput label="Id" source="id" validate={required()} />
        <TextInput label="Title" source="title" validate={required()} />
        <NumberInput
          source="unitId"
          validate={[required()]}
          label="unitId"
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
