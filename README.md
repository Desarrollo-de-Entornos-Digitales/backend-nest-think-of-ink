# Think of Ink — Backend

API REST para la plataforma **Think of Ink**, una red social de tatuajes donde los artistas pueden publicar sus trabajos, los usuarios pueden explorar por categorías, dar likes, comentar y calificar.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | NestJS 11 |
| Lenguaje | TypeScript |
| ORM | TypeORM |
| Base de datos | PostgreSQL 16 |
| Autenticación | JWT (Passport) |
| Validación | class-validator / class-transformer |
| Archivos | Multer (disk storage local) |
| Contenedor | Docker Compose |

---

## Requisitos previos

- Node.js >= 18
- Docker Desktop (para la base de datos PostgreSQL)
- npm

---

## Instalación y ejecución

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repositorio>
cd backend-nest-think-of-ink
npm install
```

### 2. Iniciar la base de datos

```bash
docker compose up -d
```

Esto levanta PostgreSQL 16 en `localhost:5433` con las credenciales:
- Usuario: `postgres`
- Contraseña: `postgres`
- Base de datos: `mydatabase`

### 3. Configurar variables de entorno

El archivo `.env` ya existe con la configuración por defecto:

```
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=mydatabase
DB_SYNCHRONIZE=true
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
PORT=3001
```

### 4. Iniciar el servidor

```bash
# Desarrollo con recarga automática
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servidor se inicia en `http://localhost:3001`.

### 5. Datos semilla

Al iniciar por primera vez (tablas vacías), el servidor crea automáticamente:

- **8 usuarios** (tatuadores) con contraseña `seed123`
- **7 categorías** de tatuajes
- **8 estudios** de tatuaje
- **15 publicaciones** demo con imágenes

---

## Endpoints de la API

### Autenticación (`/auth`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Registrar nuevo usuario |
| POST | `/auth/login` | — | Iniciar sesión, devuelve JWT |

### Usuarios (`/users`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/users` | — | Listar todos los usuarios |
| GET | `/users/me` | JWT | Obtener perfil propio |
| GET | `/users/profile` | JWT | Perfil propio con conteo de posts |
| PATCH | `/users/profile` | JWT | Actualizar propio perfil |
| PUT | `/users/me` | JWT | Actualizar propio perfil (alias) |
| POST | `/users/avatar` | JWT | Subir avatar (multipart) |
| GET | `/users/:id` | — | Obtener usuario público |
| GET | `/users/:id/profile` | — | Perfil público con posts |
| GET | `/users/:id/posts` | — | Posts de un usuario |
| POST | `/users` | — | Crear usuario (admin) |
| PATCH | `/users/:id` | — | Actualizar usuario (admin) |
| DELETE | `/users/:id` | — | Eliminar usuario (admin) |

### Publicaciones (`/posts`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/posts` | Opcional JWT | Feed principal con filtros `?sort`, `?category`, `?userId` |
| GET | `/posts/recent` | Opcional JWT | Posts recientes |
| GET | `/posts/popular` | Opcional JWT | Posts más likeados |
| GET | `/posts/viral` | Opcional JWT | Posts más comentados |
| GET | `/posts/my-posts` | JWT | Posts del usuario autenticado |
| GET | `/posts/user/:username` | Opcional JWT | Posts por nombre de usuario |
| GET | `/posts/filter-by-price` | Opcional JWT | Filtrar por precio (`?minPrice`, `?maxPrice`) |
| GET | `/posts/:id` | Opcional JWT | Detalle de publicación |
| POST | `/posts` | JWT | Crear publicación (multipart con imagen) |
| PATCH | `/posts/:id` | JWT | Actualizar publicación |
| DELETE | `/posts/:id` | JWT | Eliminar publicación propia |
| GET | `/posts/:id/likes` | JWT | Info de likes de un post |
| POST | `/posts/:id/like` | JWT | Dar/quitar like (toggle) |
| GET | `/posts/:id/comments` | — | Comentarios de un post |
| POST | `/posts/:id/comments` | JWT | Agregar comentario |
| DELETE | `/posts/:id/comments/:commentId` | JWT | Eliminar comentario (autor o admin) |

### Comentarios (`/comments`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/comments` | JWT | Crear comentario |
| GET | `/comments/post/:postId` | — | Obtener comentarios por post |
| DELETE | `/comments/:id` | JWT | Eliminar comentario |

### Likes (`/likes`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/likes/:postId` | JWT | Dar/quitar like (toggle) |
| GET | `/likes/post/:postId` | JWT | Info de likes |

### Categorías (`/categories`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/categories` | — | Listar categorías |
| GET | `/categories/:id` | — | Obtener categoría |
| POST | `/categories` | — | Crear categoría |
| PATCH | `/categories/:id` | — | Actualizar categoría |
| DELETE | `/categories/:id` | — | Eliminar categoría |

