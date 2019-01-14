(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * easytimer.js
 * Generated: 2018-12-14
 * Version: 3.0.0
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.easytimer = {})));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function leftPadding(string, padLength, character) {
    var i;
    var characters = '';

    if (string.length > padLength) {
      return string;
    }

    for (i = 0; i < padLength; i = i + 1) {
      characters += String(character);
    }

    return (characters + string).slice(-characters.length);
  }

  function TimeCounter() {
    this.secondTenths = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    this.days = 0;
    /**
     * [toString convert the counted values on a string]
     * @param  {[array]} units           [array with the units to display]
     * @param  {[string]} separator       [separator of the units]
     * @param  {[integer]} leftZeroPadding [number of zero padding]
     * @return {[string]}                 [result string]
     */

    this.toString = function (units, separator, leftZeroPadding) {
      units = units || ['hours', 'minutes', 'seconds'];
      separator = separator || ':';
      leftZeroPadding = leftZeroPadding || 2;
      var stringTime;
      var arrayTime = [];
      var i;

      for (i = 0; i < units.length; i = i + 1) {
        if (this[units[i]] !== undefined) {
          if (units[i] === 'secondTenths') {
            arrayTime.push(this[units[i]]);
          } else {
            arrayTime.push(leftPadding(this[units[i]], leftZeroPadding, '0'));
          }
        }
      }

      stringTime = arrayTime.join(separator);
      return stringTime;
    };
  }

  /*
  * Polyfill por IE9, IE10 and IE11
  */
  var CustomEvent$1 = typeof window !== 'undefined' ? window.CustomEvent : undefined;

  if (typeof window !== 'undefined' && typeof CustomEvent$1 !== 'function') {
    CustomEvent$1 = function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    CustomEvent$1.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent$1;
  }

  /*
   * General functions, variables and constants
   */

  var SECOND_TENTHS_PER_SECOND = 10;
  var SECONDS_PER_MINUTE = 60;
  var MINUTES_PER_HOUR = 60;
  var HOURS_PER_DAY = 24;
  var SECOND_TENTHS_POSITION = 0;
  var SECONDS_POSITION = 1;
  var MINUTES_POSITION = 2;
  var HOURS_POSITION = 3;
  var DAYS_POSITION = 4;
  var SECOND_TENTHS = 'secondTenths';
  var SECONDS = 'seconds';
  var MINUTES = 'minutes';
  var HOURS = 'hours';
  var DAYS = 'days';
  var unitsInMilliseconds = {
    secondTenths: 100,
    seconds: 1000,
    minutes: 60000,
    hours: 3600000,
    days: 86400000
  };
  var groupedUnits = {
    secondTenths: SECOND_TENTHS_PER_SECOND,
    seconds: SECONDS_PER_MINUTE,
    minutes: MINUTES_PER_HOUR,
    hours: HOURS_PER_DAY
  };
  var events = typeof module !== 'undefined' && module.exports && typeof require === 'function' ? require('events') : undefined;

  function hasDOM() {
    return typeof document !== 'undefined';
  }

  function hasEventEmitter() {
    return events;
  }

  function mod(number, module) {
    return (number % module + module) % module;
  }
  /**
   * [Timer Timer/Chronometer/Countdown compatible with AMD and NodeJS.
   * Can update time values with different time intervals: tenth of seconds,
   * seconds, minutes and hours.]
   */


  function Timer() {
    /*
    * PRIVATE variables and Functions
    */
    var counters = new TimeCounter();
    var totalCounters = new TimeCounter();
    var intervalId;
    var eventEmitter = hasDOM() ? document.createElement('span') : hasEventEmitter() ? new events.EventEmitter() : undefined;
    var running = false;
    var paused = false;
    var precision;
    var timerTypeFactor;
    var customCallback;
    var timerConfig = {};
    var currentParams;
    var targetValues;
    var startValues;
    var countdown;
    var startingDate;
    var targetDate;
    var eventData = {
      detail: {
        timer: this
      }
    };

    function updateCounters(precision, roundedValue) {
      totalCounters[precision] = roundedValue;

      if (precision === DAYS) {
        counters[precision] = roundedValue;
      } else if (roundedValue >= 0) {
        counters[precision] = mod(roundedValue, groupedUnits[precision]);
      } else {
        counters[precision] = groupedUnits[precision] - mod(roundedValue, groupedUnits[precision]);
      }
    }

    function updateDays(value) {
      return updateUnitByPrecision(value, DAYS);
    }

    function updateHours(value) {
      return updateUnitByPrecision(value, HOURS);
    }

    function updateMinutes(value) {
      return updateUnitByPrecision(value, MINUTES);
    }

    function updateSeconds(value) {
      return updateUnitByPrecision(value, SECONDS);
    }

    function updateSecondTenths(value) {
      return updateUnitByPrecision(value, SECOND_TENTHS);
    }

    function updateUnitByPrecision(value, precision) {
      var previousValue = totalCounters[precision];
      updateCounters(precision, calculateIntegerUnitQuotient(value, unitsInMilliseconds[precision]));
      return totalCounters[precision] !== previousValue;
    }

    function stopTimerAndResetCounters() {
      stopTimer();
      resetCounters();
    }

    function stopTimer() {
      clearInterval(intervalId);
      intervalId = undefined;
      running = false;
      paused = false;
    }

    function setParamsAndStartTimer(params) {
      if (!isPaused()) {
        setParams(params);
      } else {
        startingDate = calculateStartingDate();
        targetValues = setTarget(currentParams.target);
      }

      startTimer();
    }

    function startTimer() {
      var interval = unitsInMilliseconds[precision];

      if (isTargetAchieved(roundTimestamp(Date.now()))) {
        return;
      }

      intervalId = setInterval(updateTimerAndDispatchEvents, interval);
      running = true;
      paused = false;
    }

    function calculateStartingDate() {
      return roundTimestamp(Date.now()) - totalCounters.secondTenths * unitsInMilliseconds[SECOND_TENTHS] * timerTypeFactor;
    }

    function updateTimerAndDispatchEvents() {
      var currentTime = roundTimestamp(Date.now());
      var valuesUpdated = updateTimer();
      dispatchEvents(valuesUpdated);
      customCallback(eventData.detail.timer);

      if (isTargetAchieved(currentTime)) {
        stop();
        dispatchEvent('targetAchieved', eventData);
      }
    }

    function updateTimer() {
      var currentTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : roundTimestamp(Date.now());
      var ellapsedTime = timerTypeFactor > 0 ? currentTime - startingDate : startingDate - currentTime;
      var valuesUpdated = {};
      valuesUpdated[SECOND_TENTHS] = updateSecondTenths(ellapsedTime);
      valuesUpdated[SECONDS] = updateSeconds(ellapsedTime);
      valuesUpdated[MINUTES] = updateMinutes(ellapsedTime);
      valuesUpdated[HOURS] = updateHours(ellapsedTime);
      valuesUpdated[DAYS] = updateDays(ellapsedTime);
      return valuesUpdated;
    }

    function roundTimestamp(timestamp) {
      return Math.floor(timestamp / unitsInMilliseconds[precision]) * unitsInMilliseconds[precision];
    }

    function dispatchEvents(valuesUpdated) {
      if (valuesUpdated[SECOND_TENTHS]) {
        dispatchEvent('secondTenthsUpdated', eventData);
      }

      if (valuesUpdated[SECONDS]) {
        dispatchEvent('secondsUpdated', eventData);
      }

      if (valuesUpdated[MINUTES]) {
        dispatchEvent('minutesUpdated', eventData);
      }

      if (valuesUpdated[HOURS]) {
        dispatchEvent('hoursUpdated', eventData);
      }

      if (valuesUpdated[DAYS]) {
        dispatchEvent('daysUpdated', eventData);
      }
    }

    function isTargetAchieved(currentDate) {
      return targetValues instanceof Array && currentDate >= targetDate;
    }

    function resetCounters() {
      for (var counter in counters) {
        if (counters.hasOwnProperty(counter) && typeof counters[counter] === 'number') {
          counters[counter] = 0;
        }
      }

      for (var _counter in totalCounters) {
        if (totalCounters.hasOwnProperty(_counter) && typeof totalCounters[_counter] === 'number') {
          totalCounters[_counter] = 0;
        }
      }
    }

    function setParams(params) {
      params = params || {};
      precision = typeof params.precision === 'string' ? params.precision : SECONDS;
      customCallback = typeof params.callback === 'function' ? params.callback : function () {};
      countdown = params.countdown === true;
      timerTypeFactor = countdown === true ? -1 : 1;

      if (_typeof(params.startValues) === 'object') {
        setStartValues(params.startValues);
      } else {
        startValues = null;
      }

      startingDate = calculateStartingDate();
      updateTimer();

      if (_typeof(params.target) === 'object') {
        targetValues = setTarget(params.target);
      } else if (countdown) {
        params.target = {
          seconds: 0
        };
        targetValues = setTarget(params.target);
      } else {
        targetValues = null;
      }

      timerConfig = {
        precision: precision,
        callback: customCallback,
        countdown: _typeof(params) === 'object' && params.countdown === true,
        target: targetValues,
        startValues: startValues
      };
      currentParams = params;
    }

    function configInputValues(inputValues) {
      var secondTenths, seconds, minutes, hours, days, values;

      if (_typeof(inputValues) === 'object') {
        if (inputValues instanceof Array) {
          if (inputValues.length !== 5) {
            throw new Error('Array size not valid');
          }

          values = inputValues;
        } else {
          values = [inputValues.secondTenths || 0, inputValues.seconds || 0, inputValues.minutes || 0, inputValues.hours || 0, inputValues.days || 0];
        }
      }

      secondTenths = values[SECOND_TENTHS_POSITION];
      seconds = values[SECONDS_POSITION] + calculateIntegerUnitQuotient(secondTenths, SECOND_TENTHS_PER_SECOND);
      minutes = values[MINUTES_POSITION] + calculateIntegerUnitQuotient(seconds, SECONDS_PER_MINUTE);
      hours = values[HOURS_POSITION] + calculateIntegerUnitQuotient(minutes, MINUTES_PER_HOUR);
      days = values[DAYS_POSITION] + calculateIntegerUnitQuotient(hours, HOURS_PER_DAY);
      values[SECOND_TENTHS_POSITION] = secondTenths % SECOND_TENTHS_PER_SECOND;
      values[SECONDS_POSITION] = seconds % SECONDS_PER_MINUTE;
      values[MINUTES_POSITION] = minutes % MINUTES_PER_HOUR;
      values[HOURS_POSITION] = hours % HOURS_PER_DAY;
      values[DAYS_POSITION] = days;
      return values;
    }

    function calculateIntegerUnitQuotient(unit, divisor) {
      var quotient = unit / divisor;
      return quotient < 0 ? Math.ceil(quotient) : Math.floor(quotient);
    }

    function setTarget(inputTarget) {
      if (!inputTarget) {
        return;
      }

      targetValues = configInputValues(inputTarget);
      var targetCounter = calculateTotalCounterFromValues(targetValues);
      targetDate = startingDate + targetCounter.secondTenths * unitsInMilliseconds[SECOND_TENTHS] * timerTypeFactor;
      return targetValues;
    }

    function setStartValues(inputStartValues) {
      startValues = configInputValues(inputStartValues);
      counters.secondTenths = startValues[SECOND_TENTHS_POSITION];
      counters.seconds = startValues[SECONDS_POSITION];
      counters.minutes = startValues[MINUTES_POSITION];
      counters.hours = startValues[HOURS_POSITION];
      counters.days = startValues[DAYS_POSITION];
      totalCounters = calculateTotalCounterFromValues(startValues, totalCounters);
    }

    function calculateTotalCounterFromValues(values, outputCounter) {
      var total = outputCounter || {};
      total.days = values[DAYS_POSITION];
      total.hours = total.days * HOURS_PER_DAY + values[HOURS_POSITION];
      total.minutes = total.hours * MINUTES_PER_HOUR + values[MINUTES_POSITION];
      total.seconds = total.minutes * SECONDS_PER_MINUTE + values[SECONDS_POSITION];
      total.secondTenths = total.seconds * SECOND_TENTHS_PER_SECOND + values[[SECOND_TENTHS_POSITION]];
      return total;
    }
    /*
     * PUBLIC functions
     */

    /**
     * [stop stops the timer and resets the counters. Dispatch stopped event]
     */


    function stop() {
      stopTimerAndResetCounters();
      dispatchEvent('stopped', eventData);
    }
    /**
     * [stop stops and starts the timer. Dispatch stopped event]
     */


    function reset() {
      stopTimerAndResetCounters();
      setParamsAndStartTimer(currentParams);
      dispatchEvent('reset', eventData);
    }
    /**
     * [start starts the timer configured by the params object. Dispatch started event]
     * @param  {[object]} params [Configuration parameters]
     */


    function start(params) {
      if (isRunning()) {
        return;
      }

      setParamsAndStartTimer(params);
      dispatchEvent('started', eventData);
    }
    /**
     * [pause stops the timer without resetting the counters. The timer it can be restarted with start function.
     * Dispatch paused event]
     * @return {[type]} [description]
     */


    function pause() {
      stopTimer();
      paused = true;
      dispatchEvent('paused', eventData);
    }
    /**
     * [addEventListener Adds event listener to the timer]
     * @param {[string]} event      [event to listen]
     * @param {[function]} listener   [the event listener function]
     */


    function addEventListener(event, listener) {
      if (hasDOM()) {
        eventEmitter.addEventListener(event, listener);
      } else if (hasEventEmitter()) {
        eventEmitter.on(event, listener);
      }
    }
    /**
     * [removeEventListener Removes event listener to the timer]
     * @param  {[string]} event    [event to remove listener]
     * @param  {[function]} listener [listener to remove]
     */


    function removeEventListener(event, listener) {
      if (hasDOM()) {
        eventEmitter.removeEventListener(event, listener);
      } else if (hasEventEmitter()) {
        eventEmitter.removeListener(event, listener);
      }
    }
    /**
     * [dispatchEvent dispatchs an event]
     * @param  {string} event [event to dispatch]
     */


    function dispatchEvent(event, data) {
      if (hasDOM()) {
        eventEmitter.dispatchEvent(new CustomEvent(event, data));
      } else if (hasEventEmitter()) {
        eventEmitter.emit(event, data);
      }
    }
    /**
     * [isRunning return true if the timer is running]
     * @return {Boolean}
     */


    function isRunning() {
      return running;
    }
    /**
     * [isPaused returns true if the timer is paused]
     * @return {Boolean}
     */


    function isPaused() {
      return paused;
    }
    /**
     * [getTimeValues returns the counter with the current timer values]
     * @return {[TimeCounter]}
     */


    function getTimeValues() {
      return counters;
    }
    /**
     * [getTotalTimeValues returns the counter with the current timer total values]
     * @return {[TimeCounter]}
     */

    function getTotalTimeValues() {
      return totalCounters;
    }
    /**
     * [getConfig returns the configuration paramameters]
     * @return {[type]}
     */

    function getConfig() {
      return timerConfig;
    }
    /**
     * Public API
     * Definition of Timer instance public functions
     */

    if (typeof this !== 'undefined') {
      this.start = start;
      this.pause = pause;
      this.stop = stop;
      this.reset = reset;
      this.isRunning = isRunning;
      this.isPaused = isPaused;
      this.getTimeValues = getTimeValues;
      this.getTotalTimeValues = getTotalTimeValues;
      this.getConfig = getConfig;
      this.addEventListener = addEventListener;
      this.on = addEventListener;
      this.removeEventListener = removeEventListener;
      this.off = removeEventListener;
    }
  }

  exports.default = Timer;
  exports.Timer = Timer;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

},{"events":2}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],3:[function(require,module,exports){
(function(jQuery) {
    jQuery.fn.fintzsensors = function() {        
        var createProjectPlugin = require("./pages/landing/createProject");
        var deleteProjectPlugin = require("./pages/landing/deleteProject");
        var activeRunPlugin = require("./pages/run/activeRun");


        // retrieves the current context as the matched object, this
        // is considered to be the default/expected behaviour
        var matchedObject = this;
        var addProjectForm = jQuery(".form.add-project", matchedObject);
        var deleteProjectButton = jQuery(".button.delete-project", matchedObject);
        var activeRunContainer = jQuery(".active-run-container", matchedObject);

        createProjectPlugin(addProjectForm);
        deleteProjectPlugin(deleteProjectButton);
        activeRunPlugin(activeRunContainer);

        // returns the current context to the caller function/method
        // so that proper chaining may be applied to the context
        return this;
    };
})(jQuery);

jQuery(document).ready(function() {
    var _body = jQuery("body");    
    _body.fintzsensors();
});

},{"./pages/landing/createProject":4,"./pages/landing/deleteProject":5,"./pages/run/activeRun":6}],4:[function(require,module,exports){
var createProject = function(element) {
    var matchedObject = jQuery(element);

    var init = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }
    };

    var bind = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }

        matchedObject.submit(event, function () {
            if(!event || event.length === 0) {
                return;
            }

            //prevents default form behaviour, on submit
            event.preventDefault();

            var element = jQuery(this);
            element.triggerHandler("pre_submit");
            var url = event.currentTarget && event.currentTarget.action;
            var name = jQuery(".name-field", element);
            var numStations = jQuery(".stations-num-field", element);
            var numRuns = jQuery(".runs-num-field", element);
            var timePerRun = jQuery(".time-run-field", element);
            var productionTarget = jQuery(".production-target-field", element);

            name = name && name.val() || "New project";
            numStations = numStations && parseInt(numStations.val()) || 8;
            numRuns = numRuns && parseInt(numRuns.val()) || 3;
            timePerRun = timePerRun && parseInt(timePerRun.val()) || 30;
            productionTarget = productionTarget && parseInt(productionTarget.val()) || 1;
            jQuery.ajax({
                url: url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    "name": name,
                    "numStations": numStations,
                    "numRuns": numRuns,
                    "timePerRun": timePerRun,
                    "productionTarget": productionTarget,
                    "status": "CREATED"
                }),
                success: function(data, status) {
                    element.triggerHandler("success", data);
                },
                error: function(data) {
                    var message = data && data.responseJSON && data.responseJSON.message || "Form error";
                    matchedObject.triggerHandler("error", message);
                }
              });
        });

        matchedObject.bind("pre_submit", function() {
            var element = jQuery(this);
            element.addClass("loading");
            element.removeClass("success");
            element.removeClass("error");
        });

        matchedObject.bind("success", function() {
            var element = jQuery(this);
            element.removeClass("loading");
            element.addClass("success");
        });

        matchedObject.bind("error", function(event, message) {
            var element = jQuery(this);
            var errorMessage = jQuery(".error-message", element);
            errorMessage.text(message);
            element.removeClass("loading");
            element.addClass("error");
        });
    };

    init();
    bind();

    return matchedObject;
};

