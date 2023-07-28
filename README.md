# Style Transfer Web App with OpenVINO Model Server and React

This repository contains code for a web application that performs style transfer on uploaded images using the OpenVINO Model Server (OVMS) for the backend and React for the frontend.

## Prerequisites

Before running the application, ensure you have the following prerequisites installed:

- Python 3.6+
- Node.js (LTS version recommended)
- OpenVINO Toolkit
- Docker (optional, for containerization)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/style-transfer-app.git
   cd style-transfer-app
   ```

2. Set up the Backend:

   - Install the required Python packages:

     ```bash
     cd backend
     pip install -r requirements.txt
     ```

   - Start the OVMS server with the style transfer model:

     ```bash
     ovms --model-store /path/to/brainpool-app --model-name brainpool-app --model-version 1
     ```

   Note: Make sure to replace `/path/to/brainpool-app` with the path to the directory containing the model artifacts for style transfer.

3. Set up the Frontend:

   - Install the required Node.js packages:

     ```bash
     cd frontend
     npm install
     ```

4. Run the Application:

   - Start the React development server:

     ```bash
     npm start
     ```

   - Access the web app at `http://localhost:3000` in your web browser.

## Usage

1. Upload an Image:

   - Click the "Upload Image" button and select an image from your local file system.

2. Perform Style Transfer:

   - After selecting an image, the "Style Transfer" button will become active.
   - Click the "Style Transfer" button to apply the style transfer to the uploaded image using the OVMS backend.

3. Download Styled Image:
   - Once the style transfer is completed, the styled image will be displayed on the web app.
   - You can download the styled image by right-clicking on it and selecting "Save Image As."

## Troubleshooting

If you encounter any issues during setup or while running the application, please refer to the following troubleshooting steps:

- Verify the correct installation of Python and Node.js.
- Ensure that the OVMS server is running with the correct model and model version.
- Check the console and network tabs in your web browser's developer tools for any error messages.
- Refer to the project's GitHub repository for known issues and solutions.

## Author

Islas Ahmed Nawaz - Islas104@gmail.com
