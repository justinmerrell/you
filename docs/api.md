# API Documentation

## Base URL

The base URL for all API endpoints is: `http://localhost:8000/api`

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Authentication Endpoints

#### Login

- **URL**: `/token/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "access": "string",
    "refresh": "string",
    "user": {
      // User data
    }
  }
  ```

#### Refresh Token

- **URL**: `/token/refresh/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "refresh": "string"
  }
  ```
- **Response**:
  ```json
  {
    "access": "string"
  }
  ```

#### Register

- **URL**: `/register/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

## Thoughts API

### Get All Thoughts

- **URL**: `/thoughts/`
- **Method**: `GET`
- **Auth required**: Yes
- **Response**: List of thought objects
  ```json
  [
    {
      "text": "string",
      "introspective_version": "string",
      "created_at": "datetime"
    }
  ]
  ```

### Create Thought

- **URL**: `/thoughts/`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "text": "string"
  }
  ```
- **Response**: Created thought object

### Update Thought

- **URL**: `/thoughts/{id}/`
- **Method**: `PUT`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "text": "string"
  }
  ```

### Delete Thought

- **URL**: `/thoughts/{id}/`
- **Method**: `DELETE`
- **Auth required**: Yes

## Context Sources API

### Get All Sources

- **URL**: `/context/sources/`
- **Method**: `GET`
- **Auth required**: Yes
- **Response**: List of context source objects

### Create Source

- **URL**: `/context/sources/`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "name": "string",
    "type": "text|url|file",
    "content": "string",
    "metadata": {},
    "isEnabled": true
  }
  ```

### Update Source

- **URL**: `/context/sources/{id}/`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Body**: Partial source object

### Delete Source

- **URL**: `/context/sources/{id}/`
- **Method**: `DELETE`
- **Auth required**: Yes

### Upload File

- **URL**: `/context/sources/upload/`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**: Form data with file

## Agent Networks API

### Get All Networks

- **URL**: `/agents/networks/`
- **Method**: `GET`
- **Auth required**: Yes
- **Response**: List of agent network objects

### Create Network

- **URL**: `/agents/networks/`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "agents": ["string"],
    "isActive": true
  }
  ```

### Update Network

- **URL**: `/agents/networks/{id}/`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Body**: Partial network object

### Delete Network

- **URL**: `/agents/networks/{id}/`
- **Method**: `DELETE`
- **Auth required**: Yes

## Gemini Integration API

### Get Auth URL

- **URL**: `/agents/gemini/auth-url/`
- **Method**: `GET`
- **Auth required**: Yes
- **Response**:
  ```json
  {
    "auth_url": "string"
  }
  ```

### Get Gemini Config

- **URL**: `/agents/gemini/config/`
- **Method**: `GET`
- **Auth required**: Yes
- **Response**:
  ```json
  {
    "is_connected": boolean,
    "api_key": "string"
  }
  ```

### Update Gemini Config

- **URL**: `/agents/gemini/config/`
- **Method**: `PUT`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "api_key": "string"
  }
  ```

### Disconnect Gemini

- **URL**: `/agents/gemini/disconnect/`
- **Method**: `POST`
- **Auth required**: Yes

### Gemini Callback

- **URL**: `/agents/gemini/callback/`
- **Method**: `GET`
- **Description**: OAuth callback endpoint for Gemini integration
