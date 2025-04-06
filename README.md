https://github.com/AppoAppo/web-larek-frontend.git

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

Вот обновленная документация с единой стилизацией в формате Markdown. Я унифицировал заголовки, отступы, выделение кода и структуру для всех разделов:

---

# Данные и типы данных

## Данные товара

```typescript
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
```

## Состояние приложения

```typescript
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
}
```

## Данные платежа

```typescript
export type PaymentStatus = 'card' | 'cash';

export interface IOrderPayment {
	payment: PaymentStatus;
	address: string;
}
```

## Контактные данные

```typescript
export interface IOrderContacts {
	email: string;
	phone: string;
}
```

## Объединенная форма заказа

```typescript
type IOrderForm = IOrderPayment & IOrderContacts;
```

## Итоговый набор данных для заказа

```typescript
export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}
```

## Ответные данные после заказа

```typescript
export interface IOrderResult {
	id: string;
	total: number;
}
```

## Ошибки валидации форм

```typescript
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
```

---

## Константы приложения

- **`API_URL`**  
  Базовый URL для API.

- **`CDN_URL`**  
  Базовый URL для CDN (контента).

- **`PAYMENT_STATUS`**  
  Перечисление видов оплаты: `card` и `cash`.

- **`CARD_MODAL_ACTIONS`**  
  Тексты действий в модальном окне товара: `Удалить` и `Купить`.

- **`CATEGORY_CLASS`**  
  Соответствие категорий карточек и их CSS-классов.

- **`DEFAULT_BLOCK_NAME`**  
  Имя блока по умолчанию: `card`.

- **`IMAGE_EXTENSION`**  
  Расширение изображений: `png`.

- **`PAYMENT_FIELD`**  
  Название поля оплаты: `payment`.

- **`ORDER_ACTIVE_BUTTON_CLASS`**  
  Класс активной кнопки: `button_alt-active`.

- **`BASKET_IS_EMPTY`**  
  Текст для пустой корзины: `Корзина пуста`.

- **`TOTAL_MESSAGE`**  
  Шаблон сообщения о списании: `Списано ${value} синапсов`.

- **`PRICE_MESSAGES`**  
  Сообщения о цене: `WITH_VALUE` (`${value} синапсов`), `PRICELESS` (`Бесценно`).

- **`ORDER_PAYMENT_FIELDS`**  
  Поля формы оплаты: `payment`, `address`.

- **`ORDER_CONTACTS_FIELDS`**  
  Поля формы контактов: `phone`, `email`.

- **`VALIDATION_ERRORS`**  
  Тексты ошибок валидации: `phone`, `email`, `address`, `payment`.

- **`APP_EVENT_SUBMIT`**  
  Событие отправки формы.

- **`APP_EVENT_CHANGE`**  
  Событие изменения значения в поле формы.

- **`APP_EVENTS`**  
  События приложения.

---

# Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- **Слой представления**: Отвечает за отображение данных на странице.
- **Слой данных**: Управляет хранением и изменением данных.
- **Презентер**: Обеспечивает связь между представлением и данными.

---

## Базовый код

### Класс `Api`

Базовая логика отправки запросов.

- **Методы**:
  - `get`: Выполняет GET-запрос, возвращает промис с ответом сервера.
  - `post`: Отправляет данные в JSON на указанный ендпоинт (по умолчанию POST, метод переопределяем).

### Класс `EventEmitter`

Брокер событий для отправки и подписки на события.

- **Интерфейс `IEvents`**:
  - `on`: Подписка на событие.
  - `emit`: Инициализация события.
  - `trigger`: Возвращает функцию для генерации события.
  - `onAll`, `offAll`: Служебные методы для отладки.

### Класс `Component<T>`

Базовый класс для компонентов.

- **Метод `render`**: Обновляет данные через сеттеры, возвращает контейнер.

### Класс `Model<T>`

Базовая модель, чтобы можно было отличить ее от простых объектов с данными.

- **Метод `emitChanges`**: Сообщить всем что модель поменялась.

---

## Слой данных

### Класс `AppState`

Управляет состоянием приложения.

