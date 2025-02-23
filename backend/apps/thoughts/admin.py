from django.contrib import admin
from .models import Thought

@admin.register(Thought)
class ThoughtAdmin(admin.ModelAdmin):
    list_display = ('user', 'text', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('text', 'user__username')
    ordering = ('-created_at',)
