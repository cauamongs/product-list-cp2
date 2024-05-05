import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TextInput,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const ModalAdicionarItem = ({
  product,
  handleUpdateProductName,
  handleUpdateProductQuantity,
  handleSaveProduct,
  isOpen,
  onClose,
}) => {
  const translateY = React.useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;

  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: isOpen ? 0 : Dimensions.get("window").height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <Modal visible={isOpen} transparent>
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null}>
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY }] }]}
        >
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do produto"
            onChangeText={handleUpdateProductName}
            value={product.name}
          />
          <TextInput
            style={styles.input}
            placeholder="Digite a quantidade"
            value={product.quantity}
            keyboardType="numeric"
            onChangeText={handleUpdateProductQuantity}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="Fechar" onPress={onClose} />
            </View>
            <View style={styles.button}>
              <Button
                title="Salvar produto"
                onPress={() => {
                  handleSaveProduct();
                  onClose();
                }}
              />
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export { ModalAdicionarItem };

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlay: {
    flex: 1,
  },
  modalContent: {
    width: windowWidth,
    maxHeight: windowHeight / 2,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: Platform.OS === "ios" ? 0 : 20,
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
