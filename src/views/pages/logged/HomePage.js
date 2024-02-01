import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import BaseLayout from "../../layout/BaseLayout";

const HomePage = ({ navigation }) => {
    return (
        <BaseLayout>
            <View style={styles.container}>
                <Text>Bienvenue sur la page d'accueil!</Text>
                <Button
                    title="Aller à Add Device"
                    onPress={() => navigation.navigate('add-device')}
                />
            </View>
        </BaseLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default HomePage;
