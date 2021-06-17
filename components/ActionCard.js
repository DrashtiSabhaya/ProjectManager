import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

const ActionCard = (props) => {
    return (
        <View style={{...styles.cardContainer, ...props.style }}>
            {props.children}
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        /** IOS Shadow Properties */
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        /** Android Shadow Property */
        padding: 12,
        elevation: 5,
        backgroundColor: 'white',
        borderRadius: 10
    }
});

export default ActionCard;