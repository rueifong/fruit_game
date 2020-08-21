// JavaScript Document

$(function(){
	game = new Game(8, 8);
	
	// init
	clip = 'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)';
	$('#time-bar').css('clip-path', clip);
	
	
	
	// start
	$(document).on('click', '#btn-start', function(){
		if($('#nickname').val() == '') {
			$('#modal').modal('show');
		} else {
			game.nickname = $('#nickname').val();
			game.setBoard('game', 1);
		}
	});
	
	// for test 
	// game.nickname = 'TEST';
	// game.setBoard('game', 1);
	
	// restart
	$(document).on('click', '#btn-restart', function(){
		clearInterval(game.timer);
		
		game = new Game(8, 8);
		game.setBoard('start');
		$('#nickname').val('');
	});
	
	// fruit click
	$(document).on('click', '.game-row img', function(){
		if(game.canClick) {
			fruitClick($(this));
		}
	});
	
	$(document).on('click', '#modal-btn', function(){
		$('#modal').modal('hide');
	});
	
	$(document).on('click', '#stage-btn', function(){
		$('#modal').modal('hide');
		game.setNext();
	});
});

function fruitClick(t) {
	if(!$('.onfocus').is($(t))) {
		$('.onfocus').removeClass('onfocus');
		$(t).addClass('onfocus');
	}
}

function Game(r, c) {
	this.r = r*1;
	this.c = c*1;
	this.m = 0;
	this.s = 0;
	this.ss = 0;
	this.score = 0;
	this.total = 0;
	this.total_time = 0;
	this.canClick = true;
	this.status = 'start';
	this.fruits = ['', 'apple', 'banana', 'grape', 'peach', 'watermelon'];
	this.m1 = ['l', 'u', 'r', 'd'];
	this.m2 = ['r', 'd', 'l', 'u'];
	this.stageTime = ['', 300, 270, 240, 210, 180];
	this.stageScore = ['', 1000, 1500, 2000, 2500, 3000];
	// this.stageTime = ['', 20, 20, 20, 20, 20];
	// this.stageScore = ['', 60, 180, 300, 500, 700];
	
	this.setBoard = function(status, stage) {
		this.status = status;
		this.stage = stage;
		this.score = 0;
		this.s = 0;
		this.createMap();
		this.draw(500);
		this.checkBoard('start', 0);
	}
	
	this.createMap = function() {
		var t = this;
		t.map = [];
		for(var i=0; i<t.r; i++) {
			t.map[i] = [];
			for(var j=0; j<t.r; j++) {
				f = Math.floor(Math.random() * 5 + 1);
				t.map[i][j] = f;
			}
		}
	}

	this.draw = function(time) {
		var t = this;
		window.setTimeout(function() {
			html = '';
			for(var i=0; i<t.r; i++) {
				html += '<div class="game-row-div">';
				for(var j=0; j<t.c; j++) {
					var f = new Fruit(i, j);
					fruit = t.map[i][j];
					html += '<div class="game-row" id="f' + f.toString() + '"><img src="imgs/fruit-' + t.fruits[fruit] + '.png" alt="' + t.fruits[fruit] + '" /></div>';
				}
				html += '</div>';
			}
			$('#game-board').empty().html(html);
			$('#text-score').html(t.score);
		}, time/2);
	}
	
	this.checkBoard = function(status, time) {
		var t = this;
		
		$clear = true;
		checkBoard = setInterval(function() {
			if($clear) {
				t.callCheckBoard(status, time);
			} else {
				clearInterval(checkBoard);
				if(status == 'start') {
					t.callPage();
					// t.callPage(t.status);
				}
			}
		}, time);
	}


	this.callCheckBoard = function(status, time) {
		var t = this;
		
		clear_arr = [];

		// clear col
		for(var i=0; i<t.r; i++) {
			var left = 0, right = 0;
			for(var x=0; x<t.c; x++) {
				left = x;
				right = left;
				for(var y=x+1; y<t.c; y++) {
					if(t.map[i][x] == t.map[i][y]) {
						right = y;
					} else {
						break;
					}
				}
				
				if(right - left > 1) {
					for(var k=left; k<=right; k++) {
						clear_arr.push([i, k]);
					}
					x = right;
				}
			}
		}
		
		// clear row
		for(var i=0; i<t.r; i++) {
			var top = 0, bottom = 0;
			for(var x=0; x<t.c; x++) {
				top = x;
				bottom = top;
				for(var y=x+1; y<t.c; y++) {
					if(t.map[x][i] == t.map[y][i]) {
						bottom = y;
					} else {
						break;
					}
				}
				
				if(bottom - top > 1) {
					for(var k=top; k<=bottom; k++) {
						clear_arr.push([k, i]);
					}
					x = bottom;
				}
			}
		}
		
		// clear clear_arr
		$clear = clear_arr.length > 0;
		if($clear) {
			for(var i=0; i<clear_arr.length; i++) {
				var f = new Fruit(clear_arr[i][0], clear_arr[i][1]);
				$('#f' + f.toString()).find('img').remove();
				t.map[f.r][f.c] = 0;
			}
			
			for(var i=0; i<t.r; i++) {
				for(var j=t.map.length - 1; j>0; j--) {
					while(t.map[j][i] == 0) {
						var empty = true;
						
						for(var k=j; k>0; k--) {
							t.map[k][i] = t.map[k - 1][i];
							t.map[k - 1][i] = 0;
							if(t.map[k - 1][i] != 0) {
								empty = false;
							}
						}

						if(empty) {
							break;
						}
					}
				}
				
				for(j=0; j<8; j++) {
					if(t.map[j][i] == 0) {
						t.map[j][i] = Math.floor(Math.random() * 5 + 1);
						if(status == 'game') {
							t.score += 20;
						}
					}
				}
			}
		}
		
		t.draw(time);
		
		setTimeout(function(){
			if(t.checkStage() && status == 'game') {
				t.setNextStage();
				$clear = false;
				return false;
			}
		}, time * 2);
	}
	
	this.checkStage = function() {
		return (this.status == 'game' && this.score >= this.stageScore[this.stage]);
	}
	
	this.setNextStage = function() {
		window.clearInterval(this.timer);
		window.clearInterval(game.timer);
		
		var t = this;
		
		if(t.stage <= 5) {
			$('#game-stage').modal('show');
			$('#game-stage .modal-header h1').html('STAGE' + t.stage + ' CLEAR!');
			$('#game-stage .modal-body').html('SCORE: ' + t.score + '<br>TIME: ' + t.time);
			
			t.total += t.score;
			t.total_time += t.ss;
			
			t.next = true;
			
			setTimeout(function(){
				t.setNext();
			}, 3000);
		}
		
		t.stage++;
	}
	
	this.setNext = function() {
		if(this.next) {
			if(this.stage < 6) {
				this.next = false;
				$('#game-stage').modal('hide');
				this.setBoard('game', this.stage);
			} else {
				$('#game-stage').modal('hide');
				game.gameover('success');
				
			}
		}
	}
	
	this.callPage = function() {
		$('#inner > div').fadeOut();
		$('#' + this.status).slideDown();
		
		
		$('#text-stage').html('STAGE ' + this.stage);
		$('#text-nickname').html(this.nickname);
		$('#text-score').html(this.score);
		
		$(window).keydown(key);
		game.timer = setInterval(runTimer, 1000);
	}
	
	this.checkMove = function(f) {
		return !(f.r < 0 || f.c < 0 || f.r >=8 || f.c >= 8 || typeof this.map[f.r][f.c] == undefined);
	}
	
	this.change = function(f1, f2, type) {
		var t = this;
		
		t.canClick = false;
		t.moving = true;
		
		$p1 = $('#f' + f1.toString());
		$p2 = $('#f' + f2.toString());
		
		$tmp1 = $p2.html();
		$tmp2 = $p1.html();
		
		$p1.addClass('moving ' + t.m1[type]);
		$p2.addClass('moving ' + t.m2[type]);
		
		setTimeout(function(){
			if(t.moving) {
				t.canClick = true;
				t.moving = false;
				$p1.removeClass('moving ' + t.m1[type]);
				$p2.removeClass('moving ' + t.m2[type]);
				
				$p1.html($tmp1);
				$p2.html($tmp2);
				
				tmp = t.map[f1.r][f1.c];
				t.map[f1.r][f1.c] = t.map[f2.r][f2.c];
				t.map[f2.r][f2.c] = tmp;
				
				t.checkBoard('game', 500);
			}
		}, 200);
		// $p1
	}
	
	this.gameover = function(gameover) {
		clearInterval(game.timer);
		clearInterval(this.timer);
		window.clearInterval(game.timer);
		window.clearInterval(this.timer);
		
		
		$('#success, #fail').hide();
		$('#' + gameover).slideDown();
		
		(gameover == 'success') ? $('#stars').slideDown() : $('#stars').hide();
		a = (gameover == 'success') ? 'a':'b';
		
		
		m = Math.floor(this.total_time / 60);
		s = Math.floor(this.total_time % 60);
		m = (m > 9) ? m : '0' + m;
		s = (s > 9) ? s : '0' + s;
		total_time = m + ':' + s;
		// console.log(this.total_time, total_time);
		
		
		$('#text-nickname-2').html(this.nickname);
		$('#text-score-2').html(this.total);
		$('#text-time').html(total_time);
		
		this.status = 'end';
		this.setBoard('end');
	}

}

