
import React, { useState } from 'react';
import './Login.css'; // Crea este archivo para los estilos

function Login() {
	const [email, setEmail] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		// Aquí iría la lógica de autenticación
		alert(`Ingresando con: ${email}`);
	};

	return (
		<div className="login-bg">
			<div className="login-container">
				<div className="login-logo">
					<img src={'/img/Logo.jpg'} alt="Logo Plataforma" style={{ width: '120px', marginBottom: '10px' }} />
					<h2>PLATAFORMA ACADÉMICA<br />PREGRADO</h2>
					<p>Ingrese con su correo UAI</p>
				</div>
				<form onSubmit={handleSubmit} className="login-form">
					<input
						type="email"
						placeholder="correo@uai.cl"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="login-input"
					/>
					<button type="submit" className="login-btn">Ingresar</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
