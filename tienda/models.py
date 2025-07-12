from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    precio_base = models.DecimalField(max_digits=10, decimal_places=2, help_text="Precio por unidad")
    imagen = models.ImageField(upload_to='productos/')  # Necesita configuración de media
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos')

    def __str__(self):
        return self.nombre

    def obtener_precio_por_cantidad(self, cantidad):
        """
        Devuelve el precio aplicable según la cantidad indicada.
        Si no hay precios por cantidad o no aplica, usa el precio base.
        """
        precios = self.precios_por_cantidad.order_by('-cantidad_minima')
        for precio in precios:
            if cantidad >= precio.cantidad_minima:
                return precio.precio
        return self.precio_base

class PrecioPorCantidad(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='precios_por_cantidad')
    cantidad_minima = models.PositiveIntegerField(help_text="Cantidad mínima para aplicar este precio")
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ['-cantidad_minima']  # Ordena de mayor a menor cantidad mínima

    def __str__(self):
        return f"{self.producto.nombre} - Desde {self.cantidad_minima} unidades: ${self.precio}"


class Pedido(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('en_proceso', 'En Proceso'),
        ('terminado', 'Terminado'),
        ('pagado', 'Pagado'),
    ]

    nombre_cliente = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    productos = models.ManyToManyField(Producto, through='DetallePedido')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Pedido {self.id} - {self.nombre_cliente}'

class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
