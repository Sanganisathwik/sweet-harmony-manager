from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class AuthAPITests(APITestCase):
    def test_register_and_login(self):
        # register
        res = self.client.post("/api/v1/auth/register/", {"username": "u1", "email": "u1@example.com", "password": "pass1234", "role": "customer"})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # login
        res2 = self.client.post("/api/v1/auth/login/", {"username": "u1", "password": "pass1234"})
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertIn("access", res2.data)
        self.assertIn("user", res2.data)
