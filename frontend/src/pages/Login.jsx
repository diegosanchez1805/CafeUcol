import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

  .login-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #1a0a00;
    overflow: hidden;
    position: relative;
  }

  /* Panel izquierdo decorativo */
  .login-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 60px;
    position: relative;
    background: linear-gradient(145deg, #2d1200 0%, #1a0a00 60%);
  }

  .login-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 30%, rgba(210, 120, 30, 0.18) 0%, transparent 55%),
      radial-gradient(circle at 80% 80%, rgba(180, 80, 10, 0.12) 0%, transparent 50%);
  }

  .coffee-rings {
    position: absolute;
    top: 60px;
    right: -30px;
    opacity: 0.07;
  }

  .ring {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    border: 28px solid #d97c2a;
    position: absolute;
  }
  .ring:nth-child(2) { top: 80px; left: 60px; width: 160px; height: 160px; border-width: 18px; opacity: 0.6; }
  .ring:nth-child(3) { top: -30px; left: 130px; width: 100px; height: 100px; border-width: 12px; opacity: 0.4; }

  .brand-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #d97c2a;
    margin-bottom: 20px;
    position: relative;
  }

  .brand-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(42px, 5vw, 68px);
    color: #f5e6d0;
    line-height: 1.05;
    margin: 0 0 24px;
    position: relative;
  }

  .brand-title span {
    color: #d97c2a;
  }

  .brand-desc {
    font-size: 15px;
    color: #a07858;
    font-weight: 300;
    line-height: 1.7;
    max-width: 320px;
    position: relative;
  }

  .steam-lines {
    position: absolute;
    bottom: 80px;
    left: 60px;
    display: flex;
    gap: 10px;
    opacity: 0.15;
  }

  .steam {
    width: 2px;
    background: linear-gradient(to top, transparent, #d97c2a);
    border-radius: 2px;
    animation: steam 3s ease-in-out infinite;
  }
  .steam:nth-child(1) { height: 60px; animation-delay: 0s; }
  .steam:nth-child(2) { height: 90px; animation-delay: 0.4s; }
  .steam:nth-child(3) { height: 70px; animation-delay: 0.8s; }

  @keyframes steam {
    0%, 100% { transform: translateY(0) scaleX(1); opacity: 0.15; }
    50% { transform: translateY(-12px) scaleX(1.3); opacity: 0.3; }
  }

  /* Panel derecho – formulario */
  .login-right {
    width: 420px;
    min-width: 360px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 48px;
    background: #fdf6ee;
    position: relative;
  }

  .login-right::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #d97c2a, #f0a84a, #d97c2a);
  }

  .form-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: #1a0a00;
    margin: 0 0 6px;
  }

  .form-subtitle {
    font-size: 13px;
    color: #9a7a60;
    margin: 0 0 36px;
    font-weight: 300;
  }

  .field-group {
    margin-bottom: 20px;
  }

  .field-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #7a5c42;
    margin-bottom: 8px;
  }

  .field-wrapper {
    position: relative;
  }

  .field-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #c4956a;
    font-size: 16px;
    pointer-events: none;
  }

  .field-input {
    width: 100%;
    box-sizing: border-box;
    padding: 13px 16px 13px 42px;
    background: #fff8f0;
    border: 1.5px solid #e8d5c0;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1a0a00;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .field-input:focus {
    border-color: #d97c2a;
    box-shadow: 0 0 0 3px rgba(217, 124, 42, 0.12);
  }

  .field-input::placeholder {
    color: #c4a882;
  }

  .eye-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #c4956a;
    font-size: 15px;
    padding: 0;
    line-height: 1;
  }

  .error-msg {
    background: #fff0ea;
    border: 1px solid #f5c4a8;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: #c0440a;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-login {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #d97c2a 0%, #c06818 100%);
    color: #fff8f0;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
  }

  .btn-login:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(217, 124, 42, 0.35);
  }

  .btn-login:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-login:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-login .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
    color: #c4a882;
    font-size: 12px;
  }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e8d5c0;
  }

  .register-row {
    text-align: center;
    font-size: 13px;
    color: #9a7a60;
  }

  .register-row a {
    color: #d97c2a;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
  }

  .register-row a:hover {
    text-decoration: underline;
  }

  /* Modo registro */
  .register-form-extra {
    animation: fadeSlide 0.3s ease;
  }

  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Responsive */
  @media (max-width: 700px) {
    .login-left { display: none; }
    .login-right { width: 100%; min-width: unset; padding: 48px 28px; }
  }
`;

export default function Login({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (mode === "register" && !form.nombre) {
      setError("Ingresa tu nombre.");
      return;
    }

    setLoading(true);
    try {
      // Se adapta el endpoint apuntando al subdominio correcto de Railway usado en el carrito
      const urlBase = "https://cafeucolback-production.up.railway.app";
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { nombre: form.nombre, email: form.email, password: form.password };

      const res = await fetch(`${urlBase}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al procesar la solicitud.");
      } else {
        if (data.token) localStorage.setItem("token", data.token);
        if (data.usuario) localStorage.setItem("usuario", JSON.stringify(data.usuario));
        if (onLoginSuccess) onLoginSuccess(data.usuario || data);
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        {/* Panel izquierdo */}
        <div className="login-left">
          <div className="coffee-rings">
            <div className="ring" />
            <div className="ring" />
            <div className="ring" />
          </div>

          <p className="brand-label">Cafetería Universitaria</p>
          <h1 className="brand-title">
            Cafe<span>ucol</span>
          </h1>
          <p className="brand-desc">
            Tu cafetería de confianza. Pide tu desayuno, almuerzo o snack
            favorito sin filas, sin esperas.
          </p>

          <div className="steam-lines">
            <div className="steam" />
            <div className="steam" />
            <div className="steam" />
          </div>
        </div>

        {/* Panel derecho – formulario */}
        <div className="login-right">
          <h2 className="form-title">
            {mode === "login" ? "Bienvenido" : "Crear cuenta"}
          </h2>
          <p className="form-subtitle">
            {mode === "login"
              ? "Ingresa con tu cuenta universitaria"
              : "Regístrate para empezar a pedir"}
          </p>

          {/* Campo nombre (solo registro) */}
          {mode === "register" && (
            <div className="field-group register-form-extra">
              <label className="field-label">Nombre</label>
              <div className="field-wrapper">
                <span className="field-icon">👤</span>
                <input
                  className="field-input"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={form.nombre}
                  onChange={handleChange}
                  onKeyDown={handleKey}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="field-group">
            <label className="field-label">Correo</label>
            <div className="field-wrapper">
              <span className="field-icon">✉️</span>
              <input
                className="field-input"
                name="email"
                type="email"
                placeholder="correo@ucol.mx"
                value={form.email}
                onChange={handleChange}
                onKeyDown={handleKey}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="field-group">
            <label className="field-label">Contraseña</label>
            <div className="field-wrapper">
              <span className="field-icon">🔒</span>
              <input
                className="field-input"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                onKeyDown={handleKey}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                className="eye-toggle"
                onClick={() => setShowPass((v) => !v)}
                type="button"
                aria-label="Mostrar/ocultar contraseña"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="error-msg">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Botón */}
          <button
            className="btn-login"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <span className="spinner" />}
            {loading
              ? "Procesando..."
              : mode === "login"
              ? "Iniciar sesión"
              : "Registrarme"}
          </button>

          <div className="divider">o</div>

          <p className="register-row">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <a onClick={() => { setMode("register"); setError(""); }}>
                  Regístrate
                </a>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <a onClick={() => { setMode("login"); setError(""); }}>
                  Inicia sesión
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}