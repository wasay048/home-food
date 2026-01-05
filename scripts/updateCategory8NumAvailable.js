/**
 * Script to update numAvailable to 100 for all category 8 food items
 * 
 * Usage: node scripts/updateCategory8NumAvailable.js
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const KITCHEN_ID = 'PKcWQYMxEZQxnKSLp4de';
const TARGET_CATEGORY = 8;
const NEW_NUM_AVAILABLE = 100;

// File paths
const BACKUP_DIR = path.join(__dirname, 'backups');
const BACKUP_FILE = path.join(BACKUP_DIR, `category8_numAvailable_backup_${Date.now()}.json`);

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: Service account key not found at:', serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateNumAvailable() {
  console.log('🚀 Starting numAvailable update...');
  console.log(`📍 Kitchen ID: ${KITCHEN_ID}`);
  console.log(`🎯 Target Category: ${TARGET_CATEGORY}`);
  console.log(`📊 New numAvailable value: ${NEW_NUM_AVAILABLE}`);
  console.log('');

  try {
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const foodItemsRef = db.collection('kitchens').doc(KITCHEN_ID).collection('foodItems');
    const snapshot = await foodItemsRef.get();
    
    if (snapshot.empty) {
      console.log('❌ No food items found');
      return;
    }

    // Filter category 8 items
    const category8Items = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const foodCategory = data.foodCategory;
      
      let matchesCategory = false;
      
      if (Array.isArray(foodCategory)) {
        matchesCategory = foodCategory.includes(TARGET_CATEGORY) || foodCategory.includes(String(TARGET_CATEGORY));
      } else if (typeof foodCategory === 'number') {
        matchesCategory = foodCategory === TARGET_CATEGORY;
      } else if (typeof foodCategory === 'string') {
        matchesCategory = foodCategory.includes(String(TARGET_CATEGORY));
      }
      
      if (matchesCategory) {
        category8Items.push({
          id: doc.id,
          ref: doc.ref,
          data: data
        });
      }
    });

    console.log(`📦 Found ${category8Items.length} food items with category ${TARGET_CATEGORY}`);
    console.log('');

    // Create backup
    console.log('💾 Creating backup...');
    const backupData = {
      metadata: {
        kitchenId: KITCHEN_ID,
        targetCategory: TARGET_CATEGORY,
        totalItems: category8Items.length,
        backupCreatedAt: new Date().toISOString(),
        updateField: 'numAvailable',
        newValue: NEW_NUM_AVAILABLE
      },
      foodItems: category8Items.map(item => ({
        id: item.id,
        name: item.data.name,
        previousNumAvailable: item.data.numAvailable
      }))
    };

    fs.writeFileSync(BACKUP_FILE, JSON.stringify(backupData, null, 2));
    console.log(`✅ Backup saved to: ${BACKUP_FILE}`);
    console.log('');

    // Update all items
    console.log('🔄 Updating numAvailable to 100...');
    console.log('');

    let updated = 0;
    let errors = 0;

    for (const item of category8Items) {
      try {
        const previousValue = item.data.numAvailable;
        await item.ref.update({ numAvailable: NEW_NUM_AVAILABLE });
        
        console.log(`✅ ${item.data.name}`);
        console.log(`   Previous: ${previousValue} → New: ${NEW_NUM_AVAILABLE}`);
        updated++;
      } catch (error) {
        console.error(`❌ Error updating ${item.id}:`, error.message);
        errors++;
      }
    }

    console.log('');
    console.log('─'.repeat(50));
    console.log('📊 Update Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ❌ Errors: ${errors}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await admin.app().delete();
  }
}

updateNumAvailable();
