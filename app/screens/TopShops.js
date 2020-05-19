import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import ListTopShops from "../components/Ranking/ListTopShops";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function TopShops(props) {
  const { navigation } = props;
  const [shops, setShops] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    db.collection("shops")
      .orderBy("rating", "desc")
      .limit(5)
      .get()
      .then((response) => {
        const shopArray = [];
        response.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          shopArray.push(data);
        });
        setShops(shopArray);
      });
  }, []);

  return (
    <View>
      <ListTopShops shops={shops} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
}