### Estudios (`/studios`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/studios` | — | Listar estudios |
| GET | `/studios/price-range` | — | Filtrar por rango de precio |
| GET | `/studios/location` | — | Filtrar por ubicación |
| GET | `/studios/:id` | — | Detalle del estudio |
| GET | `/studios/:id/posts` | — | Posts de un estudio |

### Roles y permisos

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/roles` | — | Listar roles |
| GET | `/roles/:id` | — | Obtener rol |
| POST | `/roles` | — | Crear rol |
| PATCH | `/roles/:id` | — | Actualizar rol |
| DELETE | `/roles/:id` | — | Eliminar rol |
| GET | `/permission` | — | Listar permisos |
| GET | `/permission/:id` | — | Obtener permiso |
| POST | `/permission` | — | Crear permiso |
| PATCH | `/permission/:id` | — | Actualizar permiso |
| DELETE | `/permission/:id` | — | Eliminar permiso |

### Calificaciones (`/ratings`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/ratings` | — | Listar calificaciones |
| GET | `/ratings/:id` | — | Obtener calificación |
| POST | `/ratings` | — | Crear calificación (1-5) |
| PATCH | `/ratings/:id` | — | Actualizar calificación |
| DELETE | `/ratings/:id` | — | Eliminar calificación |

---

## Funcionalidades implementadas

### 1. Autenticación con JWT

El sistema de autenticación utiliza **JSON Web Tokens (JWT)** de forma stateless (sin sesiones en servidor).

**Registro (`POST /auth/register`):**
1. El cliente envía `{ username, email, password }`.
2. Se verifica que el email y username no estén duplicados.
3. Se crea el usuario en la base de datos.
4. Se genera un JWT con `{ sub: user.id, email: user.email }` firmado con una clave secreta.
5. Se devuelve `{ access_token, user }`.

**Inicio de sesión (`POST /auth/login`):**
1. El cliente envía `{ email, password }`.
2. Se busca el usuario por email y se compara la contraseña en texto plano.
3. En caso de éxito, se genera y devuelve el JWT.
4. En caso de fallo, se responde con `401 Unauthorized`.

**Flujo de autenticación:**
- El token JWT se envía en el header `Authorization: Bearer <token>`.
- El guard `JwtAuthGuard` verifica la validez del token en cada petición protegida.
- El guard `OptionalJwtAuthGuard` permite el acceso sin token (asignando `req.user = null`), usado en los feeds de lectura para que usuarios no autenticados puedan navegar.

### 2. Autorización (RBAC)

El proyecto implementa una arquitectura de **Roles y Permisos (RBAC)** con las siguientes entidades:

- **Role**: Define un rol (ej. `admin`, `artist`, `user`) con nombre y descripción.
- **Permission**: Define un permiso atómico (ej. `delete_comment`, `create_post`).
- **Role_perm**: Tabla de unión que asigna permisos a roles.

**Estado actual del RBAC:**
- Las entidades están creadas con sus relaciones (User → Role → Permission vía Role_perm).
- El usuario tiene una relación `@ManyToOne(() => Role)`.
- El único punto donde se verifica un rol es en la eliminación de comentarios: si el usuario tiene rol `admin`, puede eliminar cualquier comentario; de lo contrario, solo los propios.
- Los CRUD de roles, permisos y la tabla de unión están expuestos pero no integrados con guards aún.

### 3. Gestión de estado

**Estado de autenticación:**
- Stateless: no se almacenan sesiones en el servidor.
- El estado se transporta exclusivamente vía JWT en cada petición.
- El token expira en 1 hora; no hay mecanismo de refresh token.

**Estado de la base de datos:**
- TypeORM opera con `synchronize: true`, lo que sincroniza automáticamente el esquema de la base de datos con las entidades al iniciar.
- Esto crea/actualiza tablas sin necesidad de migraciones explícitas durante desarrollo.

**Estado de archivos:**
- Las imágenes subidas (avatares y posts) se almacenan en el sistema de archivos local bajo `uploads/`.
- Se sirven estáticamente mediante `ServeStaticModule` en las rutas `/uploads` y `/uploads/avatars`.

**Estado de likes (toggle):**
- El like funciona como un toggle: `POST /posts/:id/like` busca si existe un `PostLike` con el mismo `user` y `post`.
  - Si existe → se elimina (unlike).
  - Si no existe → se crea (like).
- Esto permite al frontend mantener un estado local simple sin necesidad de lógica de sincronización compleja.

**Estado "likedByCurrentUser" en feeds:**
- Cuando un usuario autenticado solicita el feed de posts, el backend calcula qué posts tienen like del usuario actual.
- `PostService.attachLikedByUser()` consulta todos los likes del usuario y marca cada post con `likedByCurrentUser: true/false`.
- Para usuarios no autenticados, todos los posts tienen `likedByCurrentUser: false`.

### 4. Gestión de publicaciones

- Los posts tienen título, contenido, imagen, rango de precio, ubicación, tipo de post, categoría y estudio asociado.
- El feed principal soporta ordenamiento por recientes, populares (más likes) y virales (más comentarios).
- Los campos `likesCount` y `commentsCount` se calculan mediante `@AfterLoad` a partir de las relaciones cargadas.