module.exports = createProject;

},{}],5:[function(require,module,exports){
var deleteProject = function(element) {
    var matchedObject = jQuery(element);

    var init = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }
    };

    var bind = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }

        matchedObject.click(event, function () {
            var element = jQuery(this);
            var projectElement = element.parents(".element-project");
            var projectNumber = projectElement.attr("data-number");

            element.each(function() {
                var _element = jQuery(this);
                var number = _element.attr("data-number");
                number === projectNumber && clickHandler(event, _element);
            });
        });

        matchedObject.bind("success", function() {
            var element = jQuery(this);
            var projectElement = element.parents(".element-project");
            projectElement.remove();
        });

        matchedObject.bind("error", function(event, message) {
            var element = jQuery(this);
            var projectElement = element.parents(".element-project");
            projectElement.addClass("error");
        });
    };

    var clickHandler = function (event, element) {
        if(!event || event.length === 0) {
            return;
        }

        //prevents default click behaviour
        event.preventDefault();

        var url = element.attr("href");

        jQuery.ajax({
            url: url,
            type: 'DELETE',
            success: function(data, status) {
                element.triggerHandler("success", data);
            },
            error: function(data) {
                var message = data && data.responseJSON && data.responseJSON.message || "Delete operation error";
                matchedObject.triggerHandler("error", message);
            }
          });
    };

    init();
    bind();

    return matchedObject;
};

