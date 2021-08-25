FROM python:3

ENV PYTHONUNBUFFERED=1

WORKDIR /usr/src/app/backend

COPY requirements.txt ./

ADD . .

# Configure server
RUN set -ex \
  && pip install --upgrade pip \
  && pip install --no-cache-dir -r requirements.txt


  
RUN python3 manage.py collectstatic --noinput
RUN python3 manage.py makemigrations
RUN python3 manage.py migrate

# Expose port 8000 for gunicorn
EXPOSE 8000

CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "core.wsgi:application"]
