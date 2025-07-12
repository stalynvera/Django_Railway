from django.contrib import admin

# Import the models to be registered

from.models import Producto,Categoria,Pedido,DetallePedido,PrecioPorCantidad

admin.site.register(Producto)  # Register the Product model to the admin site.
admin.site.register(Categoria) 

admin.site.register(Pedido)  # Register the Pedido model to the admin site.

admin.site.register(DetallePedido)  # Register the DetallePedido model to the admin site.

admin.site.register(PrecioPorCantidad)
# Register your models here.
