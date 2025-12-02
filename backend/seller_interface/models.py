from django.db import models
from django.contrib.auth.models import User
from user_interface.models import User_Profile

from django.urls import reverse

# Create your models here.
class Seller_Profile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    seller_phone_no=models.PositiveBigIntegerField(default=9999999999)
    def __str__(self):
        return f'{self.user.first_name} {self.seller_phone_no}'

class Restraunt(models.Model):
    of_seller=models.OneToOneField(Seller_Profile,on_delete=models.CASCADE)
    restraunt_name=models.CharField(max_length=15)
    restraunt_rating_value=models.DecimalField(max_digits=3,decimal_places=1)
    def __str__(self):
        return f'{self.restraunt_name}  Rating:{self.restraunt_rating_value}'

class Item(models.Model):
    of_restraunt=models.ForeignKey(Restraunt,on_delete=models.CASCADE)
    item_price=models.PositiveBigIntegerField(default=0)
    item_name=models.CharField(max_length=25)
    item_description=models.TextField()
    item_image=models.ImageField(upload_to='item_images/',null=True,blank=True)
    available=models.BooleanField(default=True)
    item_rating=models.DecimalField(max_digits=3,decimal_places=1,default=5.0)
    def __str__(self):
        return f'{self.item_name}   {self.item_price}   Rating:{self.item_rating}'
    def get_absolute_url(self):
        return reverse('order-list')


class Pending_Order(models.Model):
    of_student=models.ForeignKey(User_Profile,on_delete=models.CASCADE)
    order_price=models.PositiveBigIntegerField(default=0)
    no_of_items=models.PositiveIntegerField(default=0)
    order_to=models.ForeignKey(Restraunt,on_delete=models.CASCADE)
    def __str__(self):
        return f'{self.of_student}      {self.order_price}  {self.no_of_items}'

class Pending_Order_Item(models.Model):
    of_order=models.ForeignKey(Pending_Order,on_delete=models.CASCADE)
    item_price=models.PositiveBigIntegerField(default=0)
    item_name=models.CharField(max_length=25)
    item_quantity=models.PositiveIntegerField(default=1)
    def __str__(self):
        return f'{self.item_name}   {self.of_order.of_student}'


class Rating(models.Model):
    rating_value=models.IntegerField(default=5)
    rating_by=models.ForeignKey(User,on_delete=models.CASCADE)
    rated_item=models.ForeignKey(Item,on_delete=models.CASCADE)
    def __str__(self):
        return f'{self.rated_item}  {self.rating_by}    {self.rating_value}'

class Restraunt_rating(models.Model):
    rating_value=models.IntegerField(default=5)
    rating_by=models.ForeignKey(User,on_delete=models.CASCADE)
    rated_restraunt=models.ForeignKey(Restraunt,on_delete=models.CASCADE)
    def __str__(self):
        return f'{self.rated_restraunt.restraunt_name}      {self.rating_by}    {self.rating_value}'


