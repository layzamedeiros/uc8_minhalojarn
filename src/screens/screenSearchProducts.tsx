import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { getAllProducts } from "../services/serviceProducts";
import { ProductApi } from "../types/api";
import { ProductDetailsProps } from "../../App";
import Toast from "react-native-toast-message";

interface ScreenProductsProps {
  toLogout: () => void;
}

export default function ScreenSearchProducts({ toLogout }: ScreenProductsProps) {
  const navigation = useNavigation<ProductDetailsProps>();

  const [listProducts, setListProducts] = useState<ProductApi[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductApi[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [termSearch, setTermSearch] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      setErrorMessage("");
      try {
        const products = await getAllProducts();
        setListProducts(products);
        setFilteredProducts(products);
      } catch (error: any) {
        setErrorMessage(error.message || "Não foi possível carregar os produtos.");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (termSearch === "") {
      setFilteredProducts(listProducts);
    } else {
      const filtered = listProducts.filter((product) =>
        product.title.toLowerCase().includes(termSearch.toLowerCase()) ||
        product.category.toLowerCase().includes(termSearch.toLowerCase())
      );
      setFilteredProducts(filtered);

    if (filtered.length === 0) {
      Toast.show({
        type: "info",
        text1: "Nenhum resultado encontrado",
        text2: `Para "${termSearch}"`,
      });
    }

    }
  }, [termSearch, listProducts]);

  const renderProductItem = ({ item }: { item: ProductApi }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate("DetailsProducts", { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loadingProducts) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={toLogout}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Produtos</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={toLogout}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar produtos..."
        value={termSearch}
        onChangeText={setTermSearch}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 26,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  buttonText: {
    fontSize: 14,
  },
  searchInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  productItem: {
    flexDirection: "row",
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 5,
    opacity: 0.7,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 20,
  },
  errorMessage: {
    textAlign: "center",
    marginBottom: 20,
    color: "red",
  },
});