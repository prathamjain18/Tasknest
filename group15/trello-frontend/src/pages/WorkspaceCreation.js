import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { Form, FormikProvider, useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Container, Box, Paper } from "@mui/material";

export default function WorkspaceCreation() {
  const WorkspaceCreationSchema = Yup.object().shape({
    workspaceName: Yup.string().required("The name of the workspace is required"),
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

        navigate("/home");
        console.log(response.data);
      } catch (error) {
        console.log("An error occurred:", error.message);
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const { 0: boards, 1: setBoards } = useState([]);

  const addBoard = () => {
    const newBoard = {
      id: Date.now(),
      title: formik.values.workspaceName,
    };
    setBoards((prevBoards) => [...prevBoards, newBoard]);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #f7fafc 0%, #e3f0ff 100%)' }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 4, boxShadow: 3, minWidth: 370, maxWidth: 500, width: '100%' }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight={700} color="primary">
          Create a New Workspace
        </Typography>
        <Typography align="center" sx={{ mb: 3, color: '#555', fontSize: '1.1em' }}>
          Enhance productivity by providing centralized access to all boards within your organization.
        </Typography>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <TextField
              label="Workspace Name"
              fullWidth
              {...getFieldProps("workspaceName")}
              error={Boolean(touched.workspaceName && errors.workspaceName)}
              helperText={touched.workspaceName && errors.workspaceName}
              margin="normal"
              sx={{ mb: 2, borderRadius: 2 }}
            />
            <TextField
              label="Workspace Description (Optional)"
              fullWidth
              {...getFieldProps("workspaceDes")}
              margin="normal"
              sx={{ mb: 2, borderRadius: 2 }}
            />
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ borderRadius: 3, fontWeight: 700, py: 1, px: 3 }}
              >
                Create
              </Button>
            </Box>
          </Form>
        </FormikProvider>
      </Paper>
    </Box>
  );
}
