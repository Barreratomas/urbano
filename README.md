# Urbano Admin - Challenge MVP

Este proyecto es una plataforma de administración de usuarios, cursos y contenidos, desarrollada como parte de la prueba técnica para Urbano.

##  Nuevas Funcionalidades (MVP)

Además de las funcionalidades base, se han implementado las siguientes mejoras:

- **Favoritos**: Los usuarios pueden marcar cursos como favoritos para acceso rápido.
- **Calendario de Cursos**: Visualización de cursos en una agenda mensual basada en sus fechas de inicio y fin.
- **Inscripción a Cursos**: Flujo completo para que los usuarios se inscriban o se den de baja de los cursos.
- **Ranking**: Sistema de votación (estrellas) para calificar los cursos.
- **Soporte Multilenguaje**: Interfaz disponible en Español e Inglés.
- **Sección de Contacto**: Formulario funcional para consultas.
- **Estadísticas Inteligentes**: Dashboard adaptado según el rol del usuario.
- **Seguridad Avanzada**: Verificación de cuenta activa en tiempo real y cierre de sesión automático si la cuenta es deshabilitada.

##  Optimizaciones (Opción A)

- **Manejo de Datos**: Se eliminó el auto-refresco excesivo de `react-query` (1s), implementando botones de refresco manual y carga bajo demanda.
- **Filtrado y Paginación**: Implementación de filtros dinámicos, ordenamiento y paginación desde el servidor para Usuarios, Cursos y Contenidos.
- **Gestión de Multimedia**: Soporte para carga y edición de imágenes en los contenidos de los cursos.

##  Marca Urbano

- **Favicon y Logo**: Integración oficial de la identidad visual de Urbano.
- **Paleta de Colores**: Aplicación de colores corporativos (`#c1292e`, `#ffffff`, `#e2e1e1`).
- **Tipografía**: Uso de Roboto y Nunito Sans en toda la interfaz.
- **UI/UX**: Menú lateral personalizado con fondo de marca y diseño moderno y responsivo.

##  Stack Tecnológico

- **Backend**: NestJS + TypeORM + PostgreSQL
- **Frontend**: React + Tailwind CSS + React Query + Lucide Icons
- **Infraestructura**: Docker & Docker Compose
- **Documentación**: Swagger (API) & Mermaid (ERD)

##  Arquitectura

El sistema utiliza una arquitectura **Multi-Stage Build** para optimizar el tamaño de las imágenes de producción.

- **Frontend**: Servido mediante **Nginx** con configuración de proxy para evitar problemas de CORS y centralizar las peticiones a `/api`.
- **Backend**: Despliegue sobre **Node 18-Alpine**, con separación de dependencias de build y runtime.
- **Base de Datos**: PostgreSQL con volumen persistente.

##  Documentación Adicional

- [**Modelo de Datos (ERD)**](DATABASE_MODEL.md): Detalle de entidades y relaciones.

##  Seeders y Datos de Prueba

El proyecto incluye un sistema de generación de datos automáticos (seeders) para poblar la base de datos durante el desarrollo.

### Comandos de Seeders (desde el host)
```bash
# Poblar la base con datos iniciales
docker exec backend yarn seed

# Limpiar y volver a poblar (reset total)
docker exec backend yarn seed:refresh
```

Las factories generan usuarios (`password123`), cursos y contenidos relacionados de forma automática.

##  QA y Testing

Se han implementado pruebas unitarias para asegurar la integridad de los servicios críticos del backend.

- **Backend Tests**: Ejecución de suites con Jest.
- **Casos de Uso**: Validación de login, filtrado, gestión de multimedia y lógica de negocio.
- **Comando de Tests**:
```bash
docker exec backend yarn test
```

##  Despliegue con Docker

### Modo Producción / MVP (Optimizado)
Para desplegar la aplicación completa con contenedores optimizados:

```bash
docker-compose up -d --build
```

### Modo Desarrollo (Hot Reload)
Si deseas realizar cambios en tiempo real y tener volúmenes activos:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Swagger Docs**: http://localhost:5000/api/docs
- **Adminer (DB Manager)**: http://localhost:8080 (servidor: `database`)

### Credenciales por defecto
- **Usuario**: `admin`
- **Contraseña**: `admin123`

##  Configuración Local

### Backend
1. Navegar a `nest-react-admin/backend`.
2. Instalar dependencias: `npm install` o `yarn`.
3. Configurar `.env` basándose en `.env.example`.
4. Ejecutar: `npm run start:dev`.

### Frontend
1. Navegar a `nest-react-admin/frontend`.
2. Instalar dependencias: `npm install`.
3. Ejecutar: `npm start`.


