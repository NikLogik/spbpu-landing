const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '0.0.0.0';
const port = Number(process.env.PORT) || 3000;
const rootDir = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function resolveFile(urlPath) {
  const pathname = decodeURIComponent(urlPath.split('?')[0]);
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.normalize(path.join(rootDir, requestedPath));

  if (!filePath.startsWith(rootDir)) {
	return null;
  }

  return filePath;
}

const server = http.createServer((request, response) => {
  if (!request.url) {
	response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
	response.end('Bad Request');
	return;
  }

  const filePath = resolveFile(request.url);

  if (!filePath) {
	response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
	response.end('Forbidden');
	return;
  }

  fs.readFile(filePath, (error, data) => {
	if (error) {
	  if (error.code === 'ENOENT') {
		response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
		response.end('Not Found');
		return;
	  }

	  response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
	  response.end('Internal Server Error');
	  return;
	}

	const ext = path.extname(filePath).toLowerCase();
	response.writeHead(200, {
	  'Content-Type': mimeTypes[ext] || 'application/octet-stream'
	});
	response.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`HotelFlow landing is available at http://localhost:${port}`);
});