- **Поля**:
  - `basket: IProduct[]` — Товары в корзине.
  - `catalog: IProduct[]` — Список товаров в каталоге.
  - `order: Partial<IOrderPayment>` — Данные оплаты.
  - `contacts: Partial<IOrderContacts>` — Контактные данные.
  - `preview: string | null` — ID товара для превью.
  - `formErrors: FormErrors` — Ошибки валидации.
- **Методы**:
  - `addToBasket(item: IProduct)`: Добавляет товар в корзину, вызывает `card-product:presence`.
  - `removeFromBasket(item: IProduct)`: Удаляет товар из корзины, вызывает `card-product:presence`.
  - `setCatalog(items: IProduct[])`: Обновляет каталог, вызывает `items:changed`.
  - `setPreview(item: IProduct)`: Устанавливает товар для превью, вызывает `preview:changed`.
  - `setOrderField(field: keyof IOrderPayment, value: string)`: Обновляет поле заказа.
  - `validateOrder()`: Проверяет валидность заказа, вызывает `formErrors.order:change`.
  - `setContactField(field: keyof IOrderContacts, value: string)`: Обновляет поле контактов.
  - `validateContact()`: Проверяет валидность контактов, вызывает `formErrors.contact:change`.
  - `clearBasket()`: Очищает корзину.
  - `getProductById(id: string): IProduct`: возвращает товар по id.
  - `getBasketTotal(): number`: возвращает сумму корзины.
- **Геттеры**:
  - `orderData: IOrder` — Возвращает объект заказа с полями `payment`, `address`, `email`, `phone`, `total`, `items`.
- **События**:
  - `card-product:presence` — Изменение состава корзины.
  - `items:changed` — Обновление каталога.
  - `preview:changed` — Изменение превью.
  - `order:ready` — Данные заказа заполнены.
  - `contacts:ready` — Контакты заполнены.
  - `formErrors.*:change` — Ошибки валидации.

---

## Слой представления

### Класс `Form<T>`

Управляет HTML-формой.

- **Поля**:
  - `_submit: HTMLButtonElement` — Кнопка отправки.
  - `_errors: HTMLElement` — Контейнер ошибок.
  - `container: HTMLFormElement` — Элемент формы.
  - `events: IEvents` — Система событий.
- **Методы**:
  - `onInputChange(field: keyof T, value: string)`: Эмитит событие `${имя_формы}.${поле}:change`.
  - `render(state: Partial<T> & IFormState)`: Обновляет форму (валидность, ошибки, значения).
- **Сеттеры**:
  - `valid: boolean` — Управляет активностью кнопки.
  - `errors: string` — Устанавливает текст ошибок.
- **События**:
  - `${formName}:submit` — Попытка отправки формы.
  - `${formName}.${field}:change` — Изменение поля.

### Класс `Modal`

Реализует модальное окно.

- **Поля**:
  - `_content: HTMLElement` — Контент модального окна.
  - `_closeButton: HTMLButtonElement` — Кнопка закрытия.
- **Методы**:
  - `open`: Открывает модалку.
  - `close`: Закрывает модалку (клику на оверлей или крестик).

### Класс `Card`

Карточка товара.

- **Поля**:
  - `_title: HTMLElement` — Заголовок.
  - `_price: HTMLElement` — Цена.
  - `_button?: HTMLButtonElement` — Кнопка (опционально).
- **Свойства**:
  - `id`: Устанавливает/получает `data-id`.
  - `title`: Устанавливает/получает текст заголовка.
  - `price`: Форматирует цену (`${value} синапсов` или `Бесценно`).

### Класс `Success`

Отображение успешного результата.

- **Поля**:
  - `_close: HTMLElement` — Кнопка закрытия.
  - `_total: HTMLElement` — Сумма.
- **Свойства**:
  - `total`: Устанавливает текст суммы.

### Класс `CardInCatalog`

Карточка для каталога.

- **Поля**:
  - `_category: HTMLElement` — Категория.
  - `_image?: HTMLImageElement` — Изображение.
- **Свойства**:
  - `category`: Устанавливает текст и класс категории.
  - `image`: Устанавливает изображение (`.png`).

