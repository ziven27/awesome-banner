(function (window, document) {

	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.lineWidth = .3;
	ctx.strokeStyle = (new Color(150)).style;
	var mousePosition = {
		x: 30 * canvas.width / 100,
		y: 30 * canvas.height / 100
	};
	var dots = {
		nb: 130,
		distance: 50,
		d_radius: 100,
		array: []
	};

	function mixComponents(comp1, weight1, comp2, weight2) {
		return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
	}

	function Color(min) {
		min = min || 0;
		this.style = 'rgba(255,255,255, 0.6)';
	}

	function Dot() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.vx = -.5 + Math.random();
		this.vy = -.5 + Math.random();
		this.radius = Math.random() * 2;
		this.color = new Color();
		//console.log(this);
	}
	Dot.prototype = {
		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = this.color.style;
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			ctx.fill();
		}
	};

	function createDots() {
		for (i = 0; i < dots.nb; i++) {
			dots.array.push(new Dot());
		}
	}

	function moveDots() {
		for (i = 0; i < dots.nb; i++) {
			var dot = dots.array[i];
			if (dot.y < 0 || dot.y > canvas.height) {
				dot.vx = dot.vx;
				dot.vy = -dot.vy;
			} else if (dot.x < 0 || dot.x > canvas.width) {
				dot.vx = -dot.vx;
				dot.vy = dot.vy;
			}
			dot.x += dot.vx;
			dot.y += dot.vy;
		}
	}

	function connectDots() {
		for (i = 0; i < dots.nb; i++) {
			for (j = 0; j < dots.nb; j++) {
				i_dot = dots.array[i];
				j_dot = dots.array[j];
				if ((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > -dots.distance && (i_dot.y - j_dot.y) > -dots.distance) {
					if ((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > -dots.d_radius && (i_dot.y - mousePosition.y) > -dots.d_radius) {
						ctx.beginPath();
						ctx.strokeStyle = 'rgba(255,255,255, 0.6)';
						ctx.moveTo(i_dot.x, i_dot.y);
						ctx.lineTo(j_dot.x, j_dot.y);
						ctx.stroke();
						ctx.closePath();
					}
				}
			}
		}
	}

	function drawDots() {
		for (i = 0; i < dots.nb; i++) {
			var dot = dots.array[i];
			dot.draw();
		}
	}

	function animateDots() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		moveDots();
		connectDots();
		drawDots();
		requestAnimationFrame(animateDots);
	}

	canvas.addEventListener('mousemove', function (e) {
		mousePosition.x = e.pageX;
		mousePosition.y = e.pageY;
	});
	canvas.addEventListener('mouseleave', function (e) {
		mousePosition.x = canvas.width / 2;
		mousePosition.y = canvas.height / 2;
	});
	createDots();
	requestAnimationFrame(animateDots);

})(window, document);