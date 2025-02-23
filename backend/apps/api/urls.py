from rest_framework.routers import DefaultRouter
from .views import ThoughtViewSet

router = DefaultRouter()
router.register(r'thoughts', ThoughtViewSet, basename='thought')
urlpatterns = router.urls
