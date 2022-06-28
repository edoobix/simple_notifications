//Переписать функции под обычный js

/*

let args = {
	type : 'classic', //Тип оповещания(успешное/success, обычное/classic, ошибка/error)
	title : 'Тестинг', //Заголовок ошибки
	img : 'img/warning.png', //Изображение оповещения
	text : 'Тестирую оповещения', //Текст оповещения(Обязательный параметр)
	options : {
		'time' : 2000, //Время исчезновения
		'hide_type' : 'slideRight' //Тип исчезновения
	}
};

*/

	let timer_slide = false;
	let notice_cnt = 0;

	class Notice{

		static #default_args = {
			type : 'classic', //Тип оповещания(успешное/success, обычное/classic, ошибка/error)
			title : '', //Заголовок ошибки
			img : '', //Изображение оповещения(img/warning.png)
			text : 'Оповещение', //Текст оповещения(Обязательный параметр)
			options : {
				'time' : 0, //Время исчезновения
				'hide_type' : 'momentHide' //Тип исчезновения			
			}
		};
		#args;

		isObject (item) {
			return (item && typeof item === 'object' && !Array.isArray(item));
		}

		mergeDeep(target, ...sources) {
			if (!sources.length) return target;
			const source = sources.shift();
			if (this.isObject(target) && this.isObject(source)) {
				for (const key in source) {
					if (this.isObject(source[key])) {
						if (!target[key]) Object.assign(target, {
							[key]: {}
						});
						this.mergeDeep(target[key], source[key]);
					} else {
						Object.assign(target, {
							[key]: source[key]
						});
					}
				}
			}
			return this.mergeDeep(target, ...sources);
		}

		constructor(args){
			this.#args = this.mergeDeep(Notice.#default_args, args);
			this.notice();
		}

		showArgs(){
			return this.#args;
		}

		notice(){
			let args = this.#args;
			let opt = args.options;

			if(args.img){
				if(args.img.replaceAll(' ', '') != ''){
					args.img = '<img src="'+args.img+'" class="notice-img">';
				}
			}
		
			if(args.text == ''){
				alert('Параметр text является обязательным!');
				return;
			}
			if(document.querySelectorAll('.notice-box_div').length < 1){
				let div = document.createElement('div');
				div.classList.add('notice-box_div');
				document.querySelector('body').appendChild(div);
			}

			//Кнопка закрытия
			let close_notice = document.createElement('div');
			close_notice.classList.add('close-notice');

			//Бокс кнопки закрытия
			let close_notice_box = document.createElement('div');
			close_notice_box.classList.add('close-notice-box');
			close_notice_box.setAttribute('onclick', 'close_notice(this, \'' + opt.hide_type + '\')');
			close_notice_box.appendChild(close_notice);

			//Заголовок оповещения
			let title = document.createElement('h2');
			title.innerHTML = args.title;

			//Линия разделения
			let line = document.createElement('div');
			line.classList.add('line');

			//Текст оповещания
			let text = document.createElement('p');
			text.innerHTML = args.text;

			//Все оповещение
			let notice_box = document.createElement('div');
			notice_box.classList.add('notice-box');
			notice_box.id = 'sl_' + notice_cnt;
			notice_box.classList.add(args.type);
			//Добавление всех данных в общий блок
			notice_box.appendChild(close_notice_box);
			notice_box.appendChild(title);
			notice_box.appendChild(line);
			notice_box.appendChild(text);


			//Добавление блока оповещания на страницу
			document.querySelector('.notice-box_div').appendChild(notice_box);
			
			//если задано время: закрывает оповещение по истечении
			if(opt.time != '' && opt.time != 0){
				setTimeout(function(){
					this.close_notice(notice_box, opt.hide_type, opt.time);
				}, opt.time);
			}
			notice_cnt++;
		}
	}

	function close_notice(elem, type, time = 0){
		let elem_box = elem.closest('.notice-box');
		switch(type){
			case 'slideRight':
				notice_animations.slideRight(elem_box, time);
			break;
			case 'fadeOut':
				notice_animations.fadeOut(elem_box, time);
			break;
			default:
				notice_animations.momentHide(elem_box, time);
			break;
		}		
	}

	function check_notice(){
		if(document.querySelectorAll('.notice-box').length == 0){
			document.querySelector('.notice-box_div').remove();
		}
	}

	notice_animations = {
		'slideRight' : function(e, t = 0){
			const space_width = window.innerWidth - e.getBoundingClientRect().left;//Ширина сдвига элемента от правого края
			const animation_time = 500;//Время анимации
			const interval_delay = 20;//Скорость (20ms ~ 50 кадров в секунду)
			const slide_per = space_width / (animation_time / interval_delay);//Количество пикселей для сдвига за раз

			//порядок сдвига элементов
			if(t != 0 && t != ''){
				let check_timer = setInterval(() => {
					const ids = document.querySelectorAll('[id^="sl_"]');
					let boxes_ids = [];//Math.min
					ids.forEach((e, i) => {
						boxes_ids.push(e.id.replace('sl_', ''));
					});
					const minId = Math.min(...boxes_ids);
	
					if(!timer_slide && e.id.replace('sl_', '') == minId){
						close();
						clearInterval(check_timer);
					}
				},100);
			} else {
				close();
			}

			//Анимация сдвига элемента
			function close(){
				let slided = 0;
				timer_slide = setInterval(() => {
					slided += slide_per;
					e.style.transform = 'translate(' + slided + 'px,0)';				
				}, interval_delay);
	
				setTimeout(function(){
					clearInterval(timer_slide);
					let next_elem = e.nextSibling;
					while(next_elem != null){
		                                next_elem.classList.add('goUp');
						next_elem = next_elem.nextSibling;
					}
					setTimeout(function(){
						document.querySelectorAll('.notice-box').forEach((e, i) => {
							e.classList.remove('goUp');
						});
						e.remove();
						timer_slide = false;
						check_notice();
					},100)
				}, animation_time);
			}
		},
		'fadeOut' : function(e, t){
			alert('В разработке');
		},
		'momentHide' : function(e, t){
			const animation_time = 500;//Время анимации
			//порядок сдвига элементов
			if(t != 0 && t != ''){
				let check_timer = setInterval(() => {
					const ids = document.querySelectorAll('[id^="sl_"]');
					let boxes_ids = [];//Math.min
					ids.forEach((e, i) => {
						boxes_ids.push(e.id.replace('sl_', ''));
					});
					const minId = Math.min(...boxes_ids);
	
					if(!timer_slide && e.id.replace('sl_', '') == minId){
						close();
						clearInterval(check_timer);
					}
				},100);
			} else {
				close();
			}

			//Анимация сдвига элемента
			function close(){
//				e.style.display = 'none';
				e.style.opacity = '0';
				let next_elem = e.nextSibling;
				while(next_elem != null){
	                                next_elem.classList.add('goUp');
					next_elem = next_elem.nextSibling;
				}
				setTimeout(function(){
					e.remove();
					document.querySelectorAll('.notice-box').forEach((e, i) => {
						e.classList.remove('goUp');
					});
					check_notice();
				}, 200);
			}
		}
	}

	
/**
* Выше функции("библиотека")
* Вызовы ниже
*
**/

/*

let args = {
	type : 'classic', //Тип оповещания(успешное/success, обычное/classic, ошибка/error)
	<< classic|success|error >>
	title : 'Тестинг', //Заголовок ошибки
	img : 'img/warning.png', //Изображение оповещения
	text : 'Тестирую оповещения', //Текст оповещения(Обязательный параметр)
	options : {
		'time' : 2000, //Время исчезновения(в млс. 2000млс = 2с)
		'hide_type' : 'slideRight' //Тип исчезновения
		<< slideRight >>
	}
};

*/

window.onload = () => {
	document.querySelector('.notice').onclick = () => {
		let args = {
			type : 'classic',
			title : 'Тестинг',
			text : 'Тестирую оповещения',
			options : {
				'time' : 5000,
			}
		};
		const not = new Notice(args);
	}

}