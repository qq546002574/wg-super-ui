<template>
	<el-tooltip :disabled="showDisabled" :placement="placement" :popperClass="popperClass">
		<div slot="content">
			<slot name="tooltips">双击图标可打开患者列表！</slot>
		</div>
		<div
			id="wgDragContainer"
			v-bind="$attrs"
			v-drag="{set: changeDisabled}"
			@click="onClick"
			@dblclick="onDbclick">
				<slot></slot>
		</div>
	</el-tooltip>

</template>
<script>
export default {
	name: 'wgDragContainer',
	props: {
		showTooltip: {
			type: Boolean,
			default: true,
		},
		popperClass: String,
		placement: {
			type: String,
			default: 'top',
		}
	},
	computed: {
		showDisabled(){
			if(!this.showTooltip) return true;
			return this.disabled;
		}
	},
	data() {
		return {
			disabled: false,
		}
	},
	directives: {
		drag: function(el, binding) {
			let dragBox = el; //获取当前元素
			let firstTime = '';
			let lastTime = '';
			// 解决无法赋值文字问题
			// document.onselectstart = function () {
			// 	return false;
			// }
			dragBox.onmousedown = e => {
				binding.value.set(true);
				// 为了区分点击还是拖拽，使用时间差来判断，200毫秒内为点击，200毫秒外为拖拽，初始化为点击
				document.getElementById('wgDragContainer').setAttribute('drag-flag', false);
				firstTime = new Date().getTime();
				//算出鼠标相对元素的位置
				let disX = e.clientX - dragBox.offsetLeft;
				let disY = e.clientY - dragBox.offsetTop;
				document.onmousemove = e => {
					//用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
					let left = e.clientX - disX;
					let top = e.clientY - disY;
					const limitX = document.documentElement.clientWidth - dragBox.offsetWidth;
					const limitY = document.documentElement.clientHeight - dragBox.offsetHeight + 48;
					if (top <= 38) {
						top = 38;
					}else if (top >= limitY) {
						top = limitY;
					}
					if (left < 0) {
						left = 0;
					}else if (left > limitX) {
						left = limitX;
					}
					// 判断下当前时间与初始时间差，大于200毫秒则判断状态为拖拽
					lastTime = new Date().getTime();
					if (lastTime - firstTime > 250) {
						document.getElementById('wgDragContainer').setAttribute('drag-flag', true);
						//移动当前元素
						dragBox.style.left = left + "px";
						dragBox.style.top = top + "px";
					}
				};
				document.onmouseup = e => {
					binding.value.set(false);
					//鼠标弹起来的时候不再移动
					document.onmousemove = null;
					//预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）  
					document.onmouseup = null;
				};
				return false;
			};
		}
	},
	methods: {
		changeDisabled(val) {
			this.disabled = val;
		},
		onClick(e) {
			// 点击事件触发时，判断当前状态是拖拽还是点击，若是拖拽，直接返回不继续执行
			const isDrag = document.getElementById('wgDragContainer').getAttribute('drag-flag')
			if (isDrag === 'true') return;
			this.$emit("click", e);
		},
		onDbclick(e) {
			// 点击事件触发时，判断当前状态是拖拽还是点击，若是拖拽，直接返回不继续执行
			const isDrag = document.getElementById('wgDragContainer').getAttribute('drag-flag')
			if (isDrag === 'true') return;
			this.$emit("dblclick", e);
		}
	}
}
</script>
<style lang="less" scoped>
#wgDragContainer{
  position: fixed;
  z-index: 3000;
  cursor: move;
}
</style>