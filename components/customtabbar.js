import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'; // Make sure you have these installed

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icon = {
          'Home': 'home',
          'Trips': 'car',
          'Account': 'user'
        }[label];

        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.iconContainer}
          >
            <FontAwesome5
              name={icon}
              size={24}
              color={isFocused ? styles.activeColor.color : styles.inactiveColor.color}
            />
            <Text style={[isFocused ? styles.activeColor : styles.inactiveColor, styles.labelStyle]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'black',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeColor: {
    color: 'red',
  },
  inactiveColor: {
    color: 'white',
  },
  labelStyle: {
    fontSize: 12,
  }
});

export default CustomTabBar;
