# Roadmap Intensivo JavaScript + React 

**Objetivo:** Alcanzar **nivel Semi Senior en teoría JavaScript** y **criterio sólido en React**

Perfil: Dev con base fuerte en **Python**, experiencia previa en **React** (aunque con apoyo de IA)

Dedicación: **3 horas diarias durante 2 semanas**

---

## Estructura diaria (MUY IMPORTANTE)

Cada día se divide siempre igual:

* ⏱ **60 min — JavaScript profundo (modelo mental)**
* ⏱ **60 min — React aplicado con criterio**
* ⏱ **60 min — Ejercicios + explicación (modo entrevista)**

No es solo escribir código: **debes poder explicar cada decisión**.

---

# 🔹 SEMANA 1 — FUNDAMENTOS JS + BASE REACT CORRECTA

---

## 📅 Día 1 — Scope, Hoisting y Strict Mode

### JavaScript (60 min)

* `var`, `let`, `const`
* Scope de bloque / función / módulo
* Hoisting real
* Temporal Dead Zone
* `"use strict"`

### React (60 min)

* Por qué React necesita código sin efectos colaterales
* StrictMode de React (doble render en dev)
* Variables locales vs estado

### Ejercicios (60 min)

```js
{
  console.log(x);
  let x = 10;
}
```

```js
function test() {
  y = 5; // strict?
}
```

```jsx
function Component() {
  let count = 0;
  count++;
  return <p>{count}</p>;
}
```

Explicar **por qué esto está mal en React**.

---

## 📅 Día 2 — Tipos, Coerción y Renderizado

### JavaScript

* Tipos primitivos
* Truthy / Falsy
* `==` vs `===`
* Coerción implícita

### React

* Condicionales en JSX
* Renderizado basado en booleanos

### Ejercicios

```js
false == 0
[] == false
null == undefined
```

```jsx
{value && <Component />}
```

👉 ¿Qué pasa si `value` es `0`?

---

## 📅 Día 3 — Objetos, Referencias e Inmutabilidad

### JavaScript

* Objetos por referencia
* Mutación vs reasignación
* Spread operator

### React

* Por qué NO mutar estado
* Inmutabilidad en `useState`

### 🧪 Ejercicios

```js
const a = { x: 1 };
const b = a;
b.x = 2;
```

```jsx
setUser(user => ({ ...user, age: user.age + 1 }));
```

👉 Explicar por qué esta versión es correcta.

---

## Día 4 — Arrays, Map y Keys

### JavaScript

* `map`, `filter`, `reduce`
* Complejidad básica

### React

* Listas y `key`
* Por qué NO usar índice como key

### Ejercicios

```js
items.map(i => i * 2);
```

```jsx
{items.map((item, i) => (
  <li key={i}>{item}</li>
))}
```

👉 Explicar el problema real.

---

## 📅 Día 5 — Closures, Funciones y Hooks

### JavaScript

* Closures
* Funciones puras
* Arrow functions

### React

* Closures en hooks
* Stale closures

### Ejercicios

```js
function counter() {
  let n = 0;
  return () => ++n;
}
```

```jsx
useEffect(() => {
  setCount(count + 1);
}, []);
```

👉 ¿Por qué es un bug?

---

## 📅 Día 6 — Async, Promises y Effects

### JavaScript

* Promises
* `async / await`
* `try / catch`

### React

* `useEffect` + async
* Cleanup

### Ejercicios

```js
await Promise.resolve(5);
```

```jsx
useEffect(() => {
  fetchData();
}, []);
```

👉 ¿Dónde va el async realmente?

---

## 📅 Día 7 — Event Loop y Render Cycle

### JavaScript

* Call Stack
* Task vs Microtask

### React

* Render vs Commit
* State batching

### Ejercicios

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

```jsx
setCount(c => c + 1);
setCount(c => c + 1);
```

👉 Resultado final.

---

# 🔹 SEMANA 2 — CRITERIO SEMI SENIOR REAL

---

## 📅 Día 8 — Defensive Programming

### JS + React

* Validaciones
* Default params
* Early returns

### Ejercicios

```js
function sum(arr = []) {
  if (!Array.isArray(arr)) return 0;
}
```

---

## 📅 Día 9 — Performance y Re-renders

### JavaScript

* Big O mental

### React

* Re-render innecesario
* `memo`, `useCallback`

### Ejercicios

```jsx
const fn = () => {};
```

👉 ¿Por qué esto rompe memo?

---

## 📅 Día 10 — Memory Model y Closures peligrosas

### JS

* Heap
* Garbage Collector

### React

* Closures que filtran memoria

---

## 📅 Día 11 — Errores reales en producción

* Undefined
* Null
* NaN

### Ejercicios

```js
undefined + 1;
Number.isNaN(NaN);
```

---

## 📅 Día 12 — Clean Code + Arquitectura

* Componentes pequeños
* Separación lógica / UI

---

## 📅 Día 13 — Trampas de entrevista

Checklist:

* Mutaciones ❌
* Closures ❌
* Keys ❌

---

## 📅 Día 14 — Simulación de Entrevista

Debes poder responder:

* ¿Por qué React necesita inmutabilidad?
* ¿Qué es una stale closure?
* ¿Cómo funciona el event loop?

---

✅ **Si completas este roadmap, tendrás criterio teórico de Semi Senior JS + React.**

---

### Recursos BASE (no más de estos)
**1. MDN Web Docs (OBLIGATORIO)**

https://developer.mozilla.org

🟢 Es el estándar profesional
🟢 Neutral, preciso, actual
🟢 El que usan los seniors

Úsalo para:
- Confirmar conceptos
- Ver ejemplos reales
 -Leer definiciones exactas

NO lo leas completo, solo las secciones del día.

**2. JavaScript.info (MODELO MENTAL)**

https://javascript.info

🟢 Excelente para entender por qué
🟢 Ideal viniendo de Python
🟢 Explica trampas y edge cases

Úsalo para:
- Scope
- Closures
- Event loop
- Promises

**3. Libro: You Don’t Know JS (Kyle Simpson)**

(Gratis online)

Lee SOLO:
- Scope & Closures
- Types & Grammar

❌ No todo el libro
❌ No lo leas de corrido

**Recursos React (solo lo necesario)**
React Docs (oficiales)

https://react.dev

Lee con foco en:
- State
- Effects
- StrictMode
- Rendering

---
