# 📝 TODO - Seguimiento del Proyecto

Este archivo resume dónde nos quedamos y cuáles son los siguientes pasos críticos para la orquestación del desarrollo de la App React Native y el Backend Laravel.

---

## 🚩 ESTADO ACTUAL (Actualizado: 17 Marzo 2026)
- **Código Local:** Preparado en `c:\MeegDev\kconecta-ag`.
- **Backend (Laravel):**
  - Creado controlador de autenticación (`AuthController`) con endpoints `login` y `logout`.
  - Configurado Laravel Sanctum para generar tokens de acceso para la app móvil.
  - Orquestador de IA local (Ollama) validado y funcionando (comunicación directa con Mistral desde el móvil).
- **Frontend Móvil (React Native/Expo):**
  - Inicializado proyecto Expo (`mobile/`).
  - Instalado y activado Node 22.14.0 en el entorno para dar soporte a Expo 55.
  - Configurado cliente API (`api/client.js`) para conectarse a la IP de la máquina local (`192.168.1.88:8010`).
  - Pantalla principal con el Chat de Mistral validada, renderizando exitosamente en el Emulador de Android.

---

## 🛠️ PENDIENTES INMEDIATOS (Próxima Sesión)

### 0. Optimización de Entorno de Desarrollo (IA Local)
- [ ] Instalar agente de desarrollo autómata en el IDE (ej. Roo Code, Cline, Continue.dev).
- [ ] Conectarlo al endpoint local de Ollama configurado en Docker (`http://localhost:11434`).
- [ ] Usar el modelo `deepseek-coder` para continuar el desarrollo local con 0 coste de tokens externos.

### 🔴 BUG CRÍTICO - (Paso Inmediato para el Nuevo Agente)
- [ ] **La App No Carga en el Emulador de Android:** A pesar de haberse configurado la redirección y limpiado la caché (`npx expo start -c`), la pantalla se queda colgada o en blanco sin llegar jamás a renderizar la vista de `login.js`.
- [ ] **Acción Requerida:** Investigar los logs del Metro Bundler o deshacer temporalmente el archivo `mobile/app/_layout.js` utilizando un layout básico o usando el `RootNav` oficial de Expo Router para diagnosticar por qué la vista principal no logra montarse en el UI de Android.

### 1. Sistema de Autenticación App Móvil (Prioridad Alta)
- [x] Resolver conflictos menores de dependencias en `npm` (`ERESOLVE` con react/react-dom) para poder instalar paquetes adicionales limpios.
- [x] Instalar `expo-secure-store` para guardar de forma segura el token `Bearer` proporcionado por Laravel Sanctum.
- [x] Crear la pantalla/formulario de **Login** (`LoginScreen.js`).
- [x] Configurar un iterceptor en `api/client.js` con Axios, para adjuntar el token automáticamente en todas las peticiones protegidas.

### 2. Navegación y Estructura Móvil
- [x] Configurar Expo Router con una jerarquía de pantallas segura (Si está logueado -> va a Tabs (Inicio/Mapa/Perfil), si no -> va a Login).
- [ ] Implementar la pantalla de visualización de Propiedades (`home/feed` interactivo).

### 3. Ajustes de Backend (Secundarios)
- [ ] Verificar la base de datos MySQL en el entorno Docker (que realmente existan usuarios listos para testear el login).
- [x] Comprobar que en el `User` model esté activado el trait `@HasApiTokens`.

---
*Fin de la sesión.*
