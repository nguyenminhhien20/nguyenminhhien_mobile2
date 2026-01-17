import React from "react";
import { Admin, Resource } from "react-admin";
import AdminPanel from "./component/AdminPanel";
import {
  listCategory,
  editCategory,
  CreateCategory,
} from "./component/Category";

import {
  SlideShowList,
  SlideShowEdit,
  SlideShowCreate,
} from "./component/SlideShow";

import { listUser, editUser, CreateUser } from "./component/Users";
import { listProduct, EditProduct, CreateProduct } from "./component/Products";
import { listOrder, EditOrder, CreateOrder } from "./component/Order";
import { listOrderDetail } from "./component/OrderDetail";
import { listCart } from "./component/Cart";

import dataProvider from "./component/customDataProvider";
import { listCartDetail } from "./component/CartDetail";

const App = () => (
  <Admin dashboard={AdminPanel} dataProvider={dataProvider}>
    <Resource
      name="users"
      list={listUser}
      edit={editUser}
      create={CreateUser}
    />
    <Resource
      name="categories"
      list={listCategory}
      edit={editCategory}
      create={CreateCategory}
    />
    <Resource
      name="products"
      list={listProduct}
      edit={EditProduct}
      create={CreateProduct}
    />
    <Resource
      name="slideShows"
      list={SlideShowList}
      edit={SlideShowEdit}
      create={SlideShowCreate}
    />
    <Resource
      name="orders"
      list={listOrder}
      edit={EditOrder}
      create={CreateOrder}
    />
    <Resource name="orderDetails" list={listOrderDetail} />
    <Resource name="carts" list={listCart} />
    <Resource name="cartDetails" list={listCartDetail} />
  </Admin>
);

export default App;
