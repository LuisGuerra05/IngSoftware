import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const UAI_REGEX = /^[a-z0-9._%+-]+@alumnos\.uai\.cl$/i;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // <- usaremos este texto

  const emailValid = UAI_REGEX.test(email);
  const pwdValid = password.length >= 6;
  const formValid = emailValid && pwdValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setErrorMsg('');
    if (!formValid) return;

    try {
      setLoading(true);
      const API_URL =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:4000/api/login'
          : '/api/login';

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.token) {
        // toma el mensaje del backend si viene; si no, usa uno genérico
        throw new Error(data?.error || 'Correo o contraseña incorrecta');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-logo">
          <img src="/img/Logo.jpg" alt="Logo Plataforma" style={{ width: '120px', marginBottom: '10px' }} />
          <h2>PLATAFORMA ACADÉMICA<br />PREGRADO</h2>
          <p>Ingrese con su correo UAI</p>
        </div>

        <Form onSubmit={handleSubmit} noValidate className="login-form">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="usuario@alumnos.uai.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              isInvalid={touched.email && !emailValid}
              required
            />
            <Form.Control.Feedback type="invalid">
              Ingresa un correo válido @alumnos.uai.cl
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              isInvalid={touched.password && !pwdValid}
              required
            />
          </Form.Group>

          {/* Mensaje general de error del backend */}
            {errorMsg && (
            <Alert variant="danger" className="mb-3" role="alert">
                {errorMsg}
            </Alert>
            )}

          <Button type="submit" className="login-btn" disabled={!formValid || loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </Form>
        
      </div>
    </div>
  );
}

export default Login;
