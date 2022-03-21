/* eslint-disable prettier/prettier */
import { Controller, Inject, OnModuleInit, Post, Req, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateOrderRequest, CreateOrderResponse, OrderServiceClient, ORDER_SERVICE_NAME } from './order.pb';

@Controller('order')
export class OrderController implements OnModuleInit{
    private svc: OrderServiceClient;

    @Inject(ORDER_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit(): void {
        this.svc = this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
    }

    @Post()
    @UseGuards(AuthGuard)
    private async createOrder(@Req() req: Request | any): Promise<Observable<CreateOrderResponse>> {
        const body: CreateOrderRequest = req.body;

        body.userId = <number>req.user;

        return this.svc.createOrder(body);
    }
}
