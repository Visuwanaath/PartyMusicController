import datetime
from django.utils import timezone
from dotenv import load_dotenv
from os import getenv
from pathlib import Path
load_dotenv(dotenv_path=Path('.env'))
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from api.models import Room
from .models import Vote
from django.http import JsonResponse

class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': getenv('REDIRECT_URI'),
            'client_id': getenv('CLIENT_ID'),
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)

class getAndSaveSpotifyApiToken(APIView):
    def post(self,request, format=None):
        #how to get the code from the request
        code = request.data.get('code')
        error = request.data.get('error')
        if(error):
            return JsonResponse({'error': error}, status=400)
        response = post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': getenv('REDIRECT_URI'),
            'client_id': getenv('CLIENT_ID'),
            'client_secret': getenv('CLIENT_SECRET'),
        }).json()

        access_token = response.get('access_token')
        token_type = response.get('token_type')
        refresh_token = response.get('refresh_token')
        expires_in = response.get('expires_in')
        error = response.get('error')
        if error:
            return JsonResponse({'beforeOrAfterSpotifyTokenCall':'after','error': error}, status=400)
        if not request.session.exists(request.session.session_key):
            request.session.create()
        update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)
        return JsonResponse({'message': 'success'}, status=200)
        

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        if(not request.session.exists(request.session.session_key)):
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            try:
                self.request.session.pop('room_code')
            except:
                pass
            return Response({"Leave":"Room"}, status=status.HTTP_208_ALREADY_REPORTED)
        host = room.host
        last_song_update = room.last_song_update
        getDataFromSpotfiy = True
        if(last_song_update != None):
            time_elapsed = (timezone.now() - last_song_update).total_seconds()
            # print("Time Elapsed: ", time_elapsed)
            if time_elapsed < 10:
                getDataFromSpotfiy = False
        if getDataFromSpotfiy:
            endpoint = "player/currently-playing"
            response = execute_spotify_api_request(host, endpoint)
            print("calling spotify")
            if 'error' in response or 'item' not in response:
                return Response({}, status=status.HTTP_204_NO_CONTENT)

            item = response.get('item')
            duration = item.get('duration_ms')
            progress = response.get('progress_ms')
            album_cover = item.get('album').get('images')[0].get('url')
            is_playing = response.get('is_playing')
            song_id = item.get('id')
            artist_string = ", ".join([artist.get('name') for artist in item.get('artists')])
            votes = len(Vote.objects.filter(room=room, song_id=song_id))
            song = {
                'title': item.get('name'),
                'artist': artist_string,
                'duration': duration,
                'time': progress,
                'image_url': album_cover,
                'is_playing': is_playing,
                'votes': votes,
                'votes_required': room.votes_to_skip,
                'guest_can_pause': room.guest_can_pause,
                'id': song_id
            }

            self.update_room_song(room, song_id)
            room.last_song_update = timezone.now()
            room.last_song_Json = song
            room.save(update_fields=['last_song_Json', 'last_song_update'])
        else:
            song = room.last_song_Json
            song_id = song['id']
            votes = len(Vote.objects.filter(room=room, song_id=song_id))
            song['votes'] = votes
            song['votes_required'] = room.votes_to_skip
            song['guest_can_pause'] = room.guest_can_pause
        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        current_song = room.current_song
        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            Vote.objects.filter(room=room).delete()


class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)

class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)

class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip
        if(len(votes.filter(user=self.request.session.session_key)) > 0):
            return Response({}, status=status.HTTP_403_FORBIDDEN)
        if self.request.session.session_key == room.host or (len(votes) + 1 >= votes_needed):
            votes.delete()
            skip_song(room.host)
        else:
            vote = Vote(user=self.request.session.session_key,
                        room=room, song_id=room.current_song)
            vote.save()

        return Response({}, status.HTTP_204_NO_CONTENT)

class getUserMusicQueue(APIView):
    def get(self, request, format=None):
        if(not request.session.exists(request.session.session_key)):
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        if not is_authenticated:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/queue"
        response = execute_spotify_api_request(host, endpoint)
        if 'error' in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        queue = response.get('queue')
        songs = []
        for track in queue:
            artists = track.get('artists')
            artist = None
            if(len(artists) > 0):
                artist = artists[0].get('name')
            imageUrls = track.get('album').get('images')
            imageUrl = None
            if(len(imageUrls) > 0):
                imageUrl = imageUrls[0].get('url')
            song = {
                'title': track.get('name'),
                'artist': artist,
                'image_url': imageUrl
            }
            songs.append(song)
        return Response(songs, status=status.HTTP_200_OK)

class SearchSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        query = request.GET.get('query')
        print(query)
        response = searchForSong(host, query)
        songs = []
        for track in response.get('tracks').get('items'):
            artists = track.get('artists')
            artist = None
            if(len(artists) > 0):
                artist = artists[0].get('name')
            imageUrls = track.get('album').get('images')
            imageUrl = None
            if(len(imageUrls) > 0):
                imageUrl = imageUrls[0].get('url')
            song = {
                'title': track.get('name'),
                'artist': artist,
                'uri': track.get('uri'),
                'image_url': imageUrl
            }
            songs.append(song)
        return Response(songs, status=status.HTTP_200_OK)

class AddToQueue(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        uri = request.data.get('uri')
        response = addSongToQueue(host, uri)
        if response.get('error'):
            return Response({'error': 'Error adding song to queue'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Song added to queue'}, status=status.HTTP_200_OK)