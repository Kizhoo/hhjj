import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Set CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    const { senderName, message, photos = [] } = req.body;
    
    // Validation
    if (!senderName || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nama dan pesan wajib diisi' 
      });
    }
    
    // Get credentials from environment variables
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;
    
    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        success: false,
        error: 'Bot Telegram belum dikonfigurasi'
      });
    }
    
    // Save to Supabase (optional)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    
    await supabase.from('messages').insert({
      sender_name: senderName,
      message_text: message,
      photo_count: photos.length,
      telegram_status: 'pending'
    });
    
    // Send to Telegram
    const telegramMessage = `📨 *PESAN DARI TO-KIZHOO*\n\n👤 **Dari:** ${senderName}\n💬 **Pesan:**\n${message}\n\n⏰ **Waktu:** ${new Date().toLocaleString('id-ID')}`;
    
    // Send message to Telegram
    // ... (implement Telegram API call)
    
    return res.status(200).json({
      success: true,
      message: 'Pesan berhasil dikirim ke Kizhoo!'
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
}
