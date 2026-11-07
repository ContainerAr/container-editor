# Editor de la Revista Container

Página para armar la revista semanal escribiendo directo sobre las páginas, sin depender de Claude ni de la Mac.

**Abrir:** https://containerar.github.io/container-editor/ (la primera vez pide crear una clave; después se usa el link privado que la trae adentro).

- Muestra la revista página por página con la misma maqueta que el generador (`vista.js` es la copia en JavaScript de `revista/generador/plantillas.py`). Si se cambian medidas allá, hay que cambiarlas acá.
- Los datos de cada edición viven en el repo privado `ContainerAr/container-notas` (`revista/ediciones/<número>/edicion.yaml`). El editor los lee y guarda con la API de GitHub y dispara las acciones «Armar revista» y «Leer notas de la web».
- `recursos/`: tipografías (Oswald y Roboto, licencias libres), logos y créditos para la vista previa.

Esta página no contiene datos ni claves: es pública a propósito para poder alojarla en GitHub Pages.
