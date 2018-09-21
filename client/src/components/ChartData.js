//This file is not a component :o)

module.exports.gpaChartData = (data) => {

	let boothData = [];
	let globalData = [];

	data.booth.forEach((elem) => {
		boothData.push({ x: elem.bucket, y: elem.count });
	});

	data.global.forEach((elem) => {
		globalData.push({ x: elem.bucket, y: elem.count });
	});

	return {
		datasets: [
			{
				label: "Booth GPA Distribution",
				data: boothData,
				backgroundColor: 'rgba(31,177,61,0.5)',
				borderColor: 'rgba(31,177,61,0.7)',
			},
			{
				label: "Global GPA Distribution",
				data: globalData,
				backgroundColor: 'rgb(99,184,12,0.5)',
				borderColor: 'rgba(99,184,12,0.7)',
			}
		]
	}
}

module.exports.majorChartData = (data) => {

	let labels = [];
	let boothData = [];
	let globalData = [];

	data.booth.forEach((elem) => {
		labels.push(elem.major);
		boothData.push(elem.count);
	});

	data.global.forEach((elem) => {
		globalData.push(elem.count);
	});

	return {
		labels: labels,
		datasets: [

			{
				label: "Booth Major Count",
				data: boothData,
				backgroundColor: 'rgba(31,177,61,0.5)',
				borderColor: 'rgba(31,177,61,0.7)',
			},
			{
				label: "Global Major Count",
				data: globalData,
				backgroundColor: 'rgb(99,184,12,0.5)',
				borderColor: 'rgba(99,184,12,0.7)',
			}
		]
	}
}

module.exports.gpaChartOptions = {
	scales: {
		xAxes: [{
			type: 'linear',
			ticks: {
				min: 1,
				max: 4.0
			}
		}]
	}
};

module.exports.majorChartOptions = {
	scales: {
		xAxes: [{
			type: 'linear',
			ticks: {
				min: 0,
			}
		}]
	}
};
