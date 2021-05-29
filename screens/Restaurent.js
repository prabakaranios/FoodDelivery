import React from "react";
import { useState } from "react";
import { render } from "react-dom";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";

import { isIphoneX } from "react-native-iphone-x-helper";
import { debug } from "react-native-reanimated";
import { icons, COLORS, SIZES, FONTS } from "../constants";

const Restaurent = ({ route, navigation }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const scrollX = new Animated.Value(0);

  React.useEffect(() => {
    const { item, currentLocation } = route.params;
    setRestaurant(item);
    setCurrentLocation(currentLocation);
  });

  function editOder(action, menuId, price) {
    let orderlist = orderItems.slice();
    let item = orderlist.filter((a) => a.menuId == menuId);
    if (action == "+") {
      if (item.length > 0) {
        let newQty = item[0].qty + 1;
        item[0].qty = newQty;
        item[0].total = item[0].qty * price;
      } else {
        const newItem = {
          menuId: menuId,
          qty: 1,
          price: price,
          total: price,
        };
        orderlist.push(newItem);
      }
      setOrderItems(orderlist);
    } else {
      if (item.length > 0) {
        if (item[0].qty > 0) {
          let newQty = item[0].qty - 1;
          item[0].qty = newQty;
          item[0].total = newQty * price;
        }
      }
      setOrderItems(orderlist);
    }
  }

  function getOrderQty(menuid) {
    let orderItem = orderItems.filter((a) => a.menuId == menuid);
    if (orderItem.length > 0) {
      return orderItem[0].qty;
    }
    return 0;
  }

  function getBasketItemCount() {
    let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0);
    return itemCount;
  }

  function getTotalAmount() {
    let totalAmount = orderItems.reduce((a, b) => a + (b.total || 0), 0);
    return totalAmount.toFixed(2);
  }

  function renderHeader() {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            paddingLeft: SIZES.padding * 2,
            width: 50,
            justifyContent: "center",
          }}
        >
          <Image
            source={icons.back}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          ></Image>
        </TouchableOpacity>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: SIZES.padding * 3,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.lightGray3,
            }}
          >
            <Text style={{ textAlign: "center", ...FONTS.h3 }}>
              {restaurant?.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: 50,
            paddingRight: SIZES.padding * 2,
            justifyContent: "center",
          }}
        >
          <Image
            source={icons.list}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderDots() {
    const dotPosition = Animated.divide(scrollX, SIZES.width);

    return (
      <View style={{ height: 30 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: SIZES.padding,
          }}
        >
          {restaurant?.menu.map((item, index) => {
            const opacity = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            const dotSize = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [SIZES.base, 10, SIZES.base],
              extrapolate: "clamp",
            });

            const dotColor = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={`dot-${index}`}
                opacity={opacity}
                style={{
                  borderRadius: SIZES.radius,
                  marginHorizontal: 6,
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: dotColor,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }

  function renderOrder() {
    return (
      <View>
        {renderDots()}
        <View
          style={{
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: COLORS.white,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.lightGray2,
            }}
          >
            <Text style={{ ...FONTS.body3 }}>
              {getBasketItemCount()} Item in Cart
            </Text>
            <Text style={{ ...FONTS.body3 }}>${getTotalAmount()}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                source={icons.pin}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.darkgray,
                }}
              />
              <Text style={{ ...FONTS.h4, marginLeft: SIZES.padding }}>
                Location
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={icons.master_card}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.darkgray,
                }}
              />

              <Text style={{ ...FONTS.h4, marginLeft: SIZES.padding }}>
                8888
              </Text>
            </View>
          </View>

          {/*order button */}
          <View
            style={{
              padding: SIZES.padding * 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                width: SIZES.width * 0.9,
                borderRadius: SIZES.radius,
                alignItems: "center",
                padding: SIZES.padding,
              }}
              onPress={() => {
                console.log(`restaurant ----> ${restaurant}`);
                console.log(`currentlocation ----> ${currentLocation}`);

                navigation.navigate("OrderDelivery", {
                  restaurant,
                  currentLocation,
                });
              }}
            >
              <Text
                style={{
                  ...FONTS.h2,
                  color: COLORS.white,
                }}
              >
                Order
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function renderFoodInfo() {
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        {restaurant?.menu.map((item, index) => (
          <View key={`menu-${index}`} style={{ alignItems: "center" }}>
            <View style={{ height: SIZES.height * 0.35 }}>
              {/* Food Image */}
              <Image
                source={item.photo}
                resizeMode="cover"
                style={{
                  width: SIZES.width,
                  height: "100%",
                }}
              />

              {/* Quantity */}
              <View
                style={{
                  position: "absolute",
                  width: SIZES.width,
                  height: 50,
                  justifyContent: "center",
                  flexDirection: "row",
                  bottom: -20,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 50,
                    backgroundColor: COLORS.white,
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                  }}
                  onPress={() => editOder("-", item.menuId, item.price)}
                >
                  <Text style={{ ...FONTS.body1 }}>-</Text>
                </TouchableOpacity>
                <View
                  style={{
                    width: 50,
                    backgroundColor: COLORS.white,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ ...FONTS.h2 }}>
                    {" "}
                    {getOrderQty(item.menuId)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    width: 50,
                    backgroundColor: COLORS.white,
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                  }}
                  onPress={() => editOder("+", item.menuId, item.price)}
                >
                  <Text style={{ ...FONTS.body1 }}>+</Text>
                </TouchableOpacity>
              </View>

              {/*Name & Description */}
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: SIZES.padding * 2,
                  marginTop: 25,
                  width: SIZES.width,
                }}
              >
                <Text
                  style={{
                    marginVertical: 10,
                    ...FONTS.h2,
                    textAlign: "center",
                  }}
                >
                  {item.name} - {item.price.toFixed(2)}
                </Text>
                <Text style={{ ...FONTS.body3 }}>{item.description}</Text>
              </View>

              {/*calories */}
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={icons.fire}
                  resizeMode="cover"
                  style={{ height: 20, width: 20, marginRight: 10 }}
                />
                <Text style={{ ...FONTS.darkgray, ...FONTS.body3 }}>
                  {item.calories.toFixed()} cal
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderFoodInfo()}
      {renderOrder()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: COLORS.lightGray2,
  },
});

export default Restaurent;
