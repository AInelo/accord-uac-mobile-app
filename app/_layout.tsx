import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { UACProvider } from "@/contexts/UACContext";
import { Colors } from "@/constants/colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack 
      screenOptions={{ 
        headerBackTitle: "Retour",
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold' as const,
        },
      }}
    >
            <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="agreement" 
        options={{ 
          title: "Accords de Coopération",
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="agreement/[id]" 
        options={{ 
          title: "Détails de l'Accord",
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="map" 
        options={{ 
          title: "Carte des Partenaires",
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="filters" 
        options={{ 
          title: "Filtres et Recherche",
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="statistics" 
        options={{ 
          title: "Statistiques",
          headerShown: true,
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UACProvider>
        <GestureHandlerRootView style={styles.container}>
          <StatusBar style="light" />
          <RootLayoutNav />
        </GestureHandlerRootView>
      </UACProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
