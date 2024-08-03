/*
# Creator: Israel Showell
# Start Date: 8/1/2024
# End Date: 8/3/2024
# Project: Stock Master - Remastered
# Version: 1.00

# Description:
This is an improved version of my previous program, Stock Master.
The UI and codebase are both cleaner, simpler, and more robust.
I was able to practice using Firebase, React, Next.js, Material UI, and Web development in doing this project!
This is a project from Headstater AI that I completed to practice and hone the following skills!

# Skills Practiced:
- Web Application Development
- Full-Stack Development (Front/Back-End)
- UI/UX Design
- Firebase, React, Next.js, Material UI (Tech Stack)
*/

//Ensures this component can use client-side rendering
'use client'

// Import necessary libraries and functions
import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { updateInventory, addItem, removeItem } from './inventoryFunctions';
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import User from './user';

// Define the style for the modal component
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

// Home component definition
export default function Home() {
  // State variables
  const [inventory, setInventory] = useState([]); // Manages the inventory list
  const [open, setOpen] = useState(false); // Manages the modal open state
  const [itemName, setItemName] = useState(''); // Stores the new item name
  const [searchTerm, setSearchTerm] = useState(''); // Stores the search term
  const [user, setUser] = useState(null); // State to manage the current user
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and registration forms
  const [username, setUsername] = useState(''); // Stores the username (email)
  const [password, setPassword] = useState(''); // Stores the password

  // Effect to fetch inventory when user changes
  useEffect(() => {
    if (user) {
      const fetchInventory = async () => {
        const inventoryList = await updateInventory(user.id);
        setInventory(inventoryList);
      };
      fetchInventory();
    }
  }, [user]);

  // Function to handle adding an item
  const handleAddItem = async (item) => {
    await addItem(user.id, item);
    const inventoryList = await updateInventory(user.id);
    setInventory(inventoryList);
  };

  // Function to handle removing an item
  const handleRemoveItem = async (item) => {
    await removeItem(user.id, item);
    const inventoryList = await updateInventory(user.id);
    setInventory(inventoryList);
  };

  // Function to handle user login
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        const loggedInUser = userCredential.user;
        setUser(new User(username, password, loggedInUser.uid));
      })
      .catch((error) => {
        alert('Error logging in:', error);
      });
  };

  // Function to handle user registration
  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        const newUser = userCredential.user;
        setUser(new User(username, password, newUser.uid));
        setIsRegistering(false);
      })
      .catch((error) => {
        alert('Error registering:', error);
      });
  };

  // Filter inventory based on the search term
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render login/register form if no user is logged in
  if (!user) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
      >
        <Typography variant="h4">{isRegistering ? 'Register' : 'Login'}</Typography>
        <TextField
          label="Email"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isRegistering ? (
          <Button variant="contained" onClick={handleRegister}>
            Register
          </Button>
        ) : (
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        )}
        <Button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </Button>
      </Box>
    );
  }

  // Render inventory management UI if user is logged in
  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                handleAddItem(itemName);
                setItemName('');
                setOpen(false);
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add New Item
      </Button>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Box border={'1px solid #333'} width="800px">
        <Box
          width="100%"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="100%" height="300px" spacing={2} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => handleRemoveItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
