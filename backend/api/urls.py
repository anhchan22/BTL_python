from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'zones', views.IndustrialZoneViewSet, basename='zone')
router.register(r'rentals', views.RentalRequestViewSet, basename='rental')
router.register(r'contracts', views.ContractViewSet, basename='contract')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),

    # Test endpoint (from Phase 1)
    path('hello/', views.hello_world, name='hello-world'),

    # Authentication endpoints
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/me/', views.get_current_user, name='current-user'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # User management endpoints
    path('users/', views.get_all_users, name='get-all-users'),
    path('users/<int:user_id>/role/', views.change_user_role, name='change-user-role'),
    path('users/me/profile/', views.update_user_profile, name='update-profile'),
]
