from room.models import Room
from user.models import User
from .models import BestTime

from dateutil.parser import parse
from django.test import TestCase, Client
from datetime import datetime, timedelta

import json

CONTENT_TYPE = 'application/json'


class BestTimeTestCase(TestCase):
    def setUp(self):
        User.objects.create_user(email='email1', password='password1', username='username1')
        User.objects.create_user(email='email2', password='password2', username='username2')
        User.objects.create_user(email='email3', password='password3', username='username3')
        User.objects.create_user(email='email4', password='password4', username='username4')

        user1 = User.objects.get(id=1)
        user2 = User.objects.get(id=2)
        user3 = User.objects.get(id=3)
        user4 = User.objects.get(id=4)

        time_span_start1 = parse('2017-11-4T12:30:00.000Z', ignoretz=True)
        time_span_end1 = parse('2017-11-4T17:30:00.000Z', ignoretz=True)

        min_time1 = timedelta(hours=2, minutes=30)

        Room.objects.create(
            name="room1",
            place="place1",
            time_span_start=time_span_start1,
            time_span_end=time_span_end1,
            min_time_required=min_time1,
            owner=user1,
        )
        room1 = Room.objects.get(id=1)

        room1.members.add(user1)
        room1.members.add(user2)
        room1.members.add(user3)
        room1.members.add(user4)

        best_time_start1 = parse('2017-11-4T12:30:00.000Z', ignoretz=True)
        best_time_end1 = parse('2017-11-4T15:00:00.000Z', ignoretz=True)
        best_time_start2 = parse('2017-11-4T15:00:00.000Z', ignoretz=True)
        best_time_end2 = parse('2017-11-4T17:00:00.000Z', ignoretz=True)

        BestTime(start_time=best_time_start1, end_time=best_time_end1, room=room1)
        BestTime(start_time=best_time_start2, end_time=best_time_end2, room=room1)

        self.client = Client()

    def test_best_time_list_get_unauth(self):
        response = self.client.get('/api/rooms/1/best-times')
        self.assertEqual(response.status_code, 401)

    def test_best_time_list_get_invalid_room(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )

        self.client.get('/api/rooms/2/best-times')
        self.assertRaises(Room.DoesNotExist)

    def test_best_time_list_get(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )

        response = self.client.get('/api/rooms/1/best-times')
        self.assertEqual(response.status_code, 200)

    def test_best_time_list_invalid_methods(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )

        response = self.client.post('/api/rooms/1/best-times')
        self.assertEqual(response.status_code, 405)

        response = self.client.put('/api/rooms/1/best-times')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/rooms/1/best-times')
        self.assertEqual(response.status_code, 405)

