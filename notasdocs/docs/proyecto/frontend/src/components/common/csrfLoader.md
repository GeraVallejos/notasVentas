## CSRFLoader

### Qué es

Componente **no visual** que ejecuta un efecto colateral al montarse.

---

### Análisis del Código

```js
useEffect(() => {
  api.get('/csrf/');
}, []);
```

* Se ejecuta una sola vez
* Inicializa cookies CSRF
* Prepara Axios para requests posteriores

```js
return null;
```

* No renderiza UI
* Se usa como inicializador

---