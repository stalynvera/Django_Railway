from rest_framework import viewsets
from .models import Categoria, Producto, PrecioPorCantidad, Pedido
from .serializers import CategoriaSerializer, ProductoSerializer, PrecioPorCantidadSerializer, PedidoSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def get_queryset(self):
        categoria_id = self.request.query_params.get('categoria')
        if categoria_id is not None:
            return Producto.objects.filter(categoria_id=categoria_id)
        return Producto.objects.all()

class PrecioPorCantidadViewSet(viewsets.ModelViewSet):
    queryset = PrecioPorCantidad.objects.all()
    serializer_class = PrecioPorCantidadSerializer


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
