from django.contrib import admin

from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
  list_display = ('email', 'name', 'is_admin')

# Register your models here.
