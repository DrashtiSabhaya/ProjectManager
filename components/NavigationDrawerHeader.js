import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const NavigationDrawerHeader = (props) => {
  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: 'row', marginLeft: 15 }}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Icon name='menu' size={25} color='#fff' />
      </TouchableOpacity>
    </View>
  );
};
export default NavigationDrawerHeader;
