// Import necessary components from react-admin
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  EditButton,
  TextInput,
  Create,
  ImageField,
  ImageInput,
  useRedirect,
  useNotify,
} from "react-admin";

// List component for User
export const listUser = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="numphone" label="Phone Number" />
      <TextField source="pass" label="Password" />
      <TextField source="email" />
      {/* <ImageField source="photo" title="Photo" /> */}
      <EditButton />
    </Datagrid>
  </List>
);
// Edit component for User
export const editUser = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="username" label="Username" />
      <TextInput source="pass" label="Password" />
      <TextInput source="numphone" label="Phone Number" />
      <TextInput source="email" label="Email" />
      <ImageInput source="file" label="Photo" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

// Create component for User
export const CreateUser = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (data) => {
    notify(`created successfully`);
    redirect("list", "users");
  };
  return (
    <Create {...props} mutationOptions={{ onSuccess }} redirect="users">
      <SimpleForm>
        <TextInput source="username" label="Username" />
        <TextInput source="pass" label="Password" />
        <TextInput source="numphone" label="Phone Number" />
        <TextInput source="email" label="Email" />
        <ImageInput source="file" label="Photo" accept="image/*">
          <ImageField source="src" title="Preview" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};
