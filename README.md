# Editor de la Revista Container

Página para armar la revista semanal sin depender de Claude ni de la Mac.

**Abrir:** https://containerar.github.io/container-editor/

- Los datos de cada edición viven en el repo privado `ContainerAr/container-notas` (`revista/ediciones/<número>/edicion.yaml`).
- El editor los lee y guarda con la API de GitHub y dispara la acción «Armar revista».
- Necesita una clave (token *fine-grained* de GitHub con acceso solo a `container-notas`, permisos Contents y Actions en *Read and write*). Se pega en el botón «Clave» y queda guardada solo en ese navegador.

Esta página no contiene datos ni claves: es pública a propósito para poder alojarla en GitHub Pages.
