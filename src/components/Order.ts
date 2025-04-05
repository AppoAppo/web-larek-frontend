import { IOrderPayment } from '../types';
import {
	APP_EVENTS,
	ORDER_ACTIVE_BUTTON_CLASS,
	ORDER_PAYMENT_FIELDS,
	PAYMENT_STATUS,
} from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/Events';
import { Form } from './common/Form';

export class Order extends Form<IOrderPayment> {
	protected _buttonCash: HTMLButtonElement;
	protected _buttonCard: HTMLButtonElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttonCash = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			this.container
		);
		this._buttonCard = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			this.container
		);
		this._buttonCash.addEventListener('click', () => {
			events.emit(APP_EVENTS.orderChangePayment, {
				field: ORDER_PAYMENT_FIELDS.payment,
				value: PAYMENT_STATUS.bycash,
			});
		});
		this._buttonCard.addEventListener('click', () => {
			events.emit(APP_EVENTS.orderChangePayment, {
				field: ORDER_PAYMENT_FIELDS.payment,
				value: PAYMENT_STATUS.bycard,
			});
		});
	}

	set payment(value: string) {
		if (!value) return;
		switch (value) {
			case PAYMENT_STATUS.bycard:
				this.toggleClass(this._buttonCard, ORDER_ACTIVE_BUTTON_CLASS, true);
				this.toggleClass(this._buttonCash, ORDER_ACTIVE_BUTTON_CLASS, false);
				break;
			case PAYMENT_STATUS.bycash:
				this.toggleClass(this._buttonCash, ORDER_ACTIVE_BUTTON_CLASS, true);
				this.toggleClass(this._buttonCard, ORDER_ACTIVE_BUTTON_CLASS, false);
				break;
		}
	}

	set address(value: string) {
		(
			this.container.elements.namedItem(
				ORDER_PAYMENT_FIELDS.address
			) as HTMLInputElement
		).value = value;
	}
}
