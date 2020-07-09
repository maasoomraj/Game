import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GradientClickable = ({ props, headerText, subText, colors, nav }) => {
  return (
    <LinearGradient
      // colors={["#D6322D", "#E9716C", "#EA9197"]}
      colors={colors}
      style={{
        borderRadius: 13,
        height: 100,
        marginVertical: 5,
        borderColor: "#000",
        borderWidth: 0.8,
        marginHorizontal: 5,
      }}
    >
      <TouchableOpacity
        onPress={() => props.navigation.navigate(nav)}
        // style={{
        //   justifyContent: "center",
        //   alignItems: "center",
        // }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "#eee",
            fontSize: 24,
            paddingTop: 10,
            paddingBottom: 5,
            paddingHorizontal: 15,
          }}
        >
          {headerText}
        </Text>
        <Text
          style={{
            fontWeight: "200",
            fontStyle: "italic",
            color: "#eee",
            fontSize: 14,
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
        >
          {subText}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default GradientClickable;
