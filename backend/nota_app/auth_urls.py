from django.urls import path
from .views import CookieTokenObtainPairView, CookieTokenRefreshView

urlpatterns = [
    path('', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
]