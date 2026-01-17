import React from "react";
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  EditButton,
  TextInput,
  NumberInput,
  Create,
  ReferenceInput,
  SelectInput,
  ImageField,
  ImageInput,
  useRedirect,
  useNotify,
} from "react-admin";

export const listProduct = (props) => (
  <List {...props}>
    <Datagrid style={{ overflowX: "auto" }}>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="price" />
      <TextField source="category.title" />
      <ImageField source="photo" title="Preview" />
      <EditButton />
    </Datagrid>
  </List>
);

export const EditProduct = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="title" />
        <TextInput source="description" />
        <NumberInput source="price" />
        <ReferenceInput
          label="Category"
          source="category.id"
          reference="categories"
        >
          <SelectInput optionText="title" />
        </ReferenceInput>
        <ImageInput source="file" label="Photo" accept="image/*">
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </Edit>
  );
};

export const CreateProduct = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (data) => {
    notify(`created successfully`);
    redirect("list", "products");
  };
  return (
    <Create {...props} mutationOptions={{ onSuccess }} redirect="products">
      <SimpleForm>
        <TextInput source="title" />
        <TextInput source="description" />
        <NumberInput source="price" />
        <ReferenceInput
          label="category"
          source="categoryId"
          reference="categories"
        >
          <SelectInput optionText="title" />
        </ReferenceInput>
        <ImageInput source="file" label="Photo" accept="image/*">
          <ImageField source="src" title="Preview" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};
