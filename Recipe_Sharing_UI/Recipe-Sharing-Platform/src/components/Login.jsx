// import { useState } from "react";
// import axios from "axios";
// // import { Link } from "react-router-dom";
// import styles from "./Login.module.css";

// const Login = () => {
// 	const [data, setData] = useState({ email: "", password: "" });
// 	const [error, setError] = useState("");

// 	const handleChange = ({ currentTarget: input }) => {
// 		setData({ ...data, [input.name]: input.value });
// 	};

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		try {
// 			const url = "http://localhost:3000/api/auth";
// 			const { data: res } = await axios.post(url, data);
// 			localStorage.setItem("token", res.data);
// 			window.location = "/";
// 		} catch (error) {
// 			if (
// 				error.response &&
// 				error.response.status >= 400 &&
// 				error.response.status <= 500
// 			) {
// 				setError(error.response.data.message);
// 			}
// 		}
// 	};

// 	return (
// 		<div className={styles.login_container}>
// 			<div className={styles.login_form_container}>
// 				<div className={styles.left}>
// 					<form className={styles.form_container} onSubmit={handleSubmit}>
// 						<h1>Login to Your Account</h1>
// 						<input
// 							type="email"
// 							placeholder="Email"
// 							name="email"
// 							onChange={handleChange}
// 							value={data.email}
// 							required
// 							className={styles.input}
// 						/>
// 						<input
// 							type="password"
// 							placeholder="Password"
// 							name="password"
// 							onChange={handleChange}
// 							value={data.password}
// 							required
// 							className={styles.input}
// 						/>
// 						{error && <div className={styles.error_msg}>{error}</div>}
// 						<button type="submit" className={styles.green_btn}>
// 							Sing In
// 						</button>
// 					</form>
// 				</div>
// 				<div className={styles.right}>
// 					<h1>New Here ?</h1>
// 					<a to="/signup">
// 						<button type="button" className={styles.white_btn}>
// 							Sing Up
// 						</button>
// 					</a>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Login;

import  { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, FormHelperText } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
				e.preventDefault();
				try {
					const data={email,password};
					const url = "http://localhost:3000/api/auth";
					const { data: res } = await axios.post(url, data);
					localStorage.setItem("token", res.data);
					navigate("/main");
				} catch (error) {
					if (
						error.response &&
						error.response.status >= 400 &&
						error.response.status <= 500
					) {
						setError(error.response.data.message);
					}
				}
			};


  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
						<FormHelperText error>{error}</FormHelperText>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2, borderRadius: 1 }}
            >
              Login
            </Button>
            <Button component={Link} to="/signup" fullWidth color="secondary">
              Don't have an account? Sign Up
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;


