import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { firestore, database } from '../../config/firebaseConfig';
import { collection, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';


const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convertissez le timestamp Firestore en objet Date JavaScript
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const ChatComponent = ({ gameCode, inputText, setInputText, sendMessage }) => {
    const [messages, setMessages] = useState([]);

    const sendMessageWithStatus = async (text) => {
        const newMessage = {
            text,
            timestamp: database.firestore.FieldValue.serverTimestamp(),
            status: 'sent',
        };

        const docRef = await database.firestore().collection('messages').add(newMessage);

        setTimeout(() => {
            updateDoc(docRef, { status: 'delivered' });
        }, 1000);
    };


    useEffect(() => {
        if (!gameCode) return;

        const messagesQuery = query(
            collection(firestore, 'messages'),
            orderBy('timestamp', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    },[gameCode]);

    const renderItem = ({ item }) => (
        <View style={styles.messageContainer}>
            <Text style={styles.emailText}>{item.userEmail} · {formatDate(item.timestamp)}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                    {item.status === 'read' ? 'Lu' : item.status === 'delivered' ? 'Livré' : 'Envoyé'}
                </Text>
            </View>
        </View>
    );


    return (
        <View style={styles.chatArea}>
            <FlatList
                style={styles.messages}
                data={messages.slice(-10)}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                inverted
            />
            <View style={styles.inputArea}>
                <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    style={styles.inputText}
                    placeholder="Type your message..."
                    placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chatArea: {
        flex: 3,
        backgroundColor: '#20B2AA',
        borderRadius: 15,
        marginVertical: 10,
        padding: 10,
    },
    messages: {
        flex: 4,
        backgroundColor: '#E0FFFF',
        borderRadius: 15,
        margin: 5,
    },
    messageContainer: {
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    statusText: {
        fontSize: 12,
        color: '#666',
    },
    emailText: {
        fontSize: 13,
        color: '#20B2AA',
        marginBottom: 2,
    },
    messageText: {
        fontSize: 15,
        color: '#000000',
        backgroundColor: '#FFFFFF', // Ajoutez un fond blanc pour le texte du message
        borderRadius: 8,
        padding: 8,
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: 30,
        marginVertical: 5,
        paddingHorizontal: 20,
        height: 50,
    },
    inputText: {
        flex: 1,
        backgroundColor: '#008080',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 40,
        color: '#FAFAFA',
    },
    sendButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#1FAB89',
        borderRadius: 25,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ChatComponent;
