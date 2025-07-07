from rest_framework import viewsets
from .models import Categoria, Producto, Pedido
from .serializers import CategoriaSerializer, ProductoSerializer, PedidoSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()  # Definir un queryset predeterminado
    serializer_class = ProductoSerializer

    def get_queryset(self):
        categoria_id = self.request.query_params.get('categoria', None)
        if categoria_id is not None:
            return Producto.objects.filter(categoria_id=categoria_id)
        return Producto.objects.all()


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
