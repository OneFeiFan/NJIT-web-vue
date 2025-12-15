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