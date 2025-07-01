from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView 
urlpatterns = [
  path('registration/' , views.RegistrationView.as_view() , name='registration'),
  path('login/' , views.UserLoginView.as_view() , name='login'),
  path('logout/' , views.Logout.as_view() , name='logout'),
  path('profile/' , views.UserProfile.as_view() , name='profile'),
  path('token/refresh/' , TokenRefreshView.as_view() , name='token-refresh'),

  
]