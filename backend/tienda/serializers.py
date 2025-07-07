from rest_framework import serializers
from .models import Categoria, Producto, Pedido, DetallePedido

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Producto
        fields = '__all__'


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

