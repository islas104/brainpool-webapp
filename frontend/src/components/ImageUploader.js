import React, { useState } from "react";
import { Button, CircularProgress, Snackbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(4),
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  previewImage: {
    maxWidth: "100%",
    marginTop: theme.spacing(2),
  },
}));

const ImageUploader = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileChange = (event) => {
    setLoading(false);
    setErrorMessage(null);

    const file = event.target.files && event.target.files[0];
    if (file) {
      const isValidImage = file.type.startsWith("image/");
      if (!isValidImage) {
        setErrorMessage("Please select a valid image file.");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(
        "http://localhost:8000/api/style-transfer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      setLoading(false);

      const styledImageUrl = URL.createObjectURL(new Blob([response.data]));
      setPreviewImage(styledImageUrl);
    } catch (error) {
      console.error("Error detail:", error); // Log detailed error
      setLoading(false);
      setErrorMessage(
        "There was an error processing your image. Please try again later."
      );
    }
  };

  const handleCloseSnackbar = () => {
    setErrorMessage(null);
  };

  return (
    <div className={classes.root}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="image-upload-input"
      />
      <label htmlFor="image-upload-input">
        <Button variant="contained" component="span" color="primary">
          Upload Image
        </Button>
      </label>

      <div className={classes.buttonGroup}>
        {selectedFile && (
          <div>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUploadImage}
              >
                Style Transfer
              </Button>
            )}
          </div>
        )}
      </div>

      {previewImage && (
        <img
          src={previewImage}
          alt="Preview"
          className={classes.previewImage}
        />
      )}

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={errorMessage}
      />
    </div>
  );
};

export default ImageUploader;
