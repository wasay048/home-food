const fs = require('fs');
let content = fs.readFileSync('functions/chefBulkSms.js', 'utf8');

const oldCode = `        const result = await sendOneSms(recipient.phone, smsBody);

        return {
          phone: maskPhone(recipient.phone),
          orderId: recipientOrderId,
          status: "sent",
          sid: result.sid,
        };`;

const newCode = `        const result = await sendSMS({
            to: recipient.phone,
            body: smsBody,
            eventType: 'order_status_update'
        });

        if (!result.sent && result.skippedReason) {
             return {
                phone: maskPhone(recipient.phone),
                orderId: recipientOrderId,
                status: "failed",
                error: result.skippedReason,
            };
        }

        return {
          phone: maskPhone(recipient.phone),
          orderId: recipientOrderId,
          status: "sent",
          sid: result.sid,
        };`;

content = content.replace(oldCode, newCode);

fs.writeFileSync('functions/chefBulkSms.js', content, 'utf8');
console.log("Done");
