 /**
  * JQCalendar JavaScript Class
  *
  * @class JQCalendar
  * @version 240119
  * @description
  *   JQCalendar is a JavaScript class designed for creating a customizable calendar with event handling capabilities.
  *   It utilizes jQuery for DOM manipulation and provides features like rendering month views, navigating through months,
  *   adding, updating, and deleting events, and more.
  *
  * @author MustafaAlhajji
  * @license MIT
  *
  * @requires jQuery
  * @requires jQueryUI
  *
  * @see https://github.com/mustafaalhajji/JQCalendar
  */

class JQCalendar {

    /**
     * 
     * @param {any} containerId
     * @param {any} options.currentDate (optional) Date object for the current date
     * @param {any} options.firstDayOfWeek (optional) 0 for Sunday, 1 for Monday, etc.
     * @param {any} options.monthNames (optional) Array of month names in order (January first)
     * @param {any} options.weekDays (optional) Array of week days in order (Sunday first)
     * @param {any} options.eventOffset (optional) set the space between two events
     * @param {Function} options.onMonthChange (optional) a handler to execute on month change
     * @param {Function} options.onMonthRender (optional) a handler to execute after rendering month
     */
    constructor(containerId, options = {}) {
        try {
            this.container = $(containerId);
        } catch {
            throw new Error('Invalid element');
        }

        const currentDate = options.currentDate || new Date();
        this.options = {
            currentYear: currentDate.getFullYear(),
            currentMonth: currentDate.getMonth(),
            currentDay: currentDate.getDate(),
            firstDayOfWeek: options.firstDayOfWeek || 0,
            eventOffset: options.eventOffset || 5,
            ...options,
        };

        if (this.options.eventOffset === 0) {
            this.options.eventOffset = 1;
            console.warn('JQCalendar: event offset can not be zero, default value of 1 px is applied');
        }

        this.monthNames = options.monthNames || ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.weekDays = options.weekDays || ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        this.monthsList = {};
        this.events = {};

        this.init();
    }

    init() {
        try {
            this.clonedElements = {
                calendarBody: {}
            };

            // Check for cloned elements for calendar rows
            this.calendarBody = this.container.find('.calendar-body');
            if (!this.calendarBody.length) {
                this.renderCalendarBody();
            }

            this.monthsListBody = this.container.find('.months-list-body');
            if (!this.monthsListBody.length) {
                this.renderMonthsListBody();
            }
            else {
                this.monthsListBody.detach();
            }

            this.yearsListBody = this.container.find('.years-list-body');
            if (!this.yearsListBody.length) {
                this.renderYearsListBody();
            }
            else {
                this.renderYearsListBody.detach();
            }

            this.clonedElements.calendarBody = {
                cell: this.calendarBody.find('.calendar-cell').clone().length ? this.calendarBody.find('.calendar-cell').clone() : $('<td>').addClass('calendar-cell').css('vertical-align', 'top').append($('<div>').addClass('day')),
                cellOut: this.calendarBody.find('.calendar-cell-out').clone().length ? this.calendarBody.find('.calendar-cell-out').clone() : $('<td>').addClass('calendar-cell-out'),
                event: this.calendarBody.find('.calendar-event').clone().length ? this.calendarBody.find('.calendar-event').clone() : $('<div>').addClass('calendar-event').css('border', 'solid thin'),
            };
            this.calendarBody.find('.calendar-row-clone').remove();

            this.clonedElements.yearsList = {
                year: this.yearsListBody.find('.years-list-year').clone().length ? this.yearsListBody.find('.years-list-year').clone() : $('<div>').addClass('years-list-year')
            };

            // Add event handlers for navigation buttons
            this.calendarBody.find('.calendar-prev-month-button').on('click', () => {
                this.options.currentMonth--;
                this.renderMonthView();
            });
            this.calendarBody.find('.calendar-next-month-button').on('click', () => {
                this.options.currentMonth++;
                this.renderMonthView();
            });
            this.calendarBody.find('.calendar-current-month').on('click', () => {
                this.calendarBody.detach();
                this.renderMonthsList();
            });

            this.monthsListBody.find('.months-list-year-header').on('click', () => {
                this.monthsListBody.detach();
                this.renderYearsList();
            });
            this.monthsListBody.find('.months-list-prev-year-button').on('click', () => {
                this.options.currentYear--;
                yearHeader.text(this.options.currentYear);
                this.renderMonthsList();
            });
            this.monthsListBody.find('.months-list-next-year-button').on('click', () => {
                this.options.currentYear++;
                this.monthsListBody.find('').text(this.options.currentYear);
                this.renderMonthsList();
            })
            this.monthsListBody.find('.months-list-month').on('click', (e) => {
                this.options.currentMonth = $(e.target).data('month') - 1;
                this.monthsListBody.detach();
                this.renderMonthView();
            });


            // Inside the init method or constructor
            this.yearsListBody.find('.years-list-prev-decade-button').on('click', () => {
                this.options.currentYear -= 10;
                this.renderYearsList();
            });

            this.yearsListBody.find('.years-list-next-decade-button').on('click', () => {
                this.options.currentYear += 10;
                this.renderYearsList();
            });


            this.renderMonthView();
        }
        catch (error) {
            console.log(error);
        }
    }

