import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { CardInBasket, CardInCatalog, CardInModal } from './components/Cards';
import { Basket } from './components/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { Contacts } from './components/Contacts';
import { LarekAPI } from './components/LarekAPI';
import { Order } from './components/Order';
import { Page } from './components/Page';
import './scss/styles.scss';
import {
	CardModalActions,
	IOrderContacts,
	IOrderPayment,
	IProduct,
	PaymentStatus,
} from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// // Чтобы мониторить все события, для отладки
// events.onAll(({ eventName, data }) => {
// 	console.log(eventName, data);
// });

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const cardModal = new CardInModal(cloneTemplate(cardPreviewTemplate), {
	onClick: () => {
		events.emit('card-product:button', { value: cardModal.buttonText });
	},
});
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

//Данные загружены с сервера
events.on('initialData:loaded', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CardInCatalog('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Открыть лот
events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

// Открыть корзину
events.on('basket:open', () => {
	basket.items = appData.basket.map((item, index) => {
		const card = new CardInBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:delete', item),
		});
		card.itemIndex = index + 1;
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
	const basketTotal = appData.basket.reduce(
		(accumulator, currentItem) => accumulator + currentItem.price,
		0
	);
	basket.total = basketTotal;
	basket.valid = basketTotal > 0 ? true : false;
	modal.render({ content: basket.render() });
});

events.on('card-product:presence', (presence: { value: boolean }) => {
	cardModal.buttonText = presence.value ? 'Удалить' : 'Купить';
});

events.on('card:delete', (item: IProduct) => {
	appData.removeFromBasket(item);
	basket.items = appData.basket.map((item, index) => {
		const card = new CardInBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:delete', item),
		});
		card.itemIndex = index + 1;
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
	basket.total = appData.basket.reduce(
		(accumulator, currentItem) => accumulator + currentItem.price,
		0
	);
	page.counter = appData.basket.length;
	modal.render({ content: basket.render() });
});

events.on('card-product:button', (event: { value: string }) => {
	if (!appData.preview) return;
	api
		.getProductItem(appData.preview)
		.then((result) => {
			if (event.value === CardModalActions.remove) {
				appData.removeFromBasket(result);
			} else {
				appData.addToBasket(result);
			}
			page.counter = appData.basket.length;
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменен открытый выбранный лот
events.on('preview:changed', (item: IProduct) => {
	const showItem = (item: IProduct) => {
		modal.render({
			content: cardModal.render({
				title: item.title,
				image: item.image,
				description: item.description,
				price: item.price,
				category: item.category,
			}),
		});
		cardModal.buttonText = appData.basket.some(
			(basketItem) => basketItem.id === item.id
		)
			? CardModalActions.remove
			: CardModalActions.buy;
	};

	if (item) {
		api
			.getProductItem(item.id)
			.then((result) => {
				showItem(result);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

// Отправлена форма заказа
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});
// Отправлена форма контактов с данными на бек
events.on('contacts:submit', () => {
	api
		.orderProducts(appData.orderData)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
					page.counter = 0;
				},
			});
			success.total = result.total.toString();
			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось состояние валидации формы платежа
events.on('formErrors.order:change', (errors: Partial<IOrderPayment>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});
// Изменилось состояние валидации формы контактов
events.on('formErrors.contact:change', (errors: Partial<IOrderContacts>) => {
	const { phone, email } = errors;
	contacts.valid = !phone && !email;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей на форме платежа
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderPayment; value: string }) => {
		appData.setOrderField(data.field, data.value);
		if (data.field === 'payment') {
			order.payment = data.value as PaymentStatus;
		}
	}
);
// Изменилось одно из полей на форме контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderContacts; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

// Открыть форму платежа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: undefined,
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем лоты с сервера
api
	.getProductList()
	.then((products) => {
		appData.setCatalog(products);
		events.emit('initialData:loaded');
	})
	.catch((err) => {
		console.error(err);
	});
