import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import MapViewDirections from "react-native-maps-directions";
import Mapview, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { COLORS, FONTS, icons, SIZES, GOOGLE_API_KEY } from "../constants";
import { color } from "react-native-reanimated";

const OrderDelivery = (route, navigation) => {
  const [restaurant, setRestaurant] = useState(null);
  const [streetName, setStreetName] = useState("");
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [region, setRegion] = useState(null);

  React.useEffect(() => {
    let { restaurant, currentLocation } = route.route.params;

    let fromLoc = currentLocation.gps;

    let toLoc = restaurant.location;
    let street = currentLocation.streetName;

    let mapRegion = {
      latitude: (fromLoc.latitude + toLoc.latitude) / 2,
      longitude: (fromLoc.longitude + toLoc.longitude) / 2,
      latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
      longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2,
    };

    setRestaurant(restaurant);
    setStreetName(street);
    setFromLocation(fromLoc);
    setToLocation(toLoc);
    setRegion(mapRegion);
  }, []);
  function renderMap() {
    const destinationMarker = () => (
      <Marker coordinate={toLocation}>
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.white,
          }}
        >
          <View
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              alignContent: "center",
              justifyContent: "center",
              backgroundColor: COLORS.primary,
            }}
          >
            <Image
              source={icons.pin}
              style={{ width: 25, height: 25, tintColor: COLORS.white }}
            />
          </View>
        </View>
      </Marker>
    );

    const carIcon = () => (
      <Marker coordinate={fromLocation} anchor={{ x: 0.5, y: 0.5 }} flat={true}>
        <Image
          source={icons.car}
          ancho
          style={{
            width: 40,
            height: 40,
          }}
        />
      </Marker>
    );

    return (
      <View style={{ flex: 1 }}>
        <Mapview
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={region}
        >
          <MapViewDirections
            origin={fromLocation}
            destination={toLocation}
            apikey={GOOGLE_API_KEY}
            strokeWidth={5}
            strokeColor={COLORS.primary}
            optimizeWaypoints={true}
          />
          {carIcon()}
          {destinationMarker()}
        </Mapview>
      </View>
    );
  }
  return <View style={{ flex: 1 }}>{renderMap()}</View>;
};

export default OrderDelivery;
