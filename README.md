# YSchedule

Bash script to schedule and run tasks on Yamahaa AVR. Currenlty configured with following functions:

 1. ALARM

I have Yamahaa AVR RX V677, so I have tested on this device.

## Tested Devices:

1. Yamahaa AVR RX V677


## Installation

<!-- The script can be scheduled using [Windows Scheduler](https://www.windowscentral.com/how-create-automated-task-using-task-scheduler-windows-10)or [Linux Cronjob](https://www.hostinger.com/tutorials/cron-job) or [Mac Cronjob](https://support.apple.com/en-qa/guide/terminal/trml1003/mac) -->
Currently support is limited to linux, Kindly let me know if you need build for windows or mac.
### In Linux:

- Download the YSchedule along with settings.yaml file from [releases](/releases.md) page and keep in the same folder

- Make the YScheule file as executable
```chmod +x YShedule```
- Add the required number of alarms with on and off times (in 24:00 hr format) as mentioned in the below sample settings.yaml
```
#Sample for settings.yaml

ALARM:
    ALARM 1:
        Start:14:00 #2:00 PM (Mandatory)
        End:14:30 # (Optional, if skipped )
        Frequency:Daily #Everyday (Optinal, default Daily)
#        Frequency:Weekends #Saturday & Sunday
#        Frequency:Weekdays #Monday to Friday
#        Frequency:1111100 #Exact days of the week by 1 and 0's SMTWTFS - here it means Sunday - Thursday and skipping Friday and Saturdays
    Good Morning:
        Start:05:00 
        End:06:00
```




