import React, { useEffect, useState } from "react";
import { View,Text,ActivityIndicator,StyleSheet,Image,ScrollView,
TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { getProductById } from "../services/serviceProducts";
import { ProductApi } from "../types/api";


type ProductDetailsRouteParams = {
  productId: number;
};

export default function ScreenDetailsProduct(Props:any) {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params as ProductDetailsRouteParams;

  const [product, setProduct] = useState<ProductApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const foundProduct = await getProductById(productId);
        setProduct(foundProduct);
      } catch (error: any) {
        setErrorMessage(
          error.message || "Não foi possível carregar os detalhes do produto."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [productId]); 

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <Text>Carregando detalhes do produto...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Produto não encontrado.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>{"< Voltar"}</Text>
      </TouchableOpacity>

      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>$ {product.price.toFixed(2)}</Text>
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.descriptionTitle}>Description:</Text>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>
          Rating: {product.rating.rate} ({product.rating.count} votes)
        </Text>
      </View>

      {/*O botão Editar pode ser adicionado aqui em uma etapa futura */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e67e22",
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "bold",
  },
  errorMessage: {
    textAlign: "center",
    marginBottom: 20,
    color: "red",
    fontSize: 16,
  },
});
