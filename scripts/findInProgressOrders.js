/**
 * Script to find all orders that still have "inProgress" status
 * Either at the order level or in orderedFoodItems
 * 
 * Usage: node scripts/findInProgressOrders.js
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, 'inprogress_orders.json');

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

async function findInProgressOrders() {
  console.log('🔍 Finding all orders with "inProgress" status...');
  console.log('');

  try {
    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef.get();
    
    if (snapshot.empty) {
      console.log('❌ No orders found');
      return;
    }

    console.log(`📦 Total orders in collection: ${snapshot.size}`);
    console.log('');

    // Find inProgress orders
    const inProgressOrders = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const orderedFoodItems = data.orderedFoodItems || [];
      
      // Check main order status
      const mainStatusInProgress = data.orderStatus === 'inProgress';
      
      // Check orderedFoodItems status
      const itemsInProgress = orderedFoodItems.filter(
        item => item.orderStatus === 'inProgress'
      );
      
      if (mainStatusInProgress || itemsInProgress.length > 0) {
        // Extract pickup dates for reference
        const pickupDates = [...new Set(
          orderedFoodItems
            .map(item => item.pickupDateString)
            .filter(Boolean)
        )];

        inProgressOrders.push({
          id: doc.id,
          mainOrderStatus: data.orderStatus,
          orderType: data.orderType,
          orderTotalCoast: data.orderTotalCoast,
          pickupDates,
          totalItems: orderedFoodItems.length,
          itemsInProgress: itemsInProgress.length,
          itemNames: orderedFoodItems.map(item => ({
            name: item.name,
            orderStatus: item.orderStatus,
            pickupDateString: item.pickupDateString
          }))
        });
      }
    });

    console.log(`📋 Found ${inProgressOrders.length} orders still "inProgress"`);
    console.log('');

    if (inProgressOrders.length > 0) {
      // Summary
      console.log('─'.repeat(60));
      console.log('📊 Summary of inProgress orders:');
      console.log('');
      
      inProgressOrders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order.id}`);
        console.log(`   Main Status: ${order.mainOrderStatus}`);
        console.log(`   Pickup Dates: ${order.pickupDates.join(', ') || 'N/A'}`);
        console.log(`   Items in Progress: ${order.itemsInProgress}/${order.totalItems}`);
        console.log('');
      });
    }

    // Save to file
    const outputData = {
      metadata: {
        fetchedAt: new Date().toISOString(),
        totalOrdersInCollection: snapshot.size,
        inProgressCount: inProgressOrders.length
      },
      orders: inProgressOrders
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));
    console.log(`💾 Results saved to: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await admin.app().delete();
  }
}

findInProgressOrders();
