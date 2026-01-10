import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { drops } from '../../data/drops';
import DropCard from '../../components/drops/DropCard';

export default function DropsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <Text style={styles.title}>Latest Drops</Text>
                <Text style={styles.subtitle}>Don't miss out on the hype.</Text>
            </View>
            <FlatList
                data={drops}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <DropCard drop={item} />}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    list: {
        padding: 20,
        paddingBottom: 40,
    },
});
