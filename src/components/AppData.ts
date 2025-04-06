import {
	FormErrors,
	IAppState,
	IOrder,
	IOrderContacts,
	IOrderPayment,
	IProduct,
	PaymentStatus,
} from '../types';
import {
	APP_EVENTS,
	ORDER_PAYMENT_FIELDS,
	PAYMENT_STATUS,
	VALIDATION_ERRORS,
} from '../utils/constants';
import { Model } from './base/Model';

export class AppState extends Model<IAppState> {
	basket: IProduct[] = [];
	catalog: IProduct[];
	order: Partial<IOrderPayment> = {
		address: '',
		payment: PAYMENT_STATUS.bycard,
	};
	contacts: Partial<IOrderContacts> = {
		email: '',
		phone: '',
	};
	preview: string | null;
	formErrors: FormErrors = {};

	addToBasket(item: IProduct) {
		this.basket.push(item);
		this.events.emit(APP_EVENTS.cardProductPresence, { value: true });
	}

	removeFromBasket(item: IProduct) {
		this.basket = this.basket.filter((basketItem) => basketItem.id !== item.id);
		this.events.emit(APP_EVENTS.cardProductPresence, { value: false });
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges(APP_EVENTS.itemsChanged, { catalog: this.catalog });
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges(APP_EVENTS.previewChanged, item);
	}

	setOrderField(field: keyof IOrderPayment, value: string) {
		if (field === ORDER_PAYMENT_FIELDS.payment) {
			this.order[field] = value as PaymentStatus;
		} else {
			this.order[field] = value;
		}

		if (this.validateOrder()) {
			this.events.emit(APP_EVENTS.orderReady, this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = VALIDATION_ERRORS.payment;
		}
		if (!this.order.address) {
			errors.address = VALIDATION_ERRORS.address;
		}
		this.formErrors = errors;
		this.events.emit(APP_EVENTS.formErrorsOrderChange, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setContactField(field: keyof IOrderContacts, value: string) {
		this.contacts[field] = value;

		if (this.validateContact()) {
			this.events.emit(APP_EVENTS.contactsReady, this.order);
		}
	}

	validateContact() {
		const errors: typeof this.formErrors = {};
		if (!this.contacts.email) {
			errors.email = VALIDATION_ERRORS.email;
		}
		if (!this.contacts.phone) {
			errors.phone = VALIDATION_ERRORS.phone;
		}
		this.formErrors = errors;
		this.events.emit(APP_EVENTS.formErrorsContactChange, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearBasket() {
		this.basket = [];
		this.order = { payment: PAYMENT_STATUS.bycard, address: '' };
		this.contacts = { phone: '', email: '' };
	}

	getProductById(id: string): IProduct {
		return this.catalog.find((item) => item.id === id);
	}

	getBasketTotal(): number {
		return this.basket.reduce(
			(accumulator, currentItem) => accumulator + currentItem.price,
			0
		);
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
