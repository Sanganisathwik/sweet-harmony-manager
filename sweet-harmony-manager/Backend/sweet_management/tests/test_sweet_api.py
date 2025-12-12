from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from sweet_management.models import Sweet


class SweetAPITests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="tester", password="pass1234")
        self.client.force_authenticate(self.user)

    def test_create_and_purchase_sweet(self):
        create_url = reverse("sweet-list")
        res = self.client.post(create_url, {"name": "Ladoo", "category": "Indian", "price": "10.50", "quantity": 5})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        sweet_id = res.data["id"]

        purchase_url = reverse("sweet-purchase", args=[sweet_id])
        res2 = self.client.post(purchase_url, {"quantity": 2})
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(res2.data["quantity"], 3)
