import {
	FormErrors,
	IAppState,
	IOrder,
	IOrderContacts,
	IOrderPayment,
	IProduct,
	PaymentStatus,
} from '../types';
import { Model } from './base/Model';

export class AppState extends Model<IAppState> {
	basket: IProduct[] = [];
	catalog: IProduct[];
	loading: boolean;
	order: Partial<IOrderPayment> = {
		address: '',
		payment: null,
	};
	contacts: Partial<IOrderContacts> = {
		email: '',
		phone: '',
	};
	preview: string | null;
	formErrors: FormErrors = {};

	addToBasket(item: IProduct) {
		this.basket.push(item);
		this.events.emit('card-product:presence', { value: true });
	}

	removeFromBasket(item: IProduct) {
		this.basket = this.basket.filter((basketItem) => basketItem.id !== item.id);
		this.events.emit('card-product:presence', { value: false });
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(field: keyof IOrderPayment, value: string) {
		if (field === 'payment') {
			this.order[field] = value as PaymentStatus;
		} else {
			this.order[field] = value;
		}

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать вид платежа';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors.order:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setContactField(field: keyof IOrderContacts, value: string) {
		this.contacts[field] = value;

		if (this.validateContact()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	validateContact() {
		const errors: typeof this.formErrors = {};
		if (!this.contacts.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.contacts.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors.contact:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearBasket() {
		this.basket = [];
	}

	get orderData(): IOrder {
		return {
			payment: this.order.payment,
			address: this.order.address,
			email: this.contacts.email,
			phone: this.contacts.phone,
			total: this.basket.reduce((acc, cur) => (acc += cur.price), 0),
			items: this.basket
				.filter((item) => item.price > 0 && item.price !== null)
				.map((item) => item.id),
		};
	}
}
