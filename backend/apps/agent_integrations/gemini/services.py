import os
from datetime import datetime, timedelta
from typing import Dict, Optional, Tuple
import google.auth.transport.requests
from google.oauth2.credentials import Credentials
from google.auth.exceptions import RefreshError
from django.conf import settings
from .models import GeminiIntegration

class GeminiAuthService:
    """Service for handling Gemini authentication"""

    SCOPES = [
        'https://www.googleapis.com/auth/generative-ai',
        'https://www.googleapis.com/auth/userinfo.email'
    ]

    def __init__(self):
        self.client_id = settings.GEMINI_CLIENT_ID
        self.client_secret = settings.GEMINI_CLIENT_SECRET
        self.redirect_uri = settings.GEMINI_REDIRECT_URI

    def get_auth_url(self, state: str) -> str:
        """Generate the Google OAuth URL for Gemini"""
        base_url = "https://accounts.google.com/o/oauth2/v2/auth"
        scope_string = " ".join(self.SCOPES)

        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "response_type": "code",
            "scope": scope_string,
            "access_type": "offline",
            "state": state,
            "prompt": "consent"
        }

        query_params = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{base_url}?{query_params}"

    async def exchange_code_for_tokens(self, code: str) -> Dict[str, str]:
        """Exchange authorization code for access and refresh tokens"""
        token_url = "https://oauth2.googleapis.com/token"

        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data)
            response.raise_for_status()
            return response.json()

    def create_credentials(self, tokens: Dict[str, str]) -> Credentials:
        """Create Google Credentials object from tokens"""
        return Credentials(
            token=tokens["access_token"],
            refresh_token=tokens.get("refresh_token"),
            token_uri="https://oauth2.googleapis.com/token",
            client_id=self.client_id,
            client_secret=self.client_secret,
            scopes=self.SCOPES
        )

    async def refresh_access_token(self, integration: GeminiIntegration) -> Tuple[str, datetime]:
        """Refresh the access token using the refresh token"""
        credentials = Credentials(
            token=integration.access_token,
            refresh_token=integration.refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=self.client_id,
            client_secret=self.client_secret,
            scopes=self.SCOPES
        )

        try:
            request = google.auth.transport.requests.Request()
            credentials.refresh(request)
            expiry = datetime.utcnow() + timedelta(seconds=credentials.expiry.timestamp() - datetime.now().timestamp())
            return credentials.token, expiry
        except RefreshError:
            integration.is_active = False
            integration.save()
            raise

    async def validate_token(self, integration: GeminiIntegration) -> Optional[str]:
        """Validate and refresh token if necessary"""
        if not integration.is_active:
            return None

        if integration.token_expiry <= datetime.utcnow():
            try:
                new_token, new_expiry = await self.refresh_access_token(integration)
                integration.access_token = new_token
                integration.token_expiry = new_expiry
                integration.save()
                return new_token
            except RefreshError:
                return None

        return integration.access_token
