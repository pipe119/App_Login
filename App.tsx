import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, ScrollView, StyleSheet, Alert } from 'react-native';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    date: ''
  });
  const [editingClient, setEditingClient] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]); // Almacena los usuarios registrados

  const allowedUsers = [
    { username: 'usuario1', password: '1234' },
    { username: 'usuario2', password: '5678' }
  ];

  const register = () => {
    if (username.trim() === '' || password.trim() === '') {
      alert('Por favor ingresa un nombre de usuario y una contraseña.');
      return;
    }

    // Verifica si el nombre de usuario ya está registrado
    const userExists = registeredUsers.find(user => user.username === username);
    if (userExists) {
      alert('Este nombre de usuario ya está registrado. Por favor, elige otro.');
      return;
    }

    // Registra al nuevo usuario
    setRegisteredUsers([...registeredUsers, { username, password }]);
    alert('Usuario registrado exitosamente. Puedes iniciar sesión ahora.');
  };

  const login = () => {
    const foundUser = registeredUsers.find(user => user.username === username && user.password === password);
    if (foundUser) {
      setIsLoggedIn(true);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };
  

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setClients([]);
    setEditingClient(null); // Reset editing client
  };

  const addClient = () => {
    setClients([...clients, { ...newClient }]);
    setNewClient({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      date: ''
    });
  };

  const editClient = () => {
    if (!editingClient) {
      // Si no hay un cliente en edición, no hay nada que hacer
      return;
    }

    // Crea una copia de la lista de clientes
    const updatedClients = [...clients];

    // Encuentra el índice del cliente en la lista de clientes
    const index = updatedClients.findIndex(client => client.id === editingClient.id);

    if (index === -1) {
      // Si no se encuentra el cliente en la lista, no hay nada que hacer
      return;
    }

    // Actualiza el cliente en la lista de clientes con los nuevos datos del formulario
    updatedClients[index] = {
      ...updatedClients[index],
      id: newClient.id,
      firstName: newClient.firstName,
      lastName: newClient.lastName,
      email: newClient.email,
      date: newClient.date
    };

    // Actualiza el estado de la lista de clientes
    setClients(updatedClients);

    // Resetea el cliente en edición
    setEditingClient(null);
  };

  const deleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    // Establece el nuevo cliente en base al cliente en edición
    setNewClient({ ...client });
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Cliente',
      `¿Estás seguro de eliminar el cliente con ID ${id}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteClient(id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <ScrollView contentContainerStyle={styles.centeredContent}>
          <View style={styles.authContainer}>
            <Text style={styles.welcomeText}>Bienvenido a la App de Prueba</Text>
            <TextInput
              placeholder="Usuario"
              value={username}
              onChangeText={text => setUsername(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry
              style={styles.input}
            />
            <Button title="Iniciar sesión" onPress={login}/>
            <Button title="Registrarse" onPress={register} />
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.centeredContent}>
          <View style={styles.authContainer}>
            <Text style={styles.welcomeText}>Bienvenido!</Text>
            <View style={styles.clientList}>
              <View style={styles.clientHeader}>
                <Text style={styles.clientHeaderCell}>ID</Text>
                <Text style={styles.clientHeaderCell}>Nombre</Text>
                <Text style={styles.clientHeaderCell}>Apellido</Text>
                <Text style={styles.clientHeaderCell}>Email</Text>
                <Text style={styles.clientHeaderCell}>Fecha</Text>
                <Text style={styles.clientHeaderCell}></Text>
              </View>
              <FlatList
                data={clients}
                renderItem={({ item }) => (
                  <View style={styles.clientRow} key={item.id}>
                    <Text style={styles.clientCell}>{item.id}</Text>
                    <Text style={styles.clientCell}>{item.firstName}</Text>
                    <Text style={styles.clientCell}>{item.lastName}</Text>
                    <Text style={styles.clientCell}>{item.email}</Text>
                    <Text style={styles.clientCell}>{item.date}</Text>
                    <Button title="Editar" onPress={() => handleEdit(item)} />
                    <Button title="Eliminar" onPress={() => handleDelete(item.id)} />
                  </View>
                )}
                keyExtractor={item => item.id.toString()}
              />
            </View>
            <TextInput
              placeholder="ID"
              value={newClient.id}
              onChangeText={text => setNewClient({ ...newClient, id: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Nombre"
              value={newClient.firstName}
              onChangeText={text => setNewClient({ ...newClient, firstName: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Apellido"
              value={newClient.lastName}
              onChangeText={text => setNewClient({ ...newClient, lastName: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={newClient.email}
              onChangeText={text => setNewClient({ ...newClient, email: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Fecha"
              value={newClient.date}
              onChangeText={text => setNewClient({ ...newClient, date: text })}
              style={styles.input}
            />
            <Button title="Agregar cliente" onPress={addClient} />
            <Button title="Modificar cliente" onPress={editClient} />
            <Button title="Cerrar sesión" onPress={logout} />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centeredContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    width: '80%',
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 50,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  clientList: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  clientHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  clientHeaderCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
  },
  clientRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  clientCell: {
    flex: 1,
    padding: 10,
  },
});

export default App;
