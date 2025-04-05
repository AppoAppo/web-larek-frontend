// Данные товара
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

//Состояние приложения
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
}

// доступные виды платежа
export type PaymentStatus = 'card' | 'cash';

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
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export type CategoryType =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';
