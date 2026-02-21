export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return new Response('Only POST allowed', { status: 405 });
    }

    const API_URL = 'https://prime-skud.ru/a/1055042-89ce8100d1c9fce82082a5c481a5f99c';
    const body = await request.text();
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        body: body,
      });
      
      // Возвращаем ответ как есть
      return new Response(response.body, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    } catch (error) {
      return new Response('Error: ' + error.message, { status: 500 });
    }
  }
};
