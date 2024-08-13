from django.db import models
from django.contrib.auth.models import User
import string
import random
randomWordData = ['about', 'all', 'also', 'and', 'because', 'but', 'can', 'come', 'could', 'day', 'even', 'find', 'first', 'for', 'from', 'get', 'give', 'have', 'her', 'here', 'him', 'his', 'how', 'into', 'its', 'just', 'know', 'like', 'look', 'make', 'man', 'many', 'more', 'new', 'not', 'now', 'one', 'only', 'other', 'our', 'out', 'people', 'say', 'see', 'she', 'some', 'take', 'tell', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'thing', 'think', 'this', 'those', 'time', 'two', 'use', 'very', 'want', 'way', 'well', 'what', 'when', 'which', 'who', 'will', 'with', 'would', 'year', 'you', 'your']
def generate_unique_code():
    length = 6
    numTried = 0
    maxTries = 100
    while numTried < maxTries:
        word = random.choice(randomWordData)
        if Room.objects.filter(code=word).count() == 0:
            return word
        numTried += 1
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            return code

class Room(models.Model):
    code = models.CharField(
    max_length=10, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=50, null=True)
    last_song_update = models.DateTimeField(null=True)
    last_song_Json = models.JSONField(null=True,)

