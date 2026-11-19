// Copia los recursos estáticos de Cesium (workers, texturas, widgets) a public/cesium.
// Se ejecuta antes de dev y build. La carpeta generada está en .gitignore.
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const origen = join(dirname(require.resolve('cesium/package.json')), 'Build', 'Cesium');
const destino = join(process.cwd(), 'public', 'cesium');

if (!existsSync(destino)) mkdirSync(destino, { recursive: true });
for (const carpeta of ['Workers', 'ThirdParty', 'Assets', 'Widgets']) {
  cpSync(join(origen, carpeta), join(destino, carpeta), { recursive: true });
}
console.log('[ARQEN] Recursos de Cesium copiados a public/cesium');
