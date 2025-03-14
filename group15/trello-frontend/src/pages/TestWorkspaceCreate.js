import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { Form, FormikProvider, useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Container, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function WorkspaceCreation() {
    const WorkspaceCreationSchema = Yup.object().shape({
        workspaceName: Yup.string().required(
            "The name of the workspace is required"
        ),
    });

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            workspaceName: "",
            workspaceDes: "",
        },
        validationSchema: WorkspaceCreationSchema,
        onSubmit: async (values) => {
            const { workspaceName, workspaceDes } = values;

            try {
                const response = await axios.post("http://localhost:8080/api/user/workspace/save", {
                    workspaceName,
                    workspaceDes,
                });

                navigate("/test-home");
                console.log(response.data);
            } catch (error) {
                console.log("An error occurred:", error.message);
            }
        },
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    return (
        <Container>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Workspace Name"
                        {...getFieldProps("workspaceName")}
                        error={Boolean(touched.workspaceName && errors.workspaceName)}
                        helperText={touched.workspaceName && errors.workspaceName}
                    />

                    <TextField
                        fullWidth
                        label="Workspace Description"
                        {...getFieldProps("workspaceDes")}
                        error={Boolean(touched.workspaceDescription && errors.workspaceDescription)}
                        helperText={touched.workspaceDescription && errors.workspaceDescription}
                    />

                    <LoadingButton loading={isSubmitting} type="submit" fullWidth variant="contained">
                        Create
                    </LoadingButton>
                </Form>
            </FormikProvider>
        </Container>
    )

}