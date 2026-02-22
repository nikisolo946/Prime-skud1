export default {
  async fetch(request, env, ctx) {
    // Единый набор CORS заголовков для любого ответа
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Expose-Headers": "X-Set-Prime-Cookie",
    };

    // 1. Handling CORS Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      const allowedHeaders = request.headers.get("Access-Control-Request-Headers") || "Content-Type, X-Target-Url, X-Prime-Cookie";
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Headers": allowedHeaders,
        },
      });
    }

    try {
      // 2. Read custom headers from the real request
      const targetUrl = request.headers.get("X-Target-Url");
      const primeCookie = request.headers.get("X-Prime-Cookie");

      if (!targetUrl) {
        return new Response("Missing X-Target-Url header", { status: 400, headers: corsHeaders });
      }

      // 3. Prepare headers for prime-skud.ru
      const newHeaders = new Headers();
      newHeaders.set("Content-Type", "application/x-www-form-urlencoded");
      newHeaders.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
      newHeaders.set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
      newHeaders.set("Accept-Language", "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7");

      // Inject our saved cookie as a real cookie!
      if (primeCookie) {
        newHeaders.set("Cookie", primeCookie);
      }

      // 4. Send the payload to prime-skud.ru
      const fetchOptions = {
        method: request.method,
        headers: newHeaders,
        redirect: 'manual'
      };

      if (request.method === "POST" && request.body) {
        fetchOptions.body = await request.text();
      }

      const primeResponse = await fetch(targetUrl, fetchOptions);
      const responseBody = await primeResponse.text();

      // 5. Build our response to the Frontend
      const responseHeaders = new Headers(corsHeaders); // добавляем CORS

      // 6. Intercept Set-Cookie from Server and pass it to Frontend safely
      const setCookieHeader = primeResponse.headers.get("Set-Cookie");
      if (setCookieHeader) {
        const cookieVal = setCookieHeader.split(';')[0];
        responseHeaders.set("X-Set-Prime-Cookie", cookieVal);
      }

      return new Response(responseBody, {
        status: primeResponse.status,
        headers: responseHeaders,
      });

    } catch (error) {
      return new Response('Proxy Error: ' + error.message, {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
