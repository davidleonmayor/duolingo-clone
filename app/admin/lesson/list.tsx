import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
} from "react-admin";

export const LessonList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" label="ID" />
        <TextField source="title" label="Title" />
        <ReferenceField source="unitId" reference="units" label="Unit" />
        <NumberField source="order" label="Order" />
      </Datagrid>
    </List>
  );
};
