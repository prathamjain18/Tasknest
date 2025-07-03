import { useState } from 'react';
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Form, FormikProvider, useFormik } from "formik";
import axios from 'axios';
import { Button, Container, TextField, Typography, Paper, Box } from '@mui/material';

export default function BoardCreation({ workspaceID }) {
    const BoardCreationSchema = Yup.object().shape({
        boardName: Yup.string().required(
            "The name of the workspace is required"
        ),
    });

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            boardName: "",
        },

        validationSchema: BoardCreationSchema,
        onSubmit: async (values) => {
            const { boardName } = values;

            try {
                const response = await axios.post(`http://localhost:8080/api/user/workspace/${workspaceID}/boards/save`, {
                    boardName,
                });

                navigate(`/workspace/${workspaceID}`);
                console.log(response.data)
            } catch (error) {
                console.log("An error occurred:", error.message);
            }
        }
    });

    const { errors, touched, handleSubmit, getFieldProps } = formik;

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #f7fafc 0%, #e3f0ff 100%)' }}>
            <Paper elevation={6} sx={{ borderRadius: 4, p: 4, minWidth: 370, maxWidth: 400, width: '100%', boxShadow: '0 4px 32px rgba(25, 118, 210, 0.10)' }}>
                <Typography variant="h5" component="h1" fontWeight={700} color="primary" gutterBottom align="center">
                    Create Board
                </Typography>
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <TextField
                            label="Board Name"
                            fullWidth
                            margin="normal"
                            {...getFieldProps("boardName")}
                            error={Boolean(touched.boardName && errors.boardName)}
                            helperText={touched.boardName && errors.boardName}
                            sx={{ mb: 2, borderRadius: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{ borderRadius: 3, fontWeight: 700, py: 1, px: 3 }}
                        >
                            Create
                        </Button>
                    </Form>
                </FormikProvider>
            </Paper>
        </Box>
    )
}