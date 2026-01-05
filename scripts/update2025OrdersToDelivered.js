/**
 * Script to find all orders from 2025 and update orderStatus to "delivered"
 * 
 * Criteria for identifying 2025 orders:
 * - orderedFoodItems[].pickupDateString contains "2025"
 * - OR orderedFoodItems[].pickupDate is in year 2025
 * 
 * Usage: node scripts/update2025OrdersToDelivered.js
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const NEW_ORDER_STATUS = 'delivered';

// File paths
const BACKUP_DIR = path.join(__dirname, 'backups');
const BACKUP_FILE = path.join(BACKUP_DIR, `orders_2025_backup_${Date.now()}.json`);
const UPDATE_LOG_FILE = path.join(__dirname, 'orders_2025_update_log.json');

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

/**
 * Check if an order belongs to 2025 based on orderedFoodItems
 */
function isOrder2025(orderData) {
  const orderedFoodItems = orderData.orderedFoodItems || [];
  
  for (const item of orderedFoodItems) {
    // Method 1: Check pickupDateString (format: "MM,DD,YYYY" like "12,19,2025")
    if (item.pickupDateString && typeof item.pickupDateString === 'string') {
      if (item.pickupDateString.includes('2025')) {
        return true;
      }
    }
    
    // Method 2: Check pickupDate (Firestore Timestamp)
    if (item.pickupDate) {
      let date;
      
      // Handle Firestore Timestamp
      if (item.pickupDate.toDate && typeof item.pickupDate.toDate === 'function') {
        date = item.pickupDate.toDate();
      } else if (item.pickupDate._seconds) {
        // Handle serialized timestamp
        date = new Date(item.pickupDate._seconds * 1000);
      } else if (item.pickupDate instanceof Date) {
        date = item.pickupDate;
      }
      
      if (date && date.getFullYear() === 2025) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Extract pickup date info for logging
 */
function getPickupDateInfo(orderData) {
  const orderedFoodItems = orderData.orderedFoodItems || [];
  const pickupDates = [];
  
  for (const item of orderedFoodItems) {
    if (item.pickupDateString) {
      pickupDates.push(item.pickupDateString);
    }
  }
  
  return [...new Set(pickupDates)]; // Return unique dates
}

async function update2025OrdersToDelivered() {
  console.log('🚀 Starting 2025 orders update...');
  console.log(`📊 New orderStatus: "${NEW_ORDER_STATUS}"`);
  console.log('');

  try {
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Get all orders
    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef.get();
    
    if (snapshot.empty) {
      console.log('❌ No orders found');
      return;
    }

    console.log(`📦 Total orders in collection: ${snapshot.size}`);
    console.log('🔍 Scanning for 2025 orders...');
    console.log('');

    // Find 2025 orders
    const orders2025 = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      if (isOrder2025(data)) {
        orders2025.push({
          id: doc.id,
          ref: doc.ref,
          data: data
        });
      }
    });

    console.log(`📅 Found ${orders2025.length} orders from 2025`);
    console.log('');

    if (orders2025.length === 0) {
      console.log('✅ No 2025 orders to update');
      return;
    }

    // Create backup
    console.log('💾 Creating backup...');
    const backupData = {
      metadata: {
        totalOrdersInCollection: snapshot.size,
        orders2025Count: orders2025.length,
        backupCreatedAt: new Date().toISOString(),
        updateField: 'orderStatus',
        newValue: NEW_ORDER_STATUS
      },
      orders: orders2025.map(order => ({
        id: order.id,
        previousOrderStatus: order.data.orderStatus,
        orderType: order.data.orderType,
        orderTotalCoast: order.data.orderTotalCoast,
        pickupDates: getPickupDateInfo(order.data),
        orderedFoodItemsCount: (order.data.orderedFoodItems || []).length
      }))
    };

    fs.writeFileSync(BACKUP_FILE, JSON.stringify(backupData, null, 2));
    console.log(`✅ Backup saved to: ${BACKUP_FILE}`);
    console.log('');

    // Update orders
    console.log('🔄 Updating orderStatus to "delivered"...');
    console.log('');

    const updateResults = {
      updated: [],
      skipped: [],
      errors: []
    };

    for (const order of orders2025) {
      const { id, ref, data } = order;
      const previousStatus = data.orderStatus;
      const pickupDates = getPickupDateInfo(data);

      // Skip if already delivered
      if (previousStatus === 'delivered') {
        updateResults.skipped.push({
          id,
          reason: 'Already delivered',
          pickupDates
        });
        console.log(`⏭️  Skipped: ${id} (already delivered)`);
        continue;
      }

      try {
        await ref.update({ orderStatus: NEW_ORDER_STATUS });
        
        updateResults.updated.push({
          id,
          previousStatus,
          newStatus: NEW_ORDER_STATUS,
          pickupDates,
          orderType: data.orderType,
          itemsCount: (data.orderedFoodItems || []).length
        });

        console.log(`✅ Updated: ${id}`);
        console.log(`   Status: "${previousStatus}" → "${NEW_ORDER_STATUS}"`);
        console.log(`   Pickup dates: ${pickupDates.join(', ')}`);
      } catch (error) {
        updateResults.errors.push({
          id,
          error: error.message
        });
        console.error(`❌ Error updating ${id}:`, error.message);
      }
    }

    console.log('');
    console.log('─'.repeat(50));
    console.log('📊 Update Summary:');
    console.log(`   📅 Total 2025 orders found: ${orders2025.length}`);
    console.log(`   ✅ Updated: ${updateResults.updated.length}`);
    console.log(`   ⏭️  Skipped (already delivered): ${updateResults.skipped.length}`);
    console.log(`   ❌ Errors: ${updateResults.errors.length}`);
    console.log('');

    // Save update log
    const updateLog = {
      metadata: {
        executedAt: new Date().toISOString(),
        totalOrdersInCollection: snapshot.size,
        orders2025Found: orders2025.length,
        newOrderStatus: NEW_ORDER_STATUS,
        backupFile: BACKUP_FILE
      },
      summary: {
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

update2025OrdersToDelivered();
