const hook = {
	time: $('.time'),
	addtime: $('#add-time'),
	removetime: $('#remove-time'),
	addbreak: $('#add-break'),
	removebreak: $('#remove-break'),
	break: $('.break'),
	tracker: $('.tracker'),
	blinker: $('.blinker'),
	start: $('#start'),
	reset: $('#reset'),
	controls: $('.button-group'),
	ding: document.getElementById('ding')
};

const P = function() {

	this.mem = {
		time: 1500,
		break: 300,
		setTime: 0,
		setBreak: 0,
		timer: 0
	};

	this._refreshScreen = (newValue = '') => {
		return {
			time: () => {
				hook.time.html(newValue);
			},
			break: () => {
				hook.break.html(newValue);
			},
			blink: () => {
				hook.blinker.fadeIn('fast');
				setTimeout(() => {
					hook.blinker.fadeOut('fast');
				}, 300);
			},
			showBreak: () => {
				hook.break.removeClass('hidden');
			},
			hideBreak: () => {
				hook.break.addClass('hidden');
			},
			showTracker: () => {
				hook.tracker.removeClass('hidden');
			},
			hideTracker: () => {
				hook.tracker.addClass('hidden');
			},
			showControls: () => {
				hook.controls.fadeIn();
			},
			hideControls: () => {
				hook.controls.fadeOut();
			},
			showStart: () => {
				hook.start.removeClass('hidden');
			},
			hideStart: () => {
				hook.start.addClass('hidden');
			},
			showReset: () => {
				hook.reset.removeClass('hidden');
			},
			hideReset: () => {
				hook.reset.addClass('hidden');
			}
		}
	};

	this._reset = () => {
		clearTimeout(this.mem.timer);
		this.mem.time = this.mem.setTime;
		this.mem.break = this.mem.setBreak;
		this._refreshScreen(this.mem.time/60).time();
		this._refreshScreen(this.mem.break/60).break();
		this._refreshScreen().hideTracker();
		this._refreshScreen().showBreak();
		this._refreshScreen().hideReset();
		this._refreshScreen().showStart();
		this._refreshScreen().showControls();
	};

	return {
		addTime : function(value, memLoc) {
			this.mem[memLoc] += value;
			if (memLoc === 'time') {
				this._refreshScreen(this.mem[memLoc]/60).time();
			}
			if (memLoc === 'break') {
				this._refreshScreen(this.mem[memLoc]/60).break();
			}
		}.bind(this),
		removeTime : function(value, memLoc) {
			this.mem[memLoc] -= value;
			if (this.mem[memLoc] < 60) {
				this.mem[memLoc] = 60;
			}
			if (memLoc === 'time') {
				this._refreshScreen(this.mem[memLoc]/60).time();
			}
			if (memLoc === 'break') {
				this._refreshScreen(this.mem[memLoc]/60).break();
			}
		}.bind(this),
		countdown: function() {
			this.mem.setTime = this.mem.time;
			this.mem.setBreak = this.mem.break;
			this._refreshScreen().hideBreak();
			this._refreshScreen().showTracker();
			this._refreshScreen().hideControls();
			this._refreshScreen().hideStart();
			this._refreshScreen().showReset();
			this.mem.timer = setInterval(function() {
				this._refreshScreen().blink();
				this.mem.time -= 1;
				if (this.mem.time % 60 === 0) {
					this._refreshScreen(Math.ceil(this.mem.time/60)).time();
				}
				if (this.mem.time < 1) {
					clearTimeout(this.mem.timer);
					hook.ding.play();
					this._refreshScreen(this.mem.break/60).time();
					this.mem.timer = setInterval(function() {
						this._refreshScreen().blink();
						this.mem.break -= 1;
						if (this.mem.break % 60 === 0) {
							this._refreshScreen(Math.ceil(this.mem.break/60)).time();
						}
						if (this.mem.break < 1) {
							hook.ding.play();
							this._reset();
						}
					}.bind(this), 1000);
				}
			}.bind(this), 1000);
		}.bind(this),
		reset: function() {
			this._reset();
		}.bind(this)
	};
};

(function() {

	var pomodoro = new P();

	hook.addtime.on('click', () => {
		pomodoro.addTime(60, 'time');
	});
	hook.removetime.on('click', () => {
		pomodoro.removeTime(60, 'time');
	});
	hook.addbreak.on('click', () => {
		pomodoro.addTime(60, 'break');
	});
	hook.removebreak.on('click', () => {
		pomodoro.removeTime(60, 'break');
	});
	hook.start.on('click', () => {
		pomodoro.countdown();
	});
	hook.reset.on('click', () => {
		pomodoro.reset();
	});

}())
