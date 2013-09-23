/* global define */
define([
	'leaflet',
	'Geocoder'
], function (
	L,
	Geocoder
) {
	'use strict';

	var DEFAULT_OPTIONS = {
		position: 'topleft',
		defaultLocation: null,
		defaultEnabled: false
	};

	var GeocodeControl = L.Control.extend({
		includes: L.Mixin.Events,

		initialize: function (options) {
			L.Util.setOptions(this, L.Util.extend({}, DEFAULT_OPTIONS, options));
			this._geocoder = new Geocoder({apiKey: this.options.apiKey});
		},

		setLocation: function (loc, options) {
			this._loc = loc;

			if (!(options && options.silent)) {
				this.fire('location', this._loc);
			}
		},

		getLocation: function () {
			return this._loc;
		},
	

		onAdd: function (map) {
			var container = this._container = L.DomUtil.create('div', 'GeocodeControl'),
			    textInput = this._textInput = L.DomUtil.create('input', 'GeocodeControl-input', container),
			    stop = L.DomEvent.stopPropagation;
			this._map = map;

			L.DomEvent.on(textInput, 'keyup', this._onKeyUp, this);
			L.DomEvent.on(container, 'keydown', stop);
			L.DomEvent.on(container, 'keyup', stop);
			L.DomEvent.on(container, 'keypress', stop);
			L.DomEvent.on(container, 'mousedown', stop);
			L.DomEvent.on(container, 'mouseup', stop);
			L.DomEvent.on(container, 'click', stop);

			return container;
		},
 
		_doGeocode: function (textAddress) {
			//ToDo send address out receive lat long back
			this._geocoder.forward(textAddress, (function (control) {
				return function (geocodeResult) {
					control.setLocation(geocodeResult);
				};
			})(this));
		},

		_onKeyUp: function (keyEvent) {
			if(keyEvent.keyCode === 13) {
				this._doGeocode(this._textInput.value);
			}
		}

	});

	return GeocodeControl;
});