    renderCalendarBody() {
        try {
            if (this.container.html().trim() === '') {
                this.container.html(`
            <div class="calendar-body">
                <div>
                  <button class="calendar-prev-month-button">&lt;</button>
                  <button class="calendar-current-month"></button>
                  <button class="calendar-next-month-button">&gt;</button>
                </div>
                <table>
                  <thead>
                    <tr class="calendar-week-days">
                    </tr>
                  </thead>
                </table>
                </div>
              `);
            }

            this.container = $(this.container);
            this.calendarBody = this.container.find('.calendar-body');

            const firstDayOfWeek = this.options.firstDayOfWeek;
            const rotatedWeekDays = [...this.weekDays.slice(firstDayOfWeek), ...this.weekDays.slice(0, firstDayOfWeek)];
            this.container.find('.calendar-week-days').html(rotatedWeekDays.map(day => `<th class="calendar-week-day">${day}</th>`).join(''));
        }
        catch (error) {
            throw error;
        }
    }

    renderMonthView() {
        try {
            let tbody = this.calendarBody.find('tbody');
            if (tbody.length) {
                tbody.detach();
            }

            const
                currentDate = this.options.currentDate || new Date(),
                currentMonth = this.options.currentMonth || currentDate.getMonth(),
                currentYear = this.options.currentYear || currentDate.getFullYear();
            this.calendarBody.find('.calendar-current-month').text(`${this.monthNames[currentMonth]} ${currentYear}`);

            const id = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
            if (this.monthsList[id]) {
                this.container.append(this.calendarBody);
                this.container.find('table').append(this.monthsList[id]);
                this.options.onMonthChange?.();
                return;
            }

            tbody = $('<tbody>').attr('data-month', id);
            this.monthsList[id] = tbody;

            const
                daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(),
                firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
            let
                offset = (firstDayOfMonth - this.options.firstDayOfWeek + 7) % 7,
                weekRow = $('<tr>'),
                count = 0;
            for (let day = 1; day <= daysInMonth; day++) {
                while (offset > 0) {
                    weekRow.append(this.clonedElements.calendarBody.cellOut.clone());
                    offset--;
                    count++;
                    if (count === 7) {
                        while (count < 7) {
                            weekRow.append(this.clonedElements.calendarBody.cellOut.clone());
                            count++;
                        }
                        tbody.append(weekRow);
                        weekRow = $('<tr>'); // Start a new row
                        count = 0;
                    }
                }

                let dayElement = this.clonedElements.calendarBody.cell
                    .clone()
                    .attr('data-day', day);

                dayElement.find('.day').text(day);

                weekRow.append(dayElement);
                count++;
                if (count === 7 || day === daysInMonth) {
                    while (count < 7) {
                        weekRow.append(this.clonedElements.calendarBody.cellOut.clone());
                        count++;
                    }
                    tbody.append(weekRow);
                    weekRow = $('<tr>'); // Start a new row
                    count = 0;
                }
            }

            this.calendarBody.find('table').append(tbody);
            this.container.append(this.calendarBody);
            this.options.onMonthChange?.();
            this.options.onMonthRender?.();
        }
        catch (error) {
            throw error;
        }
    }

