import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import logo from '../../assets/logo-pictionary.png';

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Lobby</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 130,
        height: 130,
        marginBottom: 30,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#2E294E',
        fontFamily: 'Georgia',
    }
});

export default Header;
