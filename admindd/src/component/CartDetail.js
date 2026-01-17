import React from "react";
import { List, Datagrid, TextField } from "react-admin";

export const listCartDetail = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="product.title" />
      <TextField source="cart.id" />
    </Datagrid>
  </List>
);

// export const EditCart = (props) => (
//   <Edit {...props}>
//     <SimpleForm>
//       <TextInput disabled source="id" />
//       <DateInput source="date" />
//       <ReferenceInput label="User" source="user.id" reference="users">
//         <SelectInput optionText="username" />
//       </ReferenceInput>
//     </SimpleForm>
//   </Edit>
// );

// export const CreateCart = (props) => {
//   const notify = useNotify();
//   const redirect = useRedirect();

//   const onSuccess = (data) => {
//     notify(`created successfully`);
//     redirect("list", "orders");
//   };
//   return (
//     <Create {...props} mutationOptions={{ onSuccess }} redirect="orders">
//       <SimpleForm>
//         <TextInput source="id" disabled />
//         <DateInput source="date" />
//         <ReferenceInput label="User" source="user.id" reference="users">
//           <SelectInput optionText="username" />
//         </ReferenceInput>
//       </SimpleForm>
//     </Create>
//   );
// };
