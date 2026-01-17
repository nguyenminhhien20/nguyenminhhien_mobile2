import React from "react";
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  DateInput,
  ReferenceInput,
  SelectInput,
  useNotify,
  useRedirect,
  EditButton,
} from "react-admin";

export const listOrder = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="user.username" />
      <TextField source="date" />
      <EditButton />
    </Datagrid>
  </List>
);

export const EditOrder = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <DateInput source="date" />
      <ReferenceInput label="User" source="user.id" reference="users">
        <SelectInput optionText="username" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export const CreateOrder = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (data) => {
    notify(`created successfully`);
    redirect("list", "orders");
  };
  return (
    <Create {...props} mutationOptions={{ onSuccess }} redirect="orders">
      <SimpleForm>
        <TextInput source="id" disabled />
        <DateInput source="date" />
        <ReferenceInput label="User" source="user.id" reference="users">
          <SelectInput optionText="username" />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