    renderMonthsListBody() {
        try {
            this.monthsListBody = $('<div>').addClass('months-list-body').html(
                `<div class="months-list-header">
                <button class="months-list-prev-year-button">&lt;&lt;</button>
                <button class="months-list-year-header"></button>
                <button class="months-list-next-year-button">&gt;&gt;</button>
            </div>
            <div class="months-list"></div>
            `
            );

            for (let i = 0; i < 12; i++) {
                this.monthsListBody.find('.months-list').append(
                    $('<div>')
                        .addClass('months-list-month')
                        .text(this.monthNames[i])
                        .attr('data-month', i + 1)
                );
            }
        }
        catch (error) {
            throw error;
        }
    }

    renderMonthsList() {
        try {
            this.monthsListBody.find('.months-list-year-header').text(this.options.currentYear);
            this.container.append(this.monthsListBody);
        }
        catch (error) {
            throw error;
        }
    }

    renderYearsListBody() {
        try {
            this.yearsListBody = $('<div>').addClass('years-list-body').html(
                `<div class="years-list-header">
                <button class="years-list-prev-decade-button">&lt;&lt;</button>
                <button class="years-list-decade-header"></button>
                <button class="years-list-next-decade-button">&gt;&gt;</button>
            </div>
            <div class="years-list">
                <div class="years-list-year"></div>
            </div>
            `
            );
        }
        catch (error) {
            throw error;
        }
    }

