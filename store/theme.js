//定位主题包
import first_blue_light, {tabActiveColor, tabInactiveColor,_colorMap} from "./first_blue_light";
const themes = {
	defaultTheme: {
		name:'白色主题',
		bgColor: '#ffffff',  
		textColor: '#000000',
		style: first_blue_light,
		_colorMap: _colorMap,
		tabActiveColor: tabActiveColor,
		tabInactiveColor: tabInactiveColor
	},  
	blackTheme: {
		name: '黑色主题',
		bgColor: '#000000',
		textColor: '#ffffff',
		style: `
			--bg-color:#000000;
			--text-color:#fff;
		`
	}
};
export default themes