export default function getCurriculumByUsernameAndPassword(rawData) {
    const weekdayMap = {
        "星期一": 1,
        "星期二": 2,
        "星期三": 3,
        "星期四": 4,
        "星期五": 5,
        "星期六": 6,
        "星期日": 7
    };
    try {
        const items = rawData.items;

        const courses = [];
        for (let m = 0; m < items.length; m++) {
            const item = items[m];
            let teacher = item.jsxx;
            let classroom = item.jxdd;
            const courseName = item.kcmc;
            const time = item.sksj;
            if (time === null || time === undefined) {
                continue;
            }
            if (classroom === null || classroom===undefined) {
                classroom = "上课地点未定";
            }
			
            let times = null
            let classrooms = null;
			try{
				// console.log(typeof time)
				times = time.split(';');
			}catch(e){
				console.log(e)
			}
            try{
				// console.log(typeof classroom)
            	classrooms = classroom.split(';');
            }catch(e){
            	console.log(e)
            }
			try{
				teacher = teacher.split('/')[1];
			}catch(e){
				console.log(e)
			}
            let j = 0;
            for (let t of times) {
                const weekday = t.substring(0, 3);
                const courseTime = t.substring(t.indexOf('第'), t.indexOf('{'));
                const weeks = t.substring(t.indexOf('{') + 1, t.indexOf('}'));
                const timeArray = getCourseTime(courseTime);
                const weekss = weeks.split(',');
				
                for (let week of weekss) {
                    if (!week.includes('-')) {
                        const course = {
                            name: courseName,
                            teacher: teacher,
                            time: {
                                weekday: weekdayMap[weekday],
                                timeArray: timeArray,
                                week: parseInt(week.substring(0, week.indexOf('周')))
                            },
                            classroom: classrooms[j]
                        };
                        courses.push(course);
                    } else {
                        const index = week.indexOf('(');
                        const pos = week.indexOf('-');
                        const left = parseInt(week.substring(0, pos));
                        const right = parseInt(week.substring(pos + 1, week.indexOf('周')));
                        if (index !== -1) {
                            const choice = week.charAt(index + 1);
                            if (choice === '单') {
                                for (let i = left; i <= right; i++) {
                                    if (i % 2 === 1) {
                                        const course = {
                                            name: courseName,
                                            teacher: teacher,
                                            time: {
                                                weekday: weekdayMap[weekday],
                                                timeArray: timeArray,
                                                week: i
                                            },
                                            classroom: classrooms[j]
                                        };
                                        courses.push(course);
                                    }
                                }
                            } else if (choice === '双') {
                                for (let i = left; i <= right; i++) {
                                    if (i % 2 === 0) {
                                        const course = {
                                            name: courseName,
                                            teacher: teacher,
                                            time: {
                                                weekday: weekdayMap[weekday],
                                                timeArray: timeArray,
                                                week: i
                                            },
                                            classroom: classrooms[j]
                                        };
                                        courses.push(course);
                                    }
                                }
                            }
                        } else {
                            for (let i = left; i <= right; i++) {
                                const course = {
                                    name: courseName,
                                    teacher: teacher,
                                    time: {
                                        weekday: weekdayMap[weekday],
                                        timeArray: timeArray,
                                        week: i
                                    },
                                    classroom: classrooms[j]
                                };
                                courses.push(course);
                            }
                        }
                    }
                }
                j++;
            }
        }

        const maxWeek = courses.reduce((max, course) => Math.max(max, course.time.week), 0);
        const result = Array.from({length: maxWeek + 1}, () => []);
        courses.forEach(course => {
            result[course.time.week].push(course);
        });

        return result;
    } catch (error) {
        console.log(error)
        return { success: false, message: "获取课表失败！" };
    }
}

function getCourseTime(courseTime) {
	try{
    courseTime = courseTime.replace(/第/g, '');
    courseTime = courseTime.replace(/节/g, '');
    const split = courseTime.split(',');
    const timeArray = [];
    for (let i = 0; i < split.length; i++) {
        const split1 = split[i].split('-');
        const left = parseInt(split1[0]);
        const right = parseInt(split1[1]);
        for (let j = left; j <= right; j++) {
            timeArray.push(j);
        }
    }
    return timeArray;
	}catch(e){
		console.log(e)
	}
}

export function getClassroom(rawData) {
    let items = rawData.items,classrooms = [];
    for (let itemsKey in items) {
        classrooms.push({
            "cdmc": items[itemsKey].cdmc,
            "jxlmc": items[itemsKey].jxlmc,
            "zws": items[itemsKey].zws
        });
    }
    return classrooms;
}

export function getScores(raw){
    let result = [];
    let item = raw.items;
    for (const element of item) {
        result.push({
            cj:element.cj,
            jd:element.jd,
            xf:element.xf,
            jsxm:element.jsxm,
            jxb_id:element.jxb_id,
            xnm:element.xnm,
            xqm:element.xqm,
            kcmc:element.kcmc,
            xnmmc:element.xnmmc,
            xqmmc:element.xqmmc,
        })
    }
    return result.reverse();
}