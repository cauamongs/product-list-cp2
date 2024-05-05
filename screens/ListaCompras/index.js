import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ModalAdicionarItem } from "./ModalAdicionarItem";
import {
  get,
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  push,
} from "firebase/database";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useUser } from "../../contexts";

const ShoppingListScreen = ({ changeScreen }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({ id: "", name: "", quantity: "" });
  const [isLoading, setIsLoading] = useState(true);
  const db = getDatabase();
  const { user, logout } = useUser();

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleUpdateProductName = (value) => {
    setProduct((valorAnterior) => ({ ...valorAnterior, name: value }));
  };

  const handleUpdateProductQuantity = (value) => {
    setProduct((valorAnterior) => ({ ...valorAnterior, quantity: value }));
  };

  const handleSaveProduct = () => {
    const newProduct = { ...product };
    const newProductRef = push(productsRef);
    newProduct.id = newProductRef.key;
    const updatedShoppingList = [...shoppingList, newProduct];
    salvarListaNoFirebase(updatedShoppingList);
  };

  const productsRef = ref(db, `users/${user.uid}/produtos`);

  const salvarListaNoFirebase = (shoppingList) => {
    set(productsRef, shoppingList)
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Produto salvo com sucesso",
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Erro ao salvar lista de compras no Firebase:",
        });
      });
  };

  const handleDeleteProduct = (id) => {
    const updatedShoppingList = shoppingList.filter((item) => item.id !== id);
    setShoppingList(updatedShoppingList);
    salvarListaNoFirebase(updatedShoppingList);

    const productRef = ref(db, `users/${user.uid}/produtos/${id}`);
    remove(productRef)
      .then(() => {
        Toast.show({
          type: "success",
          text1: `Item excluído do banco de dados.`,
        });
      })
      .catch(() => {
        console.error(
          Toast.show({
            type: "error",
            text1: `Erro ao excluir item do banco de dados`,
          })
        );
      });
  };

  useEffect(() => {
    const productsRef = ref(db, `users/${user.uid}/produtos`);

    get(productsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setShoppingList(data);
        } else {
          setShoppingList([]);
        }
      })
      .catch((error) => {
        console.error("Error getting data:", error);
        Toast.show({
          type: "error",
          text1: `Erro ao buscar dados no banco`,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });

    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setShoppingList(data);
      } else {
        setShoppingList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : shoppingList.length === 0 ? (
        <View>
          <Button title="Adicionar item" onPress={handleOpenModal} />
          <Text style={styles.label}>
            Lista vazia, clique em adicionar para começar a preencher sua lista
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <Button title="Adicionar item" onPress={handleOpenModal} />
          <FlatList
            style={styles.list}
            data={shoppingList}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemName}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
                  <Feather name="trash-2" size={24} color="#FF6347" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
      <ModalAdicionarItem
        isOpen={isOpen}
        onClose={() => {
          setProduct({});
          setIsOpen(false);
        }}
        product={product}
        handleUpdateProductName={handleUpdateProductName}
        handleUpdateProductQuantity={handleUpdateProductQuantity}
        handleSaveProduct={handleSaveProduct}
      />
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          changeScreen("Login");
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 20,
    paddingTop: 80,
    height: "100%",
  },
  listContainer: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    marginTop: 10,
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ShoppingListScreen;
