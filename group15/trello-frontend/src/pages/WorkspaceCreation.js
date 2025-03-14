import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { Form, FormikProvider, useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Container, Box } from "@mui/material";

export default function WorkspaceCreation() {
  const WorkspaceCreationSchema = Yup.object().shape({
    workspaceName: Yup.string().required("The name of the workspace is required"),
  });

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      workspaceName: "",
      workspaceDescription: "",
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
      <div>
        <Container maxWidth="sm" style={{ backgroundColor: "rgb(255, 196, 196)" }}>
          <Box my={4} style={{ padding: "1rem" }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom style={{ fontWeight: "bold" }}>
              Let's build a Workspace
            </Typography>

            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <p style={{ fontSize: "125%" }}>
                Boost your productivity by making it easier for everyone to access boards in one location.
              </p>
            </div>

            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <TextField
                    label="Workspace Name"
                    fullWidth
                    {...getFieldProps("workspaceName")}
                    error={Boolean(touched.workspaceName && errors.workspaceName)}
                    helperText={touched.workspaceName && errors.workspaceName}
                    margin="normal"
                />

                <div>
                  <p style={{ color: "grey" }}>This is the name of your company, team, or organization.</p>
                </div>
                <TextField
                    label={
                      <>
                        Workspace Description{" "}
                        <span style={{ color: "rgb(133, 14, 53)", fontSize: "80%" }}>Optional</span>
                      </>
                    }
                    fullWidth
                    {...getFieldProps("workspaceDes")}
                    margin="normal"
                />
                <div>
                  <p style={{ color: "grey" }}>Get your members on board with a few words about your Workspace.</p>
                </div>

                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      style={{
                        margin: "auto",
                        marginTop: "3%",
                        fontSize: "120%",
                        display: "block",
                        backgroundColor: "rgb(238, 105, 131)",
                      }}
                  >
                    Create
                  </Button>
                </Box>
              </Form>
            </FormikProvider>
          </Box>

          {/* Add your GIF image here */}
          <img
              src="/source.gif"
              alt="Workspace GIF"
              style={{ width: "100%", maxWidth: "500px", margin: "auto", display: "block" }}
          />
        </Container>
      </div>
  );
}
