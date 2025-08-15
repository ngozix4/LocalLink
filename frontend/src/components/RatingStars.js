import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RatingStars = ({ rating, onRate, size = 24, editable = false }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <TouchableOpacity 
        key={i} 
        onPress={() => editable && onRate(i)}
        activeOpacity={editable ? 0.5 : 1}
      >
        <Icon 
          name={i <= rating ? 'star' : 'star-border'} 
          size={size} 
          color="#FFD700" 
        />
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={{ flexDirection: 'row' }}>
      {stars}
    </View>
  );
};

export default RatingStars;