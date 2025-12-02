
from typing import Any
from django.db.models.query import QuerySet
from django.shortcuts import render,redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.generic import ListView ,DetailView,CreateView,UpdateView,DeleteView
from .forms import Seller_Register_Form
from .models import *
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import authenticate, login
from django.urls import reverse_lazy





def register_seller(request):
    if request.method == 'POST':
        form=Seller_Register_Form(request.POST)
        if form.is_valid():
            
            form.save()
            username=form.cleaned_data.get('username')
            phone_no=form.cleaned_data.get('phone_no')
           
            messages.success(request,f'Welcome {username}!! NOW Login')
            return redirect('seller-login')
    else:
        form=Seller_Register_Form()
    return render(request,'seller-signuppage.html',context={'form':form})
@login_required
def create_profile(request):
    seller=Seller_Profile.objects.create(user=request.user,seller_phone_no=999999999)
    seller.save()
    return redirect('order-list')


@login_required
def order_list(request):
    try:
        seller_profile=Seller_Profile.objects.get(user=request.user)
    except Seller_Profile.DoesNotExist:
         return redirect('create-profile')
    try:

        seller_restraunt=Restraunt.objects.get(of_seller=seller_profile)
    except Restraunt.DoesNotExist:
        return render(request,'seller-home.html')
    pending_order_list=seller_restraunt.pending_order_set.all()
    context={'pending_order_list':pending_order_list,
             'seller_restraunt':seller_restraunt}
    return render(request,'seller-home.html',context)


    


class add_item(CreateView,LoginRequiredMixin):
    model=Item
    fields=['item_name','item_price','item_description','item_image']
    template_name='add-item.html'
    def form_valid(self, form) :
        form.instance.of_restraunt=self.request.user.seller_profile.restraunt
        return super().form_valid(form)

class ItemList(ListView,LoginRequiredMixin):
    model=Item
    context_object_name='item_list'
    template_name='view-items.html'
    def get_queryset(self):
        return Item.objects.filter(of_restraunt=self.request.user.seller_profile.restraunt)
    
class OrderDetail(DetailView,LoginRequiredMixin):
    model=Pending_Order
    context_object_name='order'
    template_name='order-detail.html'

@login_required
def send_order(request,pk):
   order_to_send= Pending_Order.objects.get(pk=pk)
   messages.success(request,f'  Order no.{order_to_send.pk} has been dispatched')
   order_to_send.delete()
   return redirect('order-list')

class ItemUpdate(UpdateView,LoginRequiredMixin):
    model=Item
    fields=['item_name','item_price','item_description','item_image']
    template_name='add-item.html'
    success_url = reverse_lazy('item-list')  # Redirect after successful update


