from django.db import models
from django.conf import settings

from hashids import Hashids

'''
auto_now_add=True will create a warning which is inevitable according to 
https://groups.google.com/forum/#!topic/django-users/pm6F9RSEGPk

'''

class Room(models.Model):

    name = models.CharField(max_length=64)
    place = models.CharField(max_length=64)

    min_time_required = models.DurationField(null=True, blank=True)
    created_time = models.DateTimeField(auto_now_add=True)

    time_span_start = models.DateTimeField(null=True)
    time_span_end = models.DateTimeField(null=True)

    min_members = models.IntegerField(default=1)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='owned_rooms',
        null=False
    )

    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='joined_rooms',
    )

    hashids = Hashids(salt='lasagna is very delicious', min_length=7)
    
    def get_hash(id_num):
        return Room.hashids.encode(id_num)

    def decode_hash(hash_str):
        result = Room.hashids.decode(hash_str)
        if result == ():
            return None
        return result[0]

    # TODO: Implement member functions for make best times.