module.exports = deleteProject;

},{}],6:[function(require,module,exports){
const Timer = require('easytimer.js').Timer;

const ACTION_TYPES = {
    START_RUN: "START",
    MOVE_ITER: "MOVE",
    CONTINUE_RUN: "CONTINUE",
    KILL: "KILL"
  };
  Object.freeze(ACTION_TYPES);

var activeRun = function(element) {
    var matchedObject = jQuery(element);

    var init = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }
    };

    var bind = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }

        var startButton = jQuery(".button-start", matchedObject);
        var moveButton = jQuery(".button-move", matchedObject);
        var continueButton = jQuery(".button-continue", matchedObject);
        var killButton = jQuery(".button-kill", matchedObject);

        startButton.click(function(event){
            event.preventDefault();
            var element = jQuery(this);
            var activeRunContainer = element.parents(".active-run-container");
            activeRunContainer.triggerHandler("pre_start");
        });
        
        moveButton.click(function(event){
            event.preventDefault();
            var element = jQuery(this);
            var activeRunContainer = element.parents(".active-run-container");
            activeRunContainer.triggerHandler("pre_move");
        });
        
        continueButton.click(function(event){
            event.preventDefault();
            var element = jQuery(this);
            var activeRunContainer = element.parents(".active-run-container");            
            activeRunContainer.triggerHandler("pre_continue");
        });

        killButton.click(function(event){
            event.preventDefault();
            var element = jQuery(this);
            var activeRunContainer = element.parents(".active-run-container");            
            activeRunContainer.triggerHandler("pre_kill");
        });

        matchedObject.bind("pre_start", function(event) {
            var element = jQuery(this);
            sendActionType(element, ACTION_TYPES.START_RUN);
        });

        matchedObject.bind("start_action", function(event){
            // TODO: start counter
            // TODO: disable start button
        });

        matchedObject.bind("pre_move", function(event) {
            var element = jQuery(this);
            sendActionType(element, ACTION_TYPES.MOVE_ITER);
        });

        matchedObject.bind("move_action", function(event){
            // TODO: enables continue button
            // TODO: set all station timers to zero
        });

        matchedObject.bind("pre_continue", function(event) {
            var element = jQuery(this);
            sendActionType(element, ACTION_TYPES.CONTINUE_RUN);
        });

        matchedObject.bind("continue_action", function(event){
            // TODO: disables continue button
            // TODO: disables move button
            // TODO: enables move button
        });

        matchedObject.bind("pre_kill", function(event) {
            var element = jQuery(this);
            sendActionType(element, ACTION_TYPES.KILL);
        });

        matchedObject.bind("kill_action", function(event){
            // TODO: redirects to?
        });

        /*
         *      
         *      
         * TODO: this need a proper refactoring
         *
         *
        */
        let timers = [
            new Timer(),
            new Timer(),
            new Timer(),
            new Timer(),
            new Timer(),
            new Timer(),
            new Timer()
        ];
        let globalTimer = new Timer();
        globalTimer.addEventListener('secondsUpdated', function (e) {
            jQuery('.global-timer').html(globalTimer.getTimeValues().toString());
        });
        jQuery( document ).ready(function() {
            var globalTimerElement = jQuery('.global-timer')
            var minutes = globalTimerElement.attr("data-duration");
            minutes = parseInt(minutes);
            globalTimer.start({countdown: true, startValues: { minutes: minutes }});
        });
        for (let i = 0; i < timers.length; i++){
            let timerNr = i+1;
            timers[i].addEventListener('secondsUpdated', function (e) {
                jQuery('.timer-station'+timerNr).html(timers[i].getTimeValues().toString());
            });
        }
        var socket = io.connect();
        socket.on('toggleTimer', function(data){
            let stationToToggle = data.sensor;
            let timerToUpdate = timers[stationToToggle-1];
            if(timerToUpdate.isRunning())
            {
                timerToUpdate.pause();
                var station = jQuery('.timer-station'+stationToToggle).parents(".station");
                station.removeClass("active");
                station.addClass("stop");
            }
            else
            {
                timerToUpdate.start();
                var station = jQuery('.timer-station'+stationToToggle).parents(".station");
                station.addClass("active");
                station.removeClass("stop");
            }
        });
    };

    var sendActionType = function(element, actionType) {
        var startButton = jQuery(".button-start", element);
        var url = startButton.attr("href");
        
        jQuery.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                "actionType": actionType,
            }),
            success: function(data, status) {
                var event = actionType.toLowerCase() + "_action";
                element.triggerHandler(event, data);
            },
            error: function(data) {
                var message = data && data.responseJSON && data.responseJSON.message || "Error sending action";
                matchedObject.triggerHandler("error", message);
            }
          });
    };

    var moveIteration = function(element) {
        
    };
    
    var continueRun = function(element) {
        
    };
    
    var kill = function(element) {
        
    };

    init();
    bind();

    return matchedObject;
};

module.exports = activeRun;

},{"easytimer.js":1}]},{},[3]);
