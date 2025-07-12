from rest_framework import serializers
from .models import Categoria, Producto, PrecioPorCantidad, DetallePedido, Pedido
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class PrecioPorCantidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrecioPorCantidad
        fields = ['id', 'cantidad_minima', 'precio']

class ProductoSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(max_length=None, use_url=True)
    precios_por_cantidad = PrecioPorCantidadSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'precio_base', 'imagen', 'categoria', 'precios_por_cantidad']



class DetallePedidoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)

    class Meta:
        model = DetallePedido
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = '__all__'

