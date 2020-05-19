import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import Loading from "../components/Loading";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
  const { navigation } = props;
  const [shops, setShops] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      if (userLogged) {
        const idUser = firebase.auth().currentUser.uid;
        db.collection("favorites")
          .where("idUser", "==", idUser)
          .get()
          .then((response) => {
            const idShopsArray = [];
            response.forEach((doc) => {
              idShopsArray.push(doc.data().idShop);
            });
            getDataShop(idShopsArray).then((response) => {
              const shops = [];
              response.forEach((doc) => {
                const shop = doc.data();
                shop.id = doc.id;
                shops.push(shop);
              });
              setShops(shops);
            });
          });
      }
      setReloadData(false);
    }, [userLogged, reloadData])
  );

  const getDataShop = (idShopsArray) => {
    const arrayShops = [];
    idShopsArray.forEach((idShop) => {
      const result = db.collection("shops").doc(idShop).get();
      arrayShops.push(result);
    });
    return Promise.all(arrayShops);
  };

  if (!userLogged) {
    return <UserNoLogged navigation={navigation} />;
  }

  if (shops?.length === 0) {
    return <NotFoundShops />;
  }

  return (
    <View style={styles.viewBody}>
      {shops ? (
        <FlatList
          data={shops}
          renderItem={(shop) => (
            <Shop
              shop={shop}
              setIsLoading={setIsLoading}
              toastRef={toastRef}
              setReloadData={setReloadData}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderShops}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center" }}>Cargando shops</Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading text="Eliminando shop" isVisible={isLoading} />
    </View>
  );
}

function NotFoundShops() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon
        type="material-community"
        name="alert-outline"
        size={50}
        color="grey"
      />
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "grey" }}>
        No tienes shops en tu lista
      </Text>
    </View>
  );
}

function UserNoLogged(props) {
  const { navigation } = props;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon
        type="material-community"
        name="alert-outline"
        size={50}
        color="grey"
      />
      <Text
        style={{
          fontSize: 20,
          color: "grey",
          textAlign: "center",
        }}
      >
        Realiza el login para ver esta sección!
      </Text>
      <Button
        title="Ir al login"
        containerStyle={{ marginTop: 20, width: "80%" }}
        buttonStyle={{ backgroundColor: "#F44336" }}
        onPress={() => navigation.navigate("account", { screen: "login" })}
      />
    </View>
  );
}

function Shop(props) {
  const { shop, setIsLoading, toastRef, setReloadData, navigation } = props;
  const { id, name, images } = shop.item;

  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar Shop de Favoritos",
      "¿Estas seguro de que quieres eliminar el shop de favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: removeFavorite,
        },
      ],
      { cancelable: false }
    );
  };

  const removeFavorite = () => {
    setIsLoading(true);
    db.collection("favorites")
      .where("idShop", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsLoading(false);
              setReloadData(true);
              toastRef.current.show("Shop eliminado correctamente");
            })
            .catch(() => {
              setIsLoading(false);
              toastRef.current.show("Error al eliminar el shop");
            });
        });
      });
  };

  return (
    <View style={styles.shop}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("shops", {
            screen: "shop",
            params: { id },
          })
        }
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={
            images[0]
              ? { uri: images[0] }
              : require("../../assets/img/no-image.png")
          }
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Icon
            type="material-community"
            name="heart"
            color="#f00"
            containerStyle={styles.favorite}
            onPress={confirmRemoveFavorite}
            underlayColor="transparent"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  loaderShops: {
    marginTop: 10,
    marginBottom: 10,
  },
  shop: {
    margin: 10,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  name: {
    fontWeight: "bold",
    fontSize: 30,
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
});
