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

// ... Các components khác

export const listCategory = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <ImageField source="photo" title="Preview" />
      <EditButton />
    </Datagrid>
  </List>
);

// Edit component for User
export const editCategory = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="description" />
      <ImageInput source="file" label="Photo" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

// Create component for User
export const CreateCategory = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (data) => {
    notify(`created successfully`);
    redirect("list", "categories");
  };
  return (
    <Create {...props} mutationOptions={{ onSuccess }} redirect="categories">
      <SimpleForm>
        <TextInput source="title" />
        <TextInput source="description" />
        <ImageInput source="file" label="Photo" accept="image/*">
          <ImageField source="src" title="Preview" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};
