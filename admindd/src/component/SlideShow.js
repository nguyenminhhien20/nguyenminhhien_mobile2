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

export const SlideShowList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <ImageField source="photo" title="Preview" />
      {/* Add more fields as needed */}
      <EditButton />
    </Datagrid>
  </List>
);

export const SlideShowEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <ImageInput source="file" label="Photo" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export const SlideShowCreate = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (data) => {
    notify(`created successfully`);
    redirect("list", "slideShows");
  };
  return (
    <Create {...props} mutationOptions={{ onSuccess }} redirect="slideShows">
      <SimpleForm>
        <TextInput source="title" />
        <ImageInput source="file" label="Photo" accept="image/*">
          <ImageField source="src" title="Preview" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};
