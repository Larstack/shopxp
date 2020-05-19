import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListShops from "../../components/Shops/ListShops";

const db = firebase.firestore(firebaseApp);

export default function Shops(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [shops, setShops] = useState([]);
  const [totalShops, setTotalShops] = useState(0);
  const [startShops, setStartShops] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const limitShops = 10;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.collection("shops")
        .get()
        .then((snap) => {
          setTotalShops(snap.size);
        });

      const resultShops = [];

      db.collection("shops")
        .orderBy("createAt", "desc")
        .limit(limitShops)
        .get()
        .then((response) => {
          setStartShops(response.docs[response.docs.length - 1]);

          response.forEach((doc) => {
            const shop = doc.data();
            shop.id = doc.id;
            resultShops.push(shop);
          });
          setShops(resultShops);
        });
    }, [])
  );

  const handleLoadMore = () => {
    const resultShops = [];
    shops.length < totalShops && setIsLoading(true);

    db.collection("shops")
      .orderBy("createAt", "desc")
      .startAfter(startShops.data().createAt)
      .limit(limitShops)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartShops(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }

        response.forEach((doc) => {
          const shop = doc.data();
          shop.id = doc.id;
          resultShops.push(shop);
        });

        setShops([...shops, ...resultShops]);
      });
  };

  return (
    <View style={styles.viewBody}>
      <ListShops
        shops={shops}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
      />

      {user && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color="#F44336"
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("add-shop")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