    renderYearsList() {
        try {
            this.yearsListBody.find('.years-list-decade-header').text(`${Math.floor(this.options.currentYear / 10) * 10} - ${Math.floor(this.options.currentYear / 10) * 10 + 9}`);
            const startDecade = Math.floor(this.options.currentYear / 10) * 10;
            this.yearsListBody.find('.years-list-year').remove();
            for (let i = 0; i < 10; i++) {
                this.yearsListBody.find('.years-list').append(
                    this.clonedElements.yearsList.year
                        .clone()
                        .text(startDecade + i)
                        .click(() => {
                            this.options.currentYear = startDecade + i;
                            this.yearsListBody.detach();
                            this.renderMonthView();
                        })
                );
            }
            this.container.append(this.yearsListBody);
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * Add event to calendar
     * @param {object} options
     * @param {string} options.title 
     * @param {string|Date} options.startDate
     * @param {string|int} options.id (optional)
     * @param {string|Date} options.finishDate (optional) 
     * @param {int} options.duration (optional) in minutes if no finishDate is passed
     * @param {boolean=false} options.repeatTitle (optional) 
     * @param {Function} options.onClick (optional) 
     * @returns {boolean}
     */
    addEvent(options = {}) {
        try {
            options.id = options.id || this.generateUniqueId();
            const
                startDate = new Date(options.startDate),
                finishDate = options.finishDate ? new Date(options.finishDate) : new Date(startDate.getTime() + (options.duration || 60) * 60000);

            // If finishDate is at midnight, subtract one minute to avoid having a duration of 1440 minutes (24 hours)
            if (finishDate.getHours() === 0 && finishDate.getMinutes() === 0) {
                finishDate.setMinutes(finishDate.getMinutes() - 1);
            }

            options.startDate = startDate;
            options.finishDate = finishDate;
            this.events[options.id] = options;

            const datesInRange = this.getDatesInRange(startDate, finishDate);

            for (let i = 0; i < datesInRange.length; i++) {
                const
                    date = datesInRange[i],
                    dayElement = this.calendarBody.find(`tbody[data-month="${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}"] td[data-day="${date.getDate()}"]`);

                const
                    row = dayElement.parent(),
                    eventElement = this.clonedElements.calendarBody.event
                        .clone()
                        .text(options.title)
                        .css('position', 'absolute')
                        .attr('data-id', options.id);

                // compute event width
                if (datesInRange.length > 1) {
                    let lastCell = row.find(`.calendar-cell[data-day=${options.finishDate.getDate()}]`);
                    if (lastCell.length) {
                        i = datesInRange.length;
                    }
                    else {
                        lastCell = row.find('.calendar-cell').last();
                        i += lastCell.index() - dayElement.index();
                    }

                    eventElement
                        .css('width', `${(lastCell.offset().left + lastCell.outerWidth()) - dayElement.offset().left}px`);
                }

                // compute event top margin ensure no overlap
                const cellArea = {
                    top: dayElement.find('.day').offset().top + dayElement.find('.day').outerHeight(),
                    left: dayElement.offset().left,
                    right: dayElement.offset().left + dayElement.outerWidth(),
                    bottom: dayElement.offset().top + dayElement.find('.day').outerHeight() + dayElement.outerHeight(),
                };

                let
                    run = true,
                    margin = 0,
                    eventTop = cellArea.top,
                    eventsList = [];

                row.find('.calendar-event').each((index, event) => {
                    event = $(event);
                    const
                        eventArea = {
                            top: event.offset().top,
                            left: event.offset().left,
                            right: event.offset().left + event.outerWidth(),
                            bottom: event.offset().top + event.outerHeight(),
                        };
                    if (eventArea.right >= cellArea.left || event.parent() == dayElement) {
                        eventsList.push(event);
                    }
                });

                while (run) {
                    let noConflict = true;

                    eventsList.forEach((event) => {
                        event = $(event);
                        const eventArea = {
                            top: event.offset().top,
                            left: event.offset().left,
                            right: event.offset().left + event.outerWidth(),
                            bottom: event.offset().top + event.outerHeight(),
                        };

                        if (eventTop >= eventArea.top && eventTop <= eventArea.bottom) {
                            eventTop += this.options.eventOffset;
                            margin += this.options.eventOffset;
                            noConflict = false;
                        }
                    });
                    if (noConflict) {
                        run = false;
                    }
                }
                eventElement.css('margin-top', `${margin}px`);

                // Add the event to the calendar DOM
                dayElement.append(eventElement);

                // Assign the click handler
                if (options.onClick) {
                    eventElement.click(options.onClick);
                }

                // correct row height
                let
                    rowHeight = 0;
                row.children().each((index, cell) => {
                    $(cell).find('.calendar-event').each((index, event) => {
                        const bottomOffset = $(event).offset().top + $(event).outerHeight();
                        if (bottomOffset > rowHeight) {
                            rowHeight = bottomOffset;
                        }
                    });
                });
                rowHeight -= row.offset().top;

                row.css('height', `${rowHeight}px`);

            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {any} id
     * @returns
     */
    deleteEvent(id) {
        try {
            if (id in this.events) {
                // Check in detached calendars
                for (const monthId in this.monthsList) {
                    const detachedCalendar = this.monthsList[monthId];
                    const eventElements = detachedCalendar.find(`.calendar-event[data-id=${id}], .calendar-event-start[data-id=${id}], .calendar-event-finish[data-id=${id}], .calendar-event-finish-repeat[data-id=${id}], .calendar-event-duration[data-id=${id}], .calendar-event-duration-repeat[data-id=${id}]`);

                    if (eventElements.length) {
                        eventElements.remove();
                    }
                }

                delete this.events[id];
                return true;
            }
            return false;
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {any} id
     * @param {any} updatedOptions
     * @returns
     */
    updateEvent(id, updatedOptions) {
        try {
            if (id in this.events) {
                const clonedOptions = { ...this.events[id], ...updatedOptions };

                // Delete the existing event
                this.deleteEvent(id);

                // Add the updated event
                this.addEvent(clonedOptions);

                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    generateUniqueId() {
        return Math.random().toString(36).substr(2, 9); // Generate a random unique id
    }

    getDatesInRange(startDate, finishDate) {
        const dates = [];
        const current = new Date(startDate);

        while (current.getTime() <= finishDate.getTime()) {
            const currentDate = new Date(current);
            // Check if the date already exists in the array
            if (!dates.some(date => date.getTime() === currentDate.getTime())) {
                dates.push(currentDate);
            }

            current.setDate(current.getDate() + 1);
        }

        // Check if the finishDate has a partial time
        if (finishDate.getHours() > 0 || finishDate.getMinutes() > 0 || finishDate.getSeconds() > 0 || finishDate.getMilliseconds() > 0) {
            const finishDateWithPartialTime = new Date(finishDate);

            // Check if the finishDate with partial time already exists in the array
            if (!dates.some(date => date.getDate() === finishDateWithPartialTime.getDate())) {
                dates.push(finishDateWithPartialTime);
            }
        }

        return dates;
    }

    getOptions() {
        return this.options;
    }
}
