# JQCalendar

# JQCalendar JavaScript Class Documentation

## Introduction

`JQCalendar` is a JavaScript class designed to create a customizable calendar with event handling capabilities. This class uses jQuery for DOM manipulation and provides features such as rendering a month view, navigating through months, adding, updating, and deleting events, and more.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Constructor](#constructor)
- [Methods](#methods)
  - [init](#init)
  - [renderCalendarBody](#rendercalendarbody)
  - [renderMonthView](#rendermonthview)
  - [renderMonthsListBody](#rendermonthslistbody)
  - [renderMonthsList](#rendermonthslist)
  - [renderYearsListBody](#renderyearslistbody)
  - [renderYearsList](#renderyearslist)
  - [addEvent](#addevent)
  - [deleteEvent](#deleteevent)
  - [updateEvent](#updateevent)
  - [generateUniqueId](#generateuniqueid)
  - [getDatesInRange](#getdatesinrange)
  - [getOptions](#getoptions)

## Installation

Include jQuery and jQuery UI in your project before using the JQCalendar class. You can include them using the following CDN links:

```html
<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="path/to/JQCalendar.js"></script>
```

## Usage

```javascript
// Create an instance of JQCalendar
const calendar = new JQCalendar('#calendarContainer', {
    currentDate: new Date(),
    firstDayOfWeek: 0,
    // Add more customization options as needed
});

// Add an event to the calendar
calendar.addEvent({
    title: 'Sample Event',
    startDate: '2024-01-19T08:00:00',
    finishDate: '2024-01-19T10:00:00',
    onClick: () => {
        alert('Event clicked!');
    },
});
```

## Constructor

### JQCalendar(containerId, options)

#### Parameters

- `containerId` (string): The ID or reference to the HTML element that will contain the calendar.
- `options` (object, optional): An object containing customization options.
  - `currentDate` (Date, optional): Date object for the current date. Defaults to the current date.
  - `firstDayOfWeek` (number, optional): The index of the first day of the week (0 for Sunday, 1 for Monday, etc.). Defaults to 0.
  - `monthNames` (Array, optional): Array of month names in order (January first). Defaults to English month names.
  - `weekDays` (Array, optional): Array of week days in order (Sunday first). Defaults to English week days.
  - `eventOffset` (number, optional): Set the space between two events. Defaults to 5.
  - `onMonthChange` (Function, optional): A handler to execute on month change.
  - `onMonthRender` (Function, optional): A handler to execute after rendering the month.

#### Example

```javascript
const calendar = new JQCalendar('#calendarContainer', {
    currentDate: new Date(),
    firstDayOfWeek: 0,
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    eventOffset: 10,
    onMonthChange: () => {
        console.log('Month changed!');
    },
});
```

## Methods

### init

```javascript
calendar.init();
```

This method initializes the calendar, creating necessary elements and attaching event handlers for navigation buttons.

### renderCalendarBody

```javascript
calendar.renderCalendarBody();
```

Renders the calendar body, including navigation buttons and week day headers.

### renderMonthView

```javascript
calendar.renderMonthView();
```

Renders the month view, displaying the calendar grid for the current month.

### renderMonthsListBody

```javascript
calendar.renderMonthsListBody();
```

Renders the months list body, including navigation buttons and month names.

### renderMonthsList

```javascript
calendar.renderMonthsList();
```

Renders the months list, allowing the user to select a specific month.

### renderYearsListBody

```javascript
calendar.renderYearsListBody();
```

Renders the years list body, including navigation buttons and decade header.

### renderYearsList

```javascript
calendar.renderYearsList();
```

Renders the years list, allowing the user to select a specific year.

### addEvent

```javascript
calendar.addEvent(options);
```

Adds an event to the calendar.

#### Parameters

- `options` (object): An object containing event details.
  - `title` (string): Title of the event.
  - `startDate` (string|Date): Start date and time of the event.
  - `id` (string|int, optional): Unique identifier for the event.
  - `finishDate` (string|Date, optional): Finish date and time of the event.
  - `duration` (int, optional): Duration of the event in minutes (if no finishDate is provided).
  - `repeatTitle` (boolean, optional): Whether to repeat the event title.
  - `onClick` (Function, optional): Handler function to execute on event click.

#### Returns

- `boolean`: Returns `true` if the event is added successfully.

#### Example

```javascript
calendar.addEvent({
    title: 'Meeting',
    startDate: '2024-01-19T14:00:00',
    finishDate: '2024-01-19T16:00:00',
    onClick: () => {
        alert('Meeting clicked!');
    },
});
```

### deleteEvent

```javascript
calendar.deleteEvent(id);
```

Deletes an event from the calendar.

#### Parameters

- `id` (any): The unique identifier of the event.

#### Returns

- `boolean`: Returns `true` if the event is deleted successfully.

#### Example

```javascript
calendar.deleteEvent('uniqueEventId');
```

### updateEvent

```javascript
calendar.updateEvent(id, updatedOptions);
```

Updates an existing event in the calendar.

#### Parameters

- `id` (any): The unique identifier of the event.
- `updatedOptions` (object): Updated event options.

#### Returns

- `boolean`: Returns `true` if the event is updated successfully.

#### Example

```javascript
calendar.updateEvent('uniqueEventId', { title: 'Updated Meeting' });
```

### generateUniqueId

```javascript
calendar.generateUniqueId();
```

Generates a random unique ID for events.

#### Returns

- `string`: A randomly generated unique ID.

### getDatesInRange

```javascript
calendar.getDatesInRange(startDate, finishDate);
```

Generates an array of Date objects within a specified date range.

#### Parameters

- `startDate` (Date): Start date of the range.
- `finishDate` (Date): Finish date of the range.

#### Returns

- `Array`: An array of Date objects within the specified range.

### getOptions

```javascript
calendar.getOptions

();
```

Retrieves the current options of the calendar.

#### Returns

- `object`: An object containing the current options of the calendar.

#### Example

```javascript
const options = calendar.getOptions();
console.log(options);
```

This documentation provides an overview of the JQCalendar class and its methods. For detailed information on customization options and usage examples, refer to the code comments and the provided example in the documentation.
