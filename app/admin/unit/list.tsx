import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  NumberInput,
} from "react-admin";

export const UnitList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberInput source="id" label="ID" />
        <TextField source="title" label="Title" />
        <TextField source="description" label="Description" />
        <ReferenceField source="courseId" reference="courses" label="Course" />
        <NumberInput source="order" label="Order" />
      </Datagrid>
    </List>
  );
};
