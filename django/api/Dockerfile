# Use the official Python image as a base image
FROM python:3.10-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

COPY requirements.txt /app/

# RUN pip install -r requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Install dependencies

# Expose port 8000 to the outside world
EXPOSE 8000

# Run Django's development server when the container starts
CMD ["python", "manage.py", "runserver"]
