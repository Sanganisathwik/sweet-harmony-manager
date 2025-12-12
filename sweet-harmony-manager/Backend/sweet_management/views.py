from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Sweet
from .serializers import SweetSerializer


class SweetViewSet(viewsets.ModelViewSet):
    queryset = Sweet.objects.all().order_by("-created_at")
    serializer_class = SweetSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=["post"])
    def purchase(self, request, pk=None):
        sweet = self.get_object()
        qty = int(request.data.get("quantity", 1))
        if qty <= 0:
            return Response({"detail": "Quantity must be positive."}, status=status.HTTP_400_BAD_REQUEST)
        if sweet.quantity < qty:
            return Response({"detail": "Insufficient stock."}, status=status.HTTP_400_BAD_REQUEST)
        sweet.quantity -= qty
        sweet.save()
        return Response(self.get_serializer(sweet).data)

    @action(detail=True, methods=["post"])
    def restock(self, request, pk=None):
        sweet = self.get_object()
        qty = int(request.data.get("quantity", 1))
        if qty <= 0:
            return Response({"detail": "Quantity must be positive."}, status=status.HTTP_400_BAD_REQUEST)
        sweet.quantity += qty
        sweet.save()
        return Response(self.get_serializer(sweet).data)
