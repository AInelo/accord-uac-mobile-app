import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { FileX } from "lucide-react-native";
import { Colors } from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Page non trouvée" }} />
      <View style={styles.container}>
        <FileX size={64} color={Colors.gray.medium} />
        <Text style={styles.title}>Cette page n'existe pas</Text>
        <Text style={styles.subtitle}>
          La page que vous recherchez est introuvable ou a été déplacée.
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Retour à l'accueil</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: Colors.secondary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray.dark,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  link: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "600" as const,
  },
});
