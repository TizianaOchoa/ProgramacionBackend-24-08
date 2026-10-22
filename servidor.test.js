import test from "node:test";
import assert from "node:assert";
import { createServer } from "node:http";
import "./servidor.js";

test("GET /info debe retornar la información de la aplicación con estado 200", async () => {
  
  const servidor = createServer((solicitud, respuesta) => {
    respuesta.setHeader("Content-Type", "application/json; charset=utf-8");
    
    if (solicitud.method === "GET" && solicitud.url === "/salud") {
      respuesta.writeHead(200);
      respuesta.end(JSON.stringify({ estado: "ok" }));
      return;
    }

    if (solicitud.method === "GET" && solicitud.url === "/info") {
      respuesta.writeHead(200);
      respuesta.end(
        JSON.stringify({
          app: "Servidor Nativo XP",
          version: "1.0.0"
        })
      );
      return;
    }

    respuesta.writeHead(404);
    respuesta.end(JSON.stringify({ error: "Recurso no encontrado" }));
  });

  await new Promise((resolve) => servidor.listen(0, resolve));
  const puertoPrueba = servidor.address().port;

  try {
    const res = await fetch(`http://localhost:${puertoPrueba}/info`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.app, "Servidor Nativo XP");
  } finally {
    await new Promise((resolve) => servidor.close(resolve));
  }
});