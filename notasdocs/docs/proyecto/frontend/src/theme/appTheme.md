### Propósito

El componente `AppTheme` actúa como un proveedor global de tema para la aplicación. Su responsabilidad es encapsular toda la interfaz dentro de un `ThemeProvider` de Material UI, garantizando consistencia visual, tipográfica y de estilos base en todos los componentes.

### Implementación

```tsx
const AppTheme = ({ children }) => {
  return (
    <ThemeProvider theme={themeJJ}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
```

* `ThemeProvider`: inyecta el objeto de tema personalizado (`themeJJ`) en el árbol de componentes.
* `CssBaseline`: normaliza estilos CSS entre navegadores y aplica valores base coherentes con el tema.
* `children`: representa la aplicación completa o subárboles que deben heredar el tema.

Este componente suele utilizarse en el punto más alto de la aplicación (por ejemplo, en `main.jsx` o `App.jsx`).

---



