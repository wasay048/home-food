/**
 * Script to update orderStatus inside orderedFoodItems array for orders before 2026
 * 
 * This script:
 * 1. Finds all orders where pickup is before 1/1/2026
 * 2. Updates orderStatus to "delivered" inside each orderedFoodItems object
 * 
 * Usage: node scripts/updateOrderedFoodItemsStatus.js
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const NEW_ORDER_STATUS = 'delivered';
const CUTOFF_DATE = new Date('2026-01-01T00:00:00Z');

// File paths
const BACKUP_DIR = path.join(__dirname, 'backups');
const BACKUP_FILE = path.join(BACKUP_DIR, `orderedFoodItems_status_backup_${Date.now()}.json`);
const UPDATE_LOG_FILE = path.join(__dirname, 'orderedFoodItems_status_update_log.json');

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
 * Check if an order is before 2026 based on orderedFoodItems
 */
function isOrderBefore2026(orderData) {
  const orderedFoodItems = orderData.orderedFoodItems || [];
  
  for (const item of orderedFoodItems) {
    // Method 1: Check pickupDateString (format: "MM,DD,YYYY" or "MM/DD/YYYY")
    if (item.pickupDateString && typeof item.pickupDateString === 'string') {
      // Parse various formats: "12,19,2025" or "12/19/2025"
      const parts = item.pickupDateString.split(/[,\/]/);
      if (parts.length === 3) {
        const year = parseInt(parts[2], 10);
        if (year < 2026) {
          return true;
        }
      }
    }
    
    // Method 2: Check pickupDate (Firestore Timestamp)
    if (item.pickupDate) {
      let date;
      
      if (item.pickupDate.toDate && typeof item.pickupDate.toDate === 'function') {
        date = item.pickupDate.toDate();
      } else if (item.pickupDate._seconds) {
        date = new Date(item.pickupDate._seconds * 1000);
      } else if (item.pickupDate instanceof Date) {
        date = item.pickupDate;
      }
      
      if (date && date < CUTOFF_DATE) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if any item in orderedFoodItems needs status update
 */
function needsStatusUpdate(orderData) {
  const orderedFoodItems = orderData.orderedFoodItems || [];
  
  for (const item of orderedFoodItems) {
    if (item.orderStatus && item.orderStatus !== NEW_ORDER_STATUS) {
      return true;
    }
  }
  
  return false;
}

/**
 * Update orderStatus in all orderedFoodItems to "delivered"
 */
function updateOrderedFoodItemsStatus(orderedFoodItems) {
  return orderedFoodItems.map(item => ({
    ...item,
    orderStatus: NEW_ORDER_STATUS
  }));
}

async function updateOrderedFoodItemsStatusToDelivered() {
  console.log('🚀 Starting orderedFoodItems status update...');
  console.log(`📊 New orderStatus: "${NEW_ORDER_STATUS}"`);
  console.log(`📅 Cutoff date: Before ${CUTOFF_DATE.toISOString()}`);
  console.log('');

  try {
    // Create backup directory if needed
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
    console.log('🔍 Scanning for orders before 2026 with items needing update...');
    console.log('');

    // Find orders that need update
    const ordersToUpdate = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      if (isOrderBefore2026(data) && needsStatusUpdate(data)) {
        ordersToUpdate.push({
          id: doc.id,
          ref: doc.ref,
          data: data
        });
      }
    });

    console.log(`📅 Found ${ordersToUpdate.length} orders needing orderedFoodItems status update`);
    console.log('');

    if (ordersToUpdate.length === 0) {
      console.log('✅ No orders to update');
      return;
    }

    // Create backup
    console.log('💾 Creating backup...');
    const backupData = {
      metadata: {
        totalOrdersInCollection: snapshot.size,
        ordersToUpdateCount: ordersToUpdate.length,
        backupCreatedAt: new Date().toISOString(),
        updateField: 'orderedFoodItems[].orderStatus',
        newValue: NEW_ORDER_STATUS
      },
      orders: ordersToUpdate.map(order => ({
        id: order.id,
        mainOrderStatus: order.data.orderStatus,
        orderedFoodItems: order.data.orderedFoodItems.map(item => ({
          name: item.name,
          previousOrderStatus: item.orderStatus,
          pickupDateString: item.pickupDateString
        }))
      }))
    };

    fs.writeFileSync(BACKUP_FILE, JSON.stringify(backupData, null, 2));
    console.log(`✅ Backup saved to: ${BACKUP_FILE}`);
    console.log('');

    // Update orders
    console.log('🔄 Updating orderStatus in orderedFoodItems...');
    console.log('');

    const updateResults = {
      updated: [],
      errors: []
    };

    for (const order of ordersToUpdate) {
      const { id, ref, data } = order;

      try {
        // Update orderedFoodItems array with new status
        const updatedFoodItems = updateOrderedFoodItemsStatus(data.orderedFoodItems);
        
        await ref.update({ orderedFoodItems: updatedFoodItems });
        
        const itemsUpdated = data.orderedFoodItems.filter(
          item => item.orderStatus !== NEW_ORDER_STATUS
        ).length;

        updateResults.updated.push({
          id,
          itemsUpdated,
          totalItems: data.orderedFoodItems.length
        });

        console.log(`✅ Updated: ${id} (${itemsUpdated}/${data.orderedFoodItems.length} items)`);
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
    console.log(`   📦 Orders updated: ${updateResults.updated.length}`);
    console.log(`   🍽️  Total items updated: ${updateResults.updated.reduce((sum, o) => sum + o.itemsUpdated, 0)}`);
    console.log(`   ❌ Errors: ${updateResults.errors.length}`);
    console.log('');

    // Save update log
    const updateLog = {
      metadata: {
        executedAt: new Date().toISOString(),
        totalOrdersInCollection: snapshot.size,
        ordersUpdated: ordersToUpdate.length,
        newOrderStatus: NEW_ORDER_STATUS,
        backupFile: BACKUP_FILE
      },
      summary: {
        ordersUpdated: updateResults.updated.length,
        totalItemsUpdated: updateResults.updated.reduce((sum, o) => sum + o.itemsUpdated, 0),
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

updateOrderedFoodItemsStatusToDelivered();
