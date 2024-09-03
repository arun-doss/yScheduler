const cron = require('cron');
const jsyaml = require('js-yaml');
const { setEngine } = require('node:crypto');
const fs = require('node:fs');
const { start } = require('node:repl');
let avrIP = "";

class SetAlarmCorn {
	constructor(cronTime, alarmEndTime) {
		this.cronTime = cronTime
		this.alarmEndTime = alarmEndTime

		this.endAlarm = ()=> {
			if(this.alarmEndTime !== undefined) {
				let endAlarmCron = new EndAlarmCron(this.alarmEndTime);
			}
		}
		this.alarmCronJob = new cron.CronJob(
			this.cronTime,
			function () {
				powerOn();
			},
			this.endAlarm(),
			true
		)
	}
	
	
}

class EndAlarmCron {
	constructor(cronTime) {
		this.cronTime = cronTime
		this.alarmEndCronJob = new cron.CronJob(
			this.cronTime,
			function () {
				powerOff()
			},
			null,
			true
		)
	}
	
}

try {
  	const settingsString = fs.readFileSync('./settings.yaml', 'utf8');
  	let settings = jsyaml.load(settingsString);
	avrIP = settings["AVR IP"]
	for(const alarmName in settings.ALARM) {
		let alarm = settings.ALARM[alarmName];
		let startTime = alarm["Start"];
		let endTime = alarm["End"];
		let startCronTime;
		let endCronTime;
		
		if(alarm["Frequency"] === "Weekends") { // days based have to be included
			startCronTime = `${startTime.split(":")[1]} ${startTime.split(":")[0]} * 1-5`
		} else if(alarm["Frequency"] === "Weekdays") {
			startCronTime = `${startTime.split(":")[1]} ${startTime.split(":")[0]} * 6,0`
		} else {
			startCronTime = `${startTime.split(":")[1]} ${startTime.split(":")[0]} * * *`;
		}
		if(endTime) {
			endCronTime = `${endTime.split(":")[1]} ${endTime.split(":")[0]} * * *`;
			console.log(`Alarm at ${startTime} with end time of ${endTime} is sheduled.`)
		} else {
			console.log(`Alarm at ${startTime} is scheduled.`)
		}

		const setAlarmCorn = new SetAlarmCorn(startCronTime, endCronTime);
		console.log(alarm);
	}
} catch (err) {
  console.error(err);
}

// Creating Alarms



let powerOff = ()=> {
	console.log("AVR powered off..");
	fetch(`http://${avrIP}/YamahaRemoteControl/ctrl`, {
		method:"POST",
		body:`<?xml version="1.0" encoding="utf-8"?><YAMAHA_AV cmd="PUT"><System><Power_Control><Power>Standby</Power></Power_Control></System></YAMAHA_AV>`
	});
	
}

let powerOn = ()=> {
	console.log("AVR powered On!")
	fetch(`http://${avrIP}/YamahaRemoteControl/ctrl`, {
		method:"POST",
		body:`<?xml version="1.0" encoding="utf-8"?><YAMAHA_AV cmd="PUT"><System><Power_Control><Power>On</Power></Power_Control></System></YAMAHA_AV>`
	});
	// Default set to Net Radio
	fetch(`http://${avrIP}/YamahaRemoteControl/ctrl`, {
		method:"POST",
		body:`<?xml version="1.0" encoding="utf-8"?><YAMAHA_AV cmd="PUT"><Main_Zone><Input><Input_Sel>NET RADIO</Input_Sel></Input></Main_Zone></YAMAHA_AV>`
	});
	// Default set to -55.0 dB as volume
	fetch(`http://${avrIP}/YamahaRemoteControl/ctrl`, {
		method:"POST",
		body:`<?xml version="1.0" encoding="utf-8"?><YAMAHA_AV cmd="PUT"><Main_Zone><Volume><Lvl><Val>-550</Val><Exp>1</Exp><Unit>dB</Unit></Lvl></Volume></Main_Zone></YAMAHA_AV>`
	});
}