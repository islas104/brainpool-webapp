import logging
import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from aiohttp import FormData
import aiohttp
import aiofiles
import uuid

# Create a custom logger
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
origins = ["http://localhost:3000"]

# Add CORS middleware to your FastAPI application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# URL for the OVMS service
OVMS_HOST = os.getenv("OVMS_HOST", "http://localhost:8000/v1/models/brainpool-app/versions/1/infer")

# Create the 'temp' directory if it doesn't exist
if not os.path.exists("backend/temp"):
    os.makedirs("backend/temp")

async def style_transfer(image_path: str) -> str:
    async with aiohttp.ClientSession() as session:
        data = FormData()
        async with aiofiles.open(image_path, 'rb') as image_file:
            data.add_field('image', await image_file.read(), filename='image.jpg', content_type='image/jpeg')
        async with session.post(OVMS_HOST, data=data) as response:
            if response.status != 200:
                raise HTTPException(status_code=response.status, detail=f"Style Transfer failed with status code {response.status}")
            content = await response.read()

            styled_image_filename = f"{uuid.uuid4()}-styled.jpg"
            styled_image_path = os.path.join("backend/temp", styled_image_filename)

            async with aiofiles.open(styled_image_path, mode='wb') as styled_file:
                await styled_file.write(content)

    return styled_image_path

@app.post("/api/style-transfer/")
async def style_transfer_endpoint(image: UploadFile = File(...)):
    temp_image_path = os.path.join("backend/temp", f"{uuid.uuid4()}-{image.filename}")
    async with aiofiles.open(temp_image_path, "wb") as buffer:
        await buffer.write(await image.read())

    try:
        styled_image_path = await style_transfer(temp_image_path)
    except Exception as e:
        logger.error("Error in style_transfer_endpoint: ", str(e))  # Log the error message
        raise HTTPException(status_code=500, detail="Internal Server Error")

    finally:
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)

    return FileResponse(styled_image_path, media_type="image/jpeg", headers={'Content-Disposition': f'attachment; filename={os.path.basename(styled_image_path)}'})
