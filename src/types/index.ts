// Данные товара
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

//Состояние приложения
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
}

//тексты кнопки в модальном окне товара
export enum CardModalActions {
	remove = 'Удалить',
	buy = 'Купить',
}

// доступные виды платежа
export type PaymentStatus = 'card' | 'cash' | undefined;

//Данные платежа
export interface IOrderPayment {
	payment: PaymentStatus;
	address: string;
}
//Контактные данные
export interface IOrderContacts {
	email: string;
	phone: string;
}

type IOrderForm = IOrderPayment & IOrderContacts;

//итоговый набор данных для заказа
export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

//ответные данные после заказа
export interface IOrderResult {
	id: string;
	total: number;
}

//ошибки валидации форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;
