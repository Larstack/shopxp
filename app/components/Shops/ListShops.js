import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function ListShops(props) {
  const { shops, handleLoadMore, isLoading } = props;
  const navigation = useNavigation();

  return (
    <View>
      {size(shops) > 0 ? (
        <FlatList
          data={shops}
          renderItem={(shop) => <Shop shop={shop} navigation={navigation} />}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderShops}>
          <ActivityIndicator size="large" />
          <Text>Cargando shops</Text>
        </View>
      )}
    </View>
  );
}

function Shop(props) {
  const { shop, navigation } = props;
  const { id, images, name, address, description } = shop.item;
  const imageShop = images ? images[0] : null;

  const goShop = () => {
    navigation.navigate("shop", {
      id,
      name,
    });
  };

  return (
    <TouchableOpacity onPress={goShop}>
      <View style={styles.viewShop}>
        <View style={styles.viewShopImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="fff" />}
            source={
              imageShop
                ? { uri: imageShop }
                : require("../../../assets/img/no-image.png")
            }
            style={styles.imageShop}
          />
        </View>
        <View>
          <Text style={styles.shopName}>{name}</Text>
          <Text style={styles.shopAddress}>{address}</Text>
          <Text style={styles.shopDescription}>
            {description.substr(0, 60)}...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loaderShops}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundShops}>
        <Text>No quedan shops por cargar</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loaderShops: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  viewShop: {
    flexDirection: "row",
    margin: 10,
  },
  viewShopImage: {
    marginRight: 15,
  },
  imageShop: {
    width: 80,
    height: 80,
  },
  shopName: {
    fontWeight: "bold",
  },
  shopAddress: {
    paddingTop: 2,
    color: "grey",
  },
  shopDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
  notFoundShops: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
