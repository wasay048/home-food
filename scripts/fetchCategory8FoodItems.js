/**
 * Script to fetch food items with foodCategory containing 8
 * from the kitchen with kitchenId: PKcWQYMxEZQxnKSLp4de
 * 
 * Usage: node scripts/fetchCategory8FoodItems.js
 * 
 * Prerequisites:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Download service account key from Firebase Console:
 *    - Go to Project Settings > Service Accounts
 *    - Click "Generate New Private Key"
 *    - Save as 'serviceAccountKey.json' in the scripts folder
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const KITCHEN_ID = 'PKcWQYMxEZQxnKSLp4de';
const TARGET_CATEGORY = 8;
const OUTPUT_FILE = path.join(__dirname, 'category8_food_items.json');

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

// Check if service account key exists
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: Service account key not found!');
  console.log('');
  console.log('Please download your service account key from Firebase Console:');
  console.log('1. Go to https://console.firebase.google.com/');
  console.log('2. Select your project (homefoods-16e56)');
  console.log('3. Go to Project Settings > Service Accounts');
  console.log('4. Click "Generate New Private Key"');
  console.log('5. Save the file as: scripts/serviceAccountKey.json');
  process.exit(1);
}

// Read service account
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function fetchCategory8FoodItems() {
  console.log(`🔍 Fetching food items from kitchen: ${KITCHEN_ID}`);
  console.log(`🎯 Filtering for foodCategory containing: ${TARGET_CATEGORY}`);
  console.log('');

  try {
    // Reference to the foodItems subcollection
    const foodItemsRef = db.collection('kitchens').doc(KITCHEN_ID).collection('foodItems');
    
    // Get all food items first
    const snapshot = await foodItemsRef.get();
    
    if (snapshot.empty) {
      console.log('❌ No food items found in this kitchen');
      return;
    }

    console.log(`📦 Total food items in kitchen: ${snapshot.size}`);

    // Filter items where foodCategory contains 8
    // Assuming foodCategory can be an array or a number
    const category8Items = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const foodCategory = data.foodCategory;
      
      let matchesCategory = false;
      
      // Check if foodCategory is an array containing 8
      if (Array.isArray(foodCategory)) {
        matchesCategory = foodCategory.includes(TARGET_CATEGORY);
      }
      // Check if foodCategory is a number equal to 8
      else if (typeof foodCategory === 'number') {
        matchesCategory = foodCategory === TARGET_CATEGORY;
      }
      // Check if foodCategory is a string containing '8'
      else if (typeof foodCategory === 'string') {
        matchesCategory = foodCategory.includes(String(TARGET_CATEGORY));
      }
      
      if (matchesCategory) {
        category8Items.push({
          id: doc.id,
          ...data
        });
      }
    });

    console.log(`✅ Found ${category8Items.length} food items with category ${TARGET_CATEGORY}`);
    console.log('');

    // Write to JSON file
    const outputData = {
      metadata: {
        kitchenId: KITCHEN_ID,
        targetCategory: TARGET_CATEGORY,
        totalItemsInKitchen: snapshot.size,
        matchingItems: category8Items.length,
        fetchedAt: new Date().toISOString()
      },
      foodItems: category8Items
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));
    console.log(`💾 Data saved to: ${OUTPUT_FILE}`);

    // Print summary of items found
    if (category8Items.length > 0) {
      console.log('');
      console.log('📋 Summary of found items:');
      console.log('─'.repeat(50));
      category8Items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.foodTitle || item.name || 'Unnamed'} (ID: ${item.id})`);
        console.log(`   Category: ${JSON.stringify(item.foodCategory)}`);
        if (item.price !== undefined) {
          console.log(`   Price: $${item.price}`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error fetching data:', error);
    process.exit(1);
  } finally {
    // Cleanup
    await admin.app().delete();
  }
}

// Run the script
fetchCategory8FoodItems();
