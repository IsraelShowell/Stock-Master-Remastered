// inventoryFunctions.js

// Import necessary Firestore functions from Firebase
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
// Import the Firestore instance
import { firestore } from '@/firebase';

// Function to update the inventory by fetching data from Firestore for a specific user
export const updateInventory = async (userId) => {
  // Create a query to get the 'inventory' collection for the specific user from Firestore
  const snapshot = query(collection(firestore, `users/${userId}/inventory`));
  
  // Fetch all documents from the user's 'inventory' collection using the query
  const docs = await getDocs(snapshot);
  
  // Initialize an empty array to store the inventory items
  const inventoryList = [];
  
  // Loop through each document fetched from Firestore
  docs.forEach((doc) => {
    // Add each document to the inventory list with its id and data
    inventoryList.push({ name: doc.id, ...doc.data() });
  });
  
  // Return the inventory list
  return inventoryList;
};

// Function to add an item to the user's inventory
export const addItem = async (userId, item) => {
  // Create a reference to the document for the given item in the user's 'inventory' collection
  const docRef = doc(collection(firestore, `users/${userId}/inventory`), item);
  
  // Fetch the document snapshot for the given item
  const docSnap = await getDoc(docRef);
  
  // Check if the document already exists in the inventory
  if (docSnap.exists()) {
    // If it exists, get the current quantity of the item
    const { quantity } = docSnap.data();
    
    // Update the document with the new quantity (increment by 1)
    await setDoc(docRef, { quantity: quantity + 1 });
  } else {
    // If the document does not exist, create it with a quantity of 1
    await setDoc(docRef, { quantity: 1 });
  }
};

// Function to remove an item from the user's inventory
export const removeItem = async (userId, item) => {
  // Create a reference to the document for the given item in the user's 'inventory' collection
  const docRef = doc(collection(firestore, `users/${userId}/inventory`), item);
  
  // Fetch the document snapshot for the given item
  const docSnap = await getDoc(docRef);
  
  // Check if the document exists in the inventory
  if (docSnap.exists()) {
    // If it exists, get the current quantity of the item
    const { quantity } = docSnap.data();
    
    // If the quantity is 1, delete the document
    if (quantity === 1) {
      await deleteDoc(docRef);
    } else {
      // Otherwise, update the document with the new quantity (decrement by 1)
      await setDoc(docRef, { quantity: quantity - 1 });
    }
  }
};
