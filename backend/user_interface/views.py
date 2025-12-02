from django.shortcuts import render,redirect
from django.views.generic import CreateView,UpdateView,ListView,DetailView
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from seller_interface.models import *
from .models import *
from .forms import ProfileForm
from allauth.account.models import EmailAddress
from django.contrib.auth.mixins import LoginRequiredMixin

def home(request):
   return render(request, 'home.html')

# Create your views here.
@login_required
def check_user(request):
   if User_Profile.objects.filter(user=request.user):
      return redirect('res-list')
   elif not SocialAccount.objects.filter(user=request.user):
      return redirect('order-list')
   else:
      return redirect('user-profile')
@login_required
def create_profile(request):
   if request.method=='POST':
       if not User_Profile.objects.filter(user=request.user):
        User_Profile.objects.create(user=request.user).save()
       form=ProfileForm(request.POST,instance=request.user)
       if form.is_valid():
          
          form.save()
          
          student_email_address = EmailAddress.objects.get(user=request.user, primary=True).email
          student_branch=form.cleaned_data.get('user_branch')
          request.user.user_profile.bits_id=student_email_address[1:5]+student_branch+"PS"+student_email_address[5:9]+"P"
          request.user.user_profile.save()
          username=form.cleaned_data.get('username')
          messages.success(request,f'Welcome {username}!! NOW Login')
          return redirect('res-list')
   else:
      form=ProfileForm()
      return render(request,'seller-signuppage.html',context={'form':form})
   

class Restraunt_ListView(ListView,LoginRequiredMixin):
   model=Restraunt
   context_object_name='res_list'
   template_name='home.html'


class RestrauntDetail(DetailView,LoginRequiredMixin):
   model=Restraunt
   context_object_name='res'
   template_name='res-detail.html'
@login_required
def add_to_basket(request,pk):
   #use messages
   item_to_add=Item.objects.get(pk=pk)
   user_profile = User_Profile.objects.get(user=request.user)
   try:
     user_basket= Basket.objects.get(owner=user_profile)
     if item_to_add.of_restraunt!=user_basket.of_restraunt:
        messages.error(request,"You can't order from two restaurants at the same time")
        return redirect('res-detail',item_to_add.of_restraunt.pk)
   except Basket.DoesNotExist:
      Basket.objects.create(owner=user_profile,of_restraunt=item_to_add.of_restraunt).save()
      user_basket= Basket.objects.get(owner=user_profile)
  
   if user_basket.basket_item_set.filter(item_name=item_to_add.item_name):
     item= user_basket.basket_item_set.get(item_name=item_to_add.item_name)
     item.item_quantity+=1
     user_basket.no_of_items+=1
     user_basket.total_cost+=item_to_add.item_price
     user_basket.save()
     item.save()
     messages.success(request,f'{item_to_add.item_name} quantity increased to {item.item_quantity}')
   else:
      Basket_Item.objects.create(basket=user_basket,item_name=item_to_add.item_name,item_cost=item_to_add.item_price).save()
      user_basket.no_of_items+=1
      user_basket.total_cost+=item_to_add.item_price
      user_basket.save()
      messages.success(request,f'{item_to_add.item_name} was added to basket')


   return redirect('res-detail',item_to_add.of_restraunt.pk)
@login_required
def view_basket(request):
   try: 
      user_basket=Basket.objects.get(owner=request.user.user_profile)
   except Basket.DoesNotExist:
      context={'no_basket':True}
      return render(request,'basket.html',context)
   context={'basket':user_basket}
   return render(request,'basket.html',context)
@login_required
def remove_items(request,pk):
   item=Basket_Item.objects.get(pk=pk)
   messages.warning(request,f'{item.item_name} was removed from basket')
   item.basket.total_cost-=item.item_quantity*item.item_cost
   item.basket.save()
   item.delete()

   return redirect('view-basket')
  
@login_required
def place_order(request):
   user_basket=Basket.objects.get(owner=request.user.user_profile)
   from_restaurant=user_basket.of_restraunt
   order=Pending_Order.objects.create(order_to=from_restaurant,of_student=user_basket.owner,order_price=user_basket.total_cost,no_of_items=user_basket.no_of_items)
   order.save()
   for item in user_basket.basket_item_set.all():
      Pending_Order_Item.objects.create(of_order=order,item_name=item.item_name,item_price=item.item_cost,item_quantity=item.item_quantity).save()

   user_basket.delete()
   messages.success(request,f'Order  placed at{from_restaurant.restraunt_name}')
   messages.info(request,f'Your order no. is {order.pk}')

   
   return redirect('view-basket')
@login_required
def rate_item(request,pk):
   if request.method=='POST':
      user_basket=Basket.objects.get(pk=pk)
      for item in user_basket.basket_item_set.all():
         sum=0
         no_of_raters=0
         corresponding_item=Item.objects.get(item_name=item.item_name)
         rating_value=request.POST.get('slider'+str(item.pk))
         if Rating.objects.filter(rated_item=corresponding_item,rating_by=request.user):
            rating=Rating.objects.get(rated_item=corresponding_item,rating_by=request.user)
            rating.rating_value=rating_value
            rating.save()
         else:
            rating=Rating.objects.create(rated_item=corresponding_item,rating_by=request.user,rating_value=rating_value)
            rating.save()
         for rating_obj in Rating.objects.filter(rated_item=corresponding_item):
            no_of_raters+=1
            sum+=int(rating_obj.rating_value)
         if no_of_raters!=0:
            corresponding_item.item_rating= sum/no_of_raters
            corresponding_item.save()



      messages.success(request,'Ratings received')
      return redirect('view-basket')
   else:
      return redirect('view-basket')
   
@login_required
def rate_restaurant(request,pk):
   if request.method=='POST':
      restaurant=Restraunt.objects.get(pk=pk)
      rating_value=request.POST.get('restaurantRating')
      if Restraunt_rating.objects.filter(rated_restraunt=restaurant,rating_by=request.user):
         rating_obj=Restraunt_rating.objects.get(rated_restraunt=restaurant,rating_by=request.user)
         rating_obj.rating_value=rating_value
         rating_obj.save()
      else:
         rating_obj=Restraunt_rating.objects.create(rated_restraunt=restaurant,rating_by=request.user,rating_value=rating_value)
         rating_obj.save()
      no_of_raters=0
      sum=0
      for rr in Restraunt_rating.objects.filter(rated_restraunt=restaurant):
         no_of_raters+=1
         sum+=int(rr.rating_value)
      if no_of_raters!=0:
         restaurant.restraunt_rating_value=sum/no_of_raters
         restaurant.save()
            
      messages.success(request,f'Your rating was recorded')
      return redirect('res-detail',restaurant.pk)
   
         

   