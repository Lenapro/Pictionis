import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Clipboard from "expo-clipboard";

function GameModal({ isVisible, onShare, onClose, gameCode }) {

    const shareGameCode = () => {
        Clipboard.setString(gameCode);
        alert("Code copié dans le presse-papiers !");
        if (onShare) onShare();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Code de la partie : {gameCode}</Text>

                    <TouchableOpacity style={styles.modalButton} onPress={shareGameCode}>
                        <Text style={styles.modalButtonText}>Partager le code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                        <Text style={styles.modalButtonText}>Fermer</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 26,
        fontWeight: '500',
        color: '#444'
    },
    modalButton: {
        marginVertical: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#1FAB89',
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        zIndex: 2000,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default GameModal;
