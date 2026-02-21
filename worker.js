// Cloudflare Workers код для прокси
// Разместить на: https://workers.cloudflare.com/

export default {
  async fetch(request, env) {
    // Разрешаем только POST запросы
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const API_URL = 'https://prime-skud.ru/a/1055042-89ce8100d1c9fce82082a5c481a5f99c';
    
    // Получаем данные из запроса
    const body = await request.text();
    
    // Отправляем запрос на сервер ПРАЙМ СКУД
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: body,
    });
    
    // Возвращаем ответ
    return new Response(await response.text(), {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
};