### 5. Comentarios

- Los comentarios se asocian a un usuario y un post.
- Validación: contenido obligatorio, máximo 500 caracteres.
- Al crear un comentario, se retorna el usuario sin la contraseña.
- Solo el autor del comentario o un usuario con rol `admin` puede eliminarlo.

### 6. Calificaciones entre usuarios

- Los usuarios pueden calificarse entre sí con una puntuación del 1 al 5.
- La calificación tiene un `@Check` constraint en la base de datos que valida el rango.

### 7. Subida de archivos

- Los avatares y las imágenes de posts se suben mediante formularios multipart.
- Las imágenes se almacenan en disco con nombres únicos basados en timestamp + número aleatorio.
- Límite de tamaño: 10 MB por archivo.
- Formatos permitidos: jpg, jpeg, png, webp.

### 8. Datos semilla

El servidor popula automáticamente la base de datos al primer inicio:

- **UsersService.onModuleInit()**: Crea 8 tatuadores con nombre, profesión, biografía, ciudad y avatar.
- **CategoryService.onModuleInit()**: Crea 7 categorías de tatuajes.
- **StudioService.onModuleInit()**: Crea 8 estudios con dirección, coordenadas, calificación y rango de precio.
- **PostService.onModuleInit()**: Crea 15 publicaciones demo con imágenes, asignando cada una a un usuario, categoría y estudio específicos.

---

## Validación de funcionalidades

### Autenticación

```bash
# Registrar un nuevo usuario
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"123456"}'

# Iniciar sesión con credenciales de seed
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"diegorodriguez@ink.com","password":"seed123"}'
# → Devuelve { access_token, user }

# Acceder a un endpoint protegido
curl http://localhost:3001/posts/my-posts \
  -H "Authorization: Bearer <token>"
```

### Publicaciones

```bash
# Obtener feed principal
curl http://localhost:3001/posts

# Filtrar por categoría
curl "http://localhost:3001/posts?category=Neotradicional"

# Filtrar por precio
curl "http://localhost:3001/posts/filter-by-price?minPrice=50&maxPrice=100"

# Ordenar por populares
curl http://localhost:3001/posts/popular

# Ver detalle de un post
curl http://localhost:3001/posts/1
```

### Likes

```bash
# Dar like (requiere JWT)
curl -X POST http://localhost:3001/posts/1/like \
  -H "Authorization: Bearer <token>"
# → { likesCount: 1, likedByCurrentUser: true }

# Quitar like (misma ruta, comportamiento toggle)
curl -X POST http://localhost:3001/posts/1/like \
  -H "Authorization: Bearer <token>"
# → { likesCount: 0, likedByCurrentUser: false }
```

### Comentarios

```bash
# Crear comentario
curl -X POST http://localhost:3001/posts/1/comments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Excelente trabajo!"}'

# Obtener comentarios de un post
curl http://localhost:3001/posts/1/comments

# Eliminar comentario (solo autor o admin)
curl -X DELETE http://localhost:3001/posts/1/comments/1 \
  -H "Authorization: Bearer <token>"
```

### Usuarios

```bash
# Ver perfil público
curl http://localhost:3001/users/1/profile

# Subir avatar (multipart)
curl -X POST http://localhost:3001/users/avatar \
  -H "Authorization: Bearer <token>" \
  -F "file=@avatar.jpg"

# Actualizar perfil
curl -X PATCH http://localhost:3001/users/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"bio":"Tatuador especialista en blackwork","city":"Medellín"}'
```

### Estudios

```bash
# Listar estudios
curl http://localhost:3001/studios

# Filtrar por ubicación
curl "http://localhost:3001/studios/location?city=Cali"
```

---

## Estructura del proyecto

```
src/
├── main.ts                        # Punto de entrada, configuración global
├── app.module.ts                  # Módulo raíz
├── auth/                          # Autenticación JWT
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts            # Estrategia Passport JWT
│   ├── jwt-auth.guard.ts          # Guard para endpoints protegidos
│   └── optional-jwt.guard.ts      # Guard que permite acceso sin token
├── users/                         # Gestión de usuarios
│   ├── user.entity.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── posts/                         # Publicaciones
│   ├── post.entity.ts
│   ├── post.controller.ts
│   ├── post.service.ts
│   └── dto/
├── comments/                      # Comentarios
│   ├── comment.entity.ts
│   ├── comment.controller.ts
│   ├── comment.service.ts
│   ├── comments.module.ts
│   └── dto/
├── likes/                         # Likes
│   ├── like.entity.ts
│   ├── likes.controller.ts
│   ├── likes.service.ts
│   └── likes.module.ts
├── category/                      # Categorías
├── studio/                        # Estudios
├── roles/                         # Roles (RBAC)
├── permission/                    # Permisos (RBAC)
├── role_perm/                     # Unión rol-permiso
└── ratings/                       # Calificaciones
```
