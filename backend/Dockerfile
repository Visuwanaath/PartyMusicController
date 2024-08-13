FROM python:3.11-slim

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK on
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV COLUMNS 80

# Install system dependencies
RUN apt-get update \
 && apt-get install -y --force-yes --no-install-recommends\
 nano python3-pip gettext chrpath libssl-dev libxft-dev gcc libpq-dev\
 libfreetype6 libfreetype6-dev  libfontconfig1 libfontconfig1-dev\
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app/

# Copy backend requirements and install
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend /app/

# Copy .env file
COPY backend/.env /app/.env

# Expose port 8000 for the Django app
EXPOSE 8000

# Start the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]