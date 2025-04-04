import { IOrderPayment, PaymentStatus } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
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
			events.emit('order.payment:change', {
				field: 'payment',
				value: 'cash',
			});
		});
		this._buttonCard.addEventListener('click', () => {
			events.emit('order.payment:change', {
				field: 'payment',
				value: 'card',
			});
		});
	}

	set payment(value: PaymentStatus) {
		if (!value) return;
		switch (value) {
			case 'card':
				this._buttonCard.classList.toggle('button_alt-active', true);
				this._buttonCash.classList.toggle('button_alt-active', false);
				break;
			case 'cash':
				this._buttonCash.classList.toggle('button_alt-active', true);
				this._buttonCard.classList.toggle('button_alt-active', false);
				break;
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
