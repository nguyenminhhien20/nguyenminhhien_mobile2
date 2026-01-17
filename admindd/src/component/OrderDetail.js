import React from "react";
import { List, Datagrid, TextField } from "react-admin";

export const listOrderDetail = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="order.id" />
      <TextField source="product.title" />
      <TextField source="quantity" />
      {/* <EditButton /> */}
    </Datagrid>
  </List>
);

// export const EditOrderDetail = (props) => (
//   <Edit {...props}>
//     <SimpleForm>
//       <TextInput disabled source="id" />
//       <TextField source="order.id" />
//       <TextInput source="product.title" />
//       <TextInput source="quantity" />
//       <ReferenceInput label="User" source="user.id" reference="users">
//         <SelectInput optionText="username" />
//       </ReferenceInput>
//     </SimpleForm>
//   </Edit>
// );

// export const CreateOrderDetail = (props) => {
//   const notify = useNotify();
//   const redirect = useRedirect();

//   const onSuccess = (data) => {
//     notify(`created successfully`);
//     redirect("list", "OrderDetails");
//   };
//   return (
//     <Create {...props} mutationOptions={{ onSuccess }} redirect="OrderDetails">
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
