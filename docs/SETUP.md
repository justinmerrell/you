# Setting Up the Development Environment for "you"

This document guides you through setting up the development environment for the "you" project. It covers both the backend (Django with PostgreSQL) and the frontend (Next.js), ensuring you can run the application locally for development and testing.

## Prerequisites

Before starting, ensure you have the following installed on your machine:

- Python 3.8+: Download here
- Node.js 14+ and npm: Download here
- PostgreSQL 12+: Download here
- Git: Download here

Additionally, you’ll need a code editor like VS Code or PyCharm.

## Step 1: Clone the Repository

Clone the project repository to your local machine:

```bash
git clone https://github.com/your-repo/you.git
cd you
```

## Step 2: Set Up the Backend (Django)

### 2.1 Create a Virtual Environment

It’s recommended to use a virtual environment to manage dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2.2 Install Dependencies

Install the required Python packages:

```bash
pip install -r backend/requirements.txt
```

```bash
pip install django
pip install psycopg2-binary
```

### 2.3 Configure the Database

Ensure PostgreSQL is running and create a new database for the project:

```SQL
CREATE DATABASE you_db;
```

Update the DATABASES setting in backend/you/settings.py to use PostgreSQL:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'you_db',
        'USER': 'your_pg_user',
        'PASSWORD': 'your_pg_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

Replace 'your_pg_user' and 'your_pg_password' with your PostgreSQL credentials.

### 2.4 Run Migrations

Apply the initial database migrations:

```bash
python manage.py migrate
```

## Step 3: Set Up the Frontend (Next.js)

### 3.1 Install Dependencies

Navigate to the frontend directory and install the required npm packages:

```bash
cd frontend
npm install
```

### 3.2 Configure Environment Variables

If the frontend needs environment-specific variables (e.g., API URLs), create a .env.local file in the frontend directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Adjust the URL based on your backend configuration.

## Step 4: Run the Application

### 4.1 Start the Backend Server

From the backend directory, run the Django development server:

```bash
python manage.py runserver
```

The backend will be available at http://localhost:8000.

### 4.2 Start the Frontend Server

From the frontend directory, run the Next.js development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:3000.

### 4.3 Verify the Setup

Open your browser and navigate to http://localhost:3000. You should see the "you" application’s interface. If you’ve set up the backend correctly, interacting with the UI should trigger API calls to http://localhost:8000.

## Additional Notes

- Environment Variables: For sensitive data like database credentials, consider using a .env file with python-dotenv for the backend.

- **Common Issues:**

  - If you encounter database connection errors, ensure PostgreSQL is running and the credentials in settings.py are correct.
  - If the frontend fails to connect to the backend, check the NEXT_PUBLIC_API_URL in .env.local.

- **Troubleshooting:** Refer to the Django documentation and Next.js documentation for more detailed guidance.