### Класс `CardInModal`

Карточка в модальном окне.

- **Поля**:
  - `_description?: HTMLElement` — Описание.
  - `_buttonText: string` — Текст кнопки.
- **Свойства**:
  - `buttonText`: Устанавливает/получает текст кнопки.
  - `description`: Устанавливает описание.

### Класс `CardInBasket`

Карточка в корзине.

- **Поля**:
  - `_itemIndex: HTMLElement` — Индекс.
- **Свойства**:
  - `itemIndex`: Устанавливает номер позиции.

### Класс `Contacts`

Форма контактов.

- **Свойства**:
  - `phone`: Устанавливает значение телефона.
  - `email`: Устанавливает значение email.

### Класс `Order`

Форма оплаты.

- **Поля**:
  - `_buttonCash: HTMLButtonElement` — Кнопка наличных.
  - `_buttonCard: HTMLButtonElement` — Кнопка карты.
- **Свойства**:
  - `payment`: Устанавливает способ оплаты (класс `button_alt-active`).
  - `address`: Устанавливает адрес.
- **События**:
  - `order.payment:change`: изменение формы оплаты.

### Класс `Page`

Управление страницей.

- **Поля**:
  - `_counter: HTMLElement` — Счетчик корзины.
  - `_catalog: HTMLElement` — Каталог.
  - `_basket: HTMLElement` — Кнопка корзины.
  - `_wrapper: HTMLElement` — Обертка.
- **Свойства**:
  - `counter`: Устанавливает счетчик.
  - `catalog`: Обновляет каталог.
  - `locked`: Блокирует/разблокирует прокрутку.
- **События**:
  - `basket:open`: открытие корзины.

### Класс `Basket`

Управляет отображением корзины с товарами, общей суммой и кнопкой оформления заказа.

- **Поля**:
  - `_list: HTMLElement` — Контейнер для списка товаров.
  - `_total: HTMLElement` — Элемент с общей суммой.
  - `_button: HTMLButtonElement` — Кнопка оформления заказа.
- **Сеттеры**:
  - `items: HTMLElement[]` — Устанавливает список товаров в `_list`, при пустом списке отображает `BASKET_IS_EMPTY`.
  - `total: number` — Устанавливает отформатированную сумму в `_total` с помощью `formatNumber`.
- **События**:
  - `order:open` — Срабатывает при клике на кнопку оформления, открывает форму заказа.

---

## Слой коммуникации

### Класс `LarekAPI`

API для работы с бэкендом.

- **Поля**:
  - `cdn: string` — Адрес CDN.
- **Методы**:
  - `getProductList()`: Получает список продуктов.
  - `orderProducts(order: IOrder)`: Отправляет заказ.

---

## Взаимодействие компонентов

Презентер (`index.ts`) связывает представление и данные через события `EventEmitter`.  
Экземпляры классов создаются, затем настраиваются обработчики событий.

### Список событий

1. **`initialData:loaded`**  
   Заполняет каталог после загрузки данных.
2. **`card:select`**  
   Устанавливает товар для превью.
3. **`basket:open`**  
   Открывает корзину в модальном окне.
4. **`card-product:presence`**  
   Обновляет текст кнопки в зависимости от корзины.
5. **`card:delete`**  
   Удаляет товар из корзины.
6. **`card-product:button`**  
   Добавляет/удаляет товар из корзины.
7. **`preview:changed`**  
   Отображает или скрывает превью.
8. **`order:submit`**  
   Открывает форму контактов.
9. **`contacts:submit`**  
   Отправляет заказ, показывает успех.
10. **`formErrors.order:change`**  
    Обновляет валидацию формы оплаты.
11. **`formErrors.contact:change`**  
    Обновляет валидацию формы контактов.
12. **`/^order\..*:change/`**  
    Обновляет данные формы оплаты.
13. **`/^contacts\..*:change/`**  
    Обновляет данные формы контактов.
14. **`order:open`**  
    Открывает форму оплаты.
15. **`modal:open`**  
    Блокирует прокрутку страницы.
16. **`modal:close`**  
    Разблокирует прокрутку страницы.
