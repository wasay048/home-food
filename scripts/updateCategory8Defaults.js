/**
 * Script to update food items with category 8 to add default values
 * for minByGroup, maxByGroup, and numAvailable if they don't exist
 * 
 * Usage: node scripts/updateCategory8Defaults.js
 * 
 * This script will:
 * 1. Create a backup of all category 8 items before updating
 * 2. Update documents that are missing minByGroup, maxByGroup, or numAvailable
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

// Default values to add
const DEFAULT_VALUES = {
  minByGroup: 10,
  maxByGroup: 100,
  numAvailable: 100
};

// File paths
const BACKUP_DIR = path.join(__dirname, 'backups');
const BACKUP_FILE = path.join(BACKUP_DIR, `category8_backup_${Date.now()}.json`);
const UPDATE_LOG_FILE = path.join(__dirname, 'category8_update_log.json');

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

async function updateCategory8Defaults() {
  console.log('🚀 Starting update process...');
  console.log(`📍 Kitchen ID: ${KITCHEN_ID}`);
  console.log(`🎯 Target Category: ${TARGET_CATEGORY}`);
  console.log('');

  try {
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
      console.log('📁 Created backup directory:', BACKUP_DIR);
    }

    // Reference to the foodItems subcollection
    const foodItemsRef = db.collection('kitchens').doc(KITCHEN_ID).collection('foodItems');
    
    // Get all food items
    const snapshot = await foodItemsRef.get();
    
    if (snapshot.empty) {
      console.log('❌ No food items found in this kitchen');
      return;
    }

    // Filter and collect category 8 items
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

    // ============ STEP 1: CREATE BACKUP ============
    console.log('💾 Step 1: Creating backup...');
    
    const backupData = {
      metadata: {
        kitchenId: KITCHEN_ID,
        targetCategory: TARGET_CATEGORY,
        totalItems: category8Items.length,
        backupCreatedAt: new Date().toISOString(),
        defaultValuesToAdd: DEFAULT_VALUES
      },
      foodItems: category8Items.map(item => ({
        id: item.id,
        ...item.data
      }))
    };

    fs.writeFileSync(BACKUP_FILE, JSON.stringify(backupData, null, 2));
    console.log(`✅ Backup saved to: ${BACKUP_FILE}`);
    console.log('');

    // ============ STEP 2: UPDATE DOCUMENTS ============
    console.log('🔄 Step 2: Updating documents...');
    console.log('');

    const updateResults = {
      updated: [],
      skipped: [],
      errors: []
    };

    for (const item of category8Items) {
      const { id, ref, data } = item;
      const updates = {};
      const fieldsAdded = [];

      // Check each default field
      if (data.minByGroup === undefined || data.minByGroup === null) {
        updates.minByGroup = DEFAULT_VALUES.minByGroup;
        fieldsAdded.push('minByGroup');
      }

      if (data.maxByGroup === undefined || data.maxByGroup === null) {
        updates.maxByGroup = DEFAULT_VALUES.maxByGroup;
        fieldsAdded.push('maxByGroup');
      }

      if (data.numAvailable === undefined || data.numAvailable === null) {
        updates.numAvailable = DEFAULT_VALUES.numAvailable;
        fieldsAdded.push('numAvailable');
      }

      // If there are updates to make
      if (Object.keys(updates).length > 0) {
        try {
          await ref.update(updates);
          
          updateResults.updated.push({
            id,
            name: data.name,
            fieldsAdded,
            previousValues: {
              minByGroup: data.minByGroup,
              maxByGroup: data.maxByGroup,
              numAvailable: data.numAvailable
            },
            newValues: updates
          });

          console.log(`✅ Updated: ${data.name || id}`);
          console.log(`   Added fields: ${fieldsAdded.join(', ')}`);
        } catch (error) {
          updateResults.errors.push({
            id,
            name: data.name,
            error: error.message
          });
          console.error(`❌ Error updating ${id}:`, error.message);
        }
      } else {
        updateResults.skipped.push({
          id,
          name: data.name,
          existingValues: {
            minByGroup: data.minByGroup,
            maxByGroup: data.maxByGroup,
            numAvailable: data.numAvailable
          }
        });
        console.log(`⏭️  Skipped: ${data.name || id} (fields already exist)`);
      }
    }

    console.log('');
    console.log('─'.repeat(50));
    console.log('📊 Update Summary:');
    console.log(`   ✅ Updated: ${updateResults.updated.length}`);
    console.log(`   ⏭️  Skipped: ${updateResults.skipped.length}`);
    console.log(`   ❌ Errors: ${updateResults.errors.length}`);
    console.log('');

    // Save update log
    const updateLog = {
      metadata: {
        executedAt: new Date().toISOString(),
        kitchenId: KITCHEN_ID,
        targetCategory: TARGET_CATEGORY,
        defaultValuesApplied: DEFAULT_VALUES,
        backupFile: BACKUP_FILE
      },
      summary: {
        totalItems: category8Items.length,
        updated: updateResults.updated.length,
        skipped: updateResults.skipped.length,
        errors: updateResults.errors.length
      },
      details: updateResults
    };

    fs.writeFileSync(UPDATE_LOG_FILE, JSON.stringify(updateLog, null, 2));
    console.log(`📄 Update log saved to: ${UPDATE_LOG_FILE}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await admin.app().delete();
  }
}

// Run the script
updateCategory8Defaults();
