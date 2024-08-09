from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', getAndSaveSpotifyApiToken.as_view()),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
    path('pause', PauseSong.as_view()),
    path('play', PlaySong.as_view()),
    path('skip', SkipSong.as_view()),
    path('queue', getUserMusicQueue.as_view()),
    path('search', SearchSong.as_view()),
    path('add-to-queue', AddToQueue.as_view()),
]