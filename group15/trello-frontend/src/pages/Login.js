import * as Yup from "yup";
import { Container, TextField, Typography, Link } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { setAuthenticate, setUser } from "../store/slices/user/UserSlice";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import "./Login.css";
import Reset from "./Reset"; // Import the CSS file
import { authenticateUser } from "../store/slices/user/UserThunk";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import storage from "../lib/localStorage";


export default function Login() {
    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email must be a valid email address")
            .required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [passwordIncorrect, setPasswordIncorrect] = useState(false);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            const { email, password } = values;

            dispatch(authenticateUser({
                email,
                password,
            })).then((response) => {
                const { payload } = response;

                console.log(payload);

                if (!payload) {
                    toast.error("Something went wrong! Try again later");
                    return;
                }

                if (payload["status"] !== "SUCCESS") {
                    toast.error(payload["message"]);
                    return;
                }

                const data = payload["data"]
                
                storage.put("token", data)

                dispatch(setAuthenticate(data))

                navigate("/home");
            }).catch((error) => {
                console.log(error);
            });

            /*try {
                setLoading(true);

                // Make the API request to log in the user
                const response = await axios.post("http://localhost:8080/api/user/login", {
                    email,
                    password,
                });

                // Dispatch the user data to the store
                dispatch(setUser(response.data));

                // Redirect to a different page upon successful login
                navigate("/home");
                console.log(response.data);
            } catch (error) {
                // Handle error response
                if (error.response && error.response.data) {
                    console.log(error.response.data);
                    if (error.response.data.message === "Password incorrect") {
                        setPasswordIncorrect(true);
                    }
                } else {
                    console.log("An error occurred:", error.message);
                }
            } finally {
                setLoading(false);
            }*/
        },
    });

    const { errors, touched, handleSubmit, getFieldProps } = formik;

    return (
        <div className="container">
            <div className="content">
                <Typography variant="h3" component="h1" className="title">
                Tasknest
                </Typography>

                <Container>
                    <FormikProvider value={formik}>
                        <Form className="form" autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email"
                                className="field"
                                {...getFieldProps("email")}
                                error={Boolean(touched.email && errors.email)}
                                helperText={touched.email && errors.email}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                className="field"
                                {...getFieldProps("password")}
                                error={Boolean(touched.password && errors.password)}
                                helperText={touched.password && errors.password}
                            />

                            {passwordIncorrect && (
                                <Typography color="error" className="error">
                                    Password incorrect. Please try again or{" "}
                                    <Link component={RouterLink} to="/reset-password" className="link">
                                        reset your password
                                    </Link>
                                    .
                                </Typography>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                className="submit-button"
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                            </Button>
                        </Form>
                    </FormikProvider>
                </Container>

                <Typography>
                    <Link component={RouterLink} to="/Reset" className="link" style={{ color: "#fff" }}>
                        Reset Password
                    </Link>
                </Typography>
                <Typography>
                    Don't have an account?{" "}
                    <Link component={RouterLink} to="/Register" className="link" style={{ color: "#fff" }}>
                        Register
                    </Link>
                </Typography>
            </div>
        </div>
    );
}

