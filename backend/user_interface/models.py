from django.db import models
from django.contrib.auth.models import User
from django.db import models
from allauth.socialaccount.models import SocialAccount, SocialApp

hostels=(('SR','SR'),
         ('GANDHI','GANDHI'),
         ('KRISHNA','KRISHNA'),
         ('RAM','RAM'),
         ('BUDH','BUDH'),
         ('SHANKAR','SHANKAR'),
         ('VYAS','VYAS'),
         ('RANAPRATAP','RANAPRATAP'),
         ('VK','VK'),
         ('ASHOK','ASHOK'),
         ('MEERA','MEERA'),
         ('BHAGIRATH','BHAGIRATH')
        
         
         
         )
branches=(

    ("A7","CS"),
    ("AA","ECE"),
    ("A8","ENI"),
    ("A3","EEE"),
    ("A4","MECH"),
    ("AB","MANU"),
    ("A2","CIVIL"),
    ("A1","CHEMICAL"),
    ("B5","Msc. PHY"),
    ("B1","Msc. BIO"),
    ("B2","Msc. CHEM"),
    ("A5","PHARMA"),
    ("B4","Msc. MATH"),
    ("B3","Msc. ECO"),
    ("B3","Msc. ECO")


    )
# Create your models here.
class User_Profile(models.Model):
    name=models.CharField(max_length=15)
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    bits_id=models.CharField(max_length=15)
    hostel=models.CharField(max_length=10,choices=hostels,default='SR')
    room_no=models.PositiveIntegerField(default=100)
    user_branch=models.CharField(max_length=20,choices=branches,default="A7")


    def __str__(self):
        return f'{self.bits_id}     {self.hostel}   {self.room_no}'

class Basket(models.Model):
    from seller_interface.models import Restraunt
    owner=models.OneToOneField(User_Profile,on_delete=models.CASCADE)
    no_of_items=models.PositiveIntegerField(default=0)
    total_cost=models.PositiveBigIntegerField(default=0)
    of_restraunt=models.ForeignKey(Restraunt,on_delete=models.CASCADE)
    def __str__(self):
        return f'{self.owner.bits_id}   {self.no_of_items}      {self.total_cost}'
class Basket_Item(models.Model):
    basket=models.ForeignKey(Basket,on_delete=models.CASCADE)
    item_quantity=models.PositiveIntegerField(default=1)
    item_cost=models.PositiveBigIntegerField(default=0)
    item_name=models.CharField(max_length=25)
    item_description=models.TextField()
    item_image=models.ImageField(upload_to='item_images/',null=True,blank=True)
    def __str__(self):
        return f'{self.item_name}   {self.item_quantity}'
    @property
    def total_cost_item(self):
        return self.item_cost*self.item_quantity


