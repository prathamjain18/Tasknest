import { useState } from 'react';
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Form, FormikProvider, useFormik } from "formik";
import axios from 'axios';
import { Button, Container, TextField, Typography } from '@mui/material';

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
        <Container>
            <Typography>Board Creation</Typography>

            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <TextField
                        label="boardName"
                        fullWidth
                        {...getFieldProps("boardName")}
                        error={Boolean(touched.boardName && errors.boardName)}
                        helperText={touched.boardName && errors.boardName}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Create
                    </Button>
                </Form>
            </FormikProvider>
        </Container>
    )
}