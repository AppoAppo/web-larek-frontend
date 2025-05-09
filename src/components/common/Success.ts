import { TOTAL_MESSAGE } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}

		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
	}

	set total(value: string) {
		this.setText(this._total, TOTAL_MESSAGE(value));
	}
}
