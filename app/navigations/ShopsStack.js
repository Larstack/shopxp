import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Shops from "../screens/Shops/Shops";
import AddShop from "../screens/Shops/AddShop";
import Shop from "../screens/Shops/Shop";
import AddReviewShop from "../screens/Shops/AddReviewShop";

const Stack = createStackNavigator();

export default function ShopsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="shops"
        component={Shops}
        options={{ title: "Shops" }}
      />
      <Stack.Screen
        name="add-shop"
        component={AddShop}
        options={{ title: "Añadir nuevo shop" }}
      />
      <Stack.Screen name="shop" component={Shop} />
      <Stack.Screen
        name="add-review-shop"
        component={AddReviewShop}
        options={{ title: "Nuevo comentario" }}
      />
    </Stack.Navigator>
  );
}