function Fruit(r, c) {
	this.r = r*1;
	this.c = c*1;
	this.toString = function() {
		return this.r + '_' + this.c;
	}
}

function MFruit(r, c, x, y) {
	return new Fruit(
		parseInt(r) + parseInt(y),
		parseInt(c) + parseInt(x)
	)
}

function runTimer() {
	
	if(game.s >= game.stageTime[game.stage]) {
		game.gameover('fail');
	}
	
	if(game.s == 60) {
		game.s = 0;
		game.m++;
	}
	
	m = Math.floor(game.ss / 60);
	s = Math.floor(game.ss % 60);
	m = (m > 9) ? m : '0' + m;
	s = (s > 9) ? s : '0' + s;
	game.time = m + ':' + s;
	game.ss = game.m * 60 + game.s;
	num = game.ss / game.stageTime[game.stage] * 100;
	clip = 'polygon(0% 0%, 0% 100%, ' + num + '% 100%, ' + num + '% 0%)';
	$('#time-bar-text').html(game.time);
	$('#time-bar').css('clip-path', clip);
	$('.game-timer-svg-cls-23, .game-timer-svg-cls-26').css('opacity', 0.5 + num / 200);
	game.s++;
}

function move(x, y, type) {
	if($('.onfocus').length > 0) {
		var ob = $('.onfocus').parent().attr('id').replace('f', '');
		[r, c] = ob.split('_');
		
		var f1 = new Fruit(r, c);
		var f2 = new MFruit(r, c, x, y);
		
		if(game.checkMove(f2)) {
			game.change(f1, f2, type);
		}
	}
}

function key(e) {
	switch(e.keyCode) {
		case 37: move(-1, 0, 0); break;
		case 38: move(0, -1, 1); break;
		case 39: move(1, 0, 2); break;
		case 40: move(0, 1, 3); break;
	}
}


